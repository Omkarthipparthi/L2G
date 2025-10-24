import { Octokit } from '@octokit/rest';
import { Submission } from '../types/problem.types';
import { GitHubRepo } from '../types/github.types';
import { StorageService } from './storage.service';
import {
  formatProblemTitle,
  getFileExtension,
  formatCommitMessage,
  formatProblemId,
} from '../utils/formatters';

/**
 * Service for GitHub API interactions
 */
export class GitHubService {
  private static octokit: Octokit | null = null;

  /**
   * Initialize Octokit with stored token
   */
  private static async getOctokit(): Promise<Octokit> {
    if (this.octokit) {
      return this.octokit;
    }

    const token = await StorageService.getGitHubToken();
    if (!token) {
      throw new Error('Not authenticated with GitHub. Please connect your account.');
    }

    this.octokit = new Octokit({
      auth: token,
    });

    return this.octokit;
  }

  /**
   * Reset Octokit instance (e.g., after token change)
   */
  static resetOctokit(): void {
    this.octokit = null;
  }

  /**
   * Set GitHub token and initialize Octokit
   */
  static async setToken(token: string): Promise<void> {
    console.log('GitHubService.setToken: Saving token to storage...');
    await StorageService.setGitHubToken(token);
    console.log('GitHubService.setToken: Creating Octokit instance...');
    this.octokit = new Octokit({ auth: token });
    console.log('GitHubService.setToken: Done');
  }

  /**
   * Test GitHub connection
   */
  static async testConnection(): Promise<{ success: boolean; user?: string; error?: string }> {
    console.log('GitHubService.testConnection: Starting...');
    try {
      if (!this.octokit) {
        console.log('GitHubService.testConnection: No octokit instance, getting from storage...');
      }
      const octokit = await this.getOctokit();
      console.log('GitHubService.testConnection: Got octokit, calling GitHub API...');
      const { data: user } = await octokit.users.getAuthenticated();
      console.log('GitHubService.testConnection: Success! User:', user.login);
      return { success: true, user: user.login };
    } catch (error: any) {
      console.error('GitHubService.testConnection: Failed:', error);
      return { success: false, error: error.message || 'Failed to connect to GitHub' };
    }
  }

  /**
   * Get authenticated user's repositories
   */
  static async getRepositories(): Promise<GitHubRepo[]> {
    try {
      const octokit = await this.getOctokit();

      const { data } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
        type: 'all',
      });

      return data as GitHubRepo[];
    } catch (error: any) {
      console.error('Failed to get repositories:', error);
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  /**
   * Create a new repository
   */
  static async createRepository(
    name: string,
    isPrivate: boolean = false,
    description?: string
  ): Promise<GitHubRepo> {
    try {
      const octokit = await this.getOctokit();

      const { data } = await octokit.repos.createForAuthenticatedUser({
        name,
        private: isPrivate,
        description: description || 'My LeetCode solutions synced with Leet2Git',
        auto_init: true,
      });

      return data as GitHubRepo;
    } catch (error: any) {
      console.error('Failed to create repository:', error);
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }

  /**
   * Sync submission to GitHub
   */
  static async syncSubmission(submission: Submission): Promise<{
    success: boolean;
    commitUrl?: string;
    error?: string;
  }> {
    try {
      const octokit = await this.getOctokit();
      const settings = await StorageService.getSettings();
      const selectedRepo = await StorageService.getSelectedRepo();

      if (!selectedRepo) {
        throw new Error('No repository selected. Please select a repository in settings.');
      }

      const [owner, repo] = selectedRepo.split('/');

      if (!owner || !repo) {
        throw new Error('Invalid repository format');
      }

      // Build file path
      const filePath = this.buildFilePath(submission, settings.folderStructure);

      // Get file extension
      const ext = getFileExtension(submission.language);
      const fileName = `solution.${ext}`;
      const fullPath = `${filePath}/${fileName}`;

      console.log(`Syncing to: ${owner}/${repo} - ${fullPath}`);

      // Check if file exists
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: fullPath,
        });

        if ('sha' in data) {
          sha = data.sha;
          console.log('File exists, will update');
        }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        console.log('File does not exist, will create');
      }

      // Format commit message
      const message = formatCommitMessage(
        submission.problem,
        submission.language,
        settings.commitMessageTemplate
      );

      // Create or update file
      const { data: commitData } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: fullPath,
        message,
        content: btoa(unescape(encodeURIComponent(submission.code))),
        sha,
      });

      console.log('File synced successfully:', commitData.commit.html_url);

      // Create README if enabled
      if (settings.includeDescription) {
        await this.createProblemReadme(octokit, owner, repo, filePath, submission);
      }

      return {
        success: true,
        commitUrl: commitData.commit.html_url,
      };
    } catch (error: any) {
      console.error('Failed to sync to GitHub:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Build file path based on folder structure setting
   */
  private static buildFilePath(
    submission: Submission,
    structure: 'difficulty' | 'category' | 'date'
  ): string {
    const problemSlug = formatProblemTitle(submission.problem.title);
    const problemId = formatProblemId(submission.problemId || submission.problem.id);
    const folderName = `${problemId}-${problemSlug}`;

    switch (structure) {
      case 'difficulty':
        return `${submission.problem.difficulty}/${folderName}`;

      case 'category':
        const category = submission.problem.tags[0] || 'Uncategorized';
        return `${category}/${folderName}`;

      case 'date':
        const date = new Date(submission.timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}/${month}/${folderName}`;

      default:
        return folderName;
    }
  }

  /**
   * Create README for problem
   */
  private static async createProblemReadme(
    octokit: Octokit,
    owner: string,
    repo: string,
    path: string,
    submission: Submission
  ): Promise<void> {
    const readmePath = `${path}/README.md`;
    const { problem } = submission;

    const content = `# ${problem.id}. ${problem.title}

**Difficulty:** ${problem.difficulty}

**Tags:** ${problem.tags.join(', ') || 'None'}

## Problem Description

${problem.description || 'No description available.'}

## Solution

**Language:** ${submission.language}

**Runtime:** ${submission.runtime}

**Memory:** ${submission.memory}

**Submitted:** ${new Date(submission.timestamp).toLocaleDateString()}

## Link

[View on LeetCode](https://leetcode.com/problems/${problem.titleSlug}/)
`;

    try {
      // Check if README exists
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: readmePath,
        });

        if ('sha' in data) {
          sha = data.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: readmePath,
        message: `Add README for problem ${problem.id}`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha,
      });

      console.log('README created successfully');
    } catch (error) {
      console.error('Failed to create README:', error);
      // Don't throw - README creation is optional
    }
  }

  /**
   * Get repository details
   */
  static async getRepository(owner: string, repo: string): Promise<GitHubRepo | null> {
    try {
      const octokit = await this.getOctokit();
      const { data } = await octokit.repos.get({ owner, repo });
      return data as GitHubRepo;
    } catch (error) {
      console.error('Failed to get repository:', error);
      return null;
    }
  }
}

