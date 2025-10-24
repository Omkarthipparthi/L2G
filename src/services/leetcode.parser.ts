import { Problem, Submission } from '../types/problem.types';

/**
 * Service for parsing LeetCode DOM and extracting problem/submission data
 */
export class LeetCodeParser {
  /**
   * Check if we're on a problem page
   */
  static isProblemPage(): boolean {
    return window.location.pathname.includes('/problems/');
  }

  /**
   * Check if submission was accepted
   * Looks for the success notification/banner
   */
  static isSubmissionAccepted(): boolean {
    // LeetCode shows "Accepted" in multiple places when submission succeeds
    const selectors = [
      '[data-e2e-locator="submission-result"]',
      '.success__3Ai7',
      '.result-state',
      '[class*="success"]',
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.toLowerCase() || '';
        if (text.includes('accepted') || text.includes('success')) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Extract problem details from the page
   */
  static extractProblemDetails(): Problem | null {
    try {
      // Extract title
      const title = this.extractTitle();
      if (!title) {
        console.error('Could not extract problem title');
        return null;
      }

      // Extract title slug from URL
      const titleSlug = this.extractTitleSlug();

      // Extract problem ID
      const problemId = this.extractProblemId();

      // Extract difficulty
      const difficulty = this.extractDifficulty();

      // Extract tags
      const tags = this.extractTags();

      // Extract description
      const description = this.extractDescription();

      return {
        id: problemId,
        title,
        titleSlug,
        difficulty,
        tags,
        description,
        descriptionHtml: description,
      };
    } catch (error) {
      console.error('Failed to extract problem details:', error);
      return null;
    }
  }

  /**
   * Extract problem title
   */
  private static extractTitle(): string {
    const selectors = [
      '[data-cy="question-title"]',
      '.css-v3d350',
      'div[class*="title"]',
      'h1',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        // Remove problem number prefix if present (e.g., "1. Two Sum" -> "Two Sum")
        const text = element.textContent.trim();
        return text.replace(/^\d+\.\s*/, '');
      }
    }

    return '';
  }

  /**
   * Extract title slug from URL
   */
  private static extractTitleSlug(): string {
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : '';
  }

  /**
   * Extract problem ID
   */
  private static extractProblemId(): number {
    // Try to get from title (e.g., "1. Two Sum")
    const titleElement = document.querySelector('[data-cy="question-title"]');
    if (titleElement?.textContent) {
      const match = titleElement.textContent.match(/^(\d+)\./);
      if (match) {
        return parseInt(match[1]);
      }
    }

    // Fallback: try to extract from URL or page data
    // For now, return 0 as placeholder (can be improved)
    return 0;
  }

  /**
   * Extract difficulty level
   */
  private static extractDifficulty(): 'Easy' | 'Medium' | 'Hard' {
    const selectors = [
      '[diff]',
      '[class*="difficulty"]',
      '.css-10o4wqw',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        const text = element.textContent.toLowerCase();
        if (text.includes('easy')) return 'Easy';
        if (text.includes('medium')) return 'Medium';
        if (text.includes('hard')) return 'Hard';
      }
    }

    return 'Medium'; // Default fallback
  }

  /**
   * Extract problem tags
   */
  private static extractTags(): string[] {
    const tags: string[] = [];
    const selectors = [
      '[data-cy="topic-tag"]',
      '[class*="topic-tag"]',
      'a[href*="/tag/"]',
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const tag = element.textContent?.trim();
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      });

      if (tags.length > 0) break;
    }

    return tags;
  }

  /**
   * Extract problem description
   */
  private static extractDescription(): string {
    const selectors = [
      '[data-track-load="description_content"]',
      '[class*="description"]',
      '.question-content',
      '[class*="content__"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    return '';
  }

  /**
   * Extract submitted code
   * Note: This is tricky as LeetCode uses Monaco Editor
   */
  static extractSubmittedCode(): { code: string; language: string } | null {
    try {
      // Try to get code from Monaco editor
      const code = this.getMonacoEditorContent();
      const language = this.detectLanguage();

      if (!code) {
        console.error('Could not extract code from editor');
        return null;
      }

      return { code, language };
    } catch (error) {
      console.error('Failed to extract submitted code:', error);
      return null;
    }
  }

  /**
   * Get content from Monaco editor
   */
  private static getMonacoEditorContent(): string {
    // Monaco editor stores content in window object
    try {
      // Try to access Monaco editor API
      if ((window as any).monaco?.editor) {
        const models = (window as any).monaco.editor.getModels();
        if (models && models.length > 0) {
          return models[0].getValue();
        }
      }

      // Fallback: try to get from textarea or code elements
      const codeElements = document.querySelectorAll('textarea, [class*="CodeMirror"], pre code');
      for (const element of codeElements) {
        if (element.textContent && element.textContent.length > 10) {
          return element.textContent;
        }
      }
    } catch (error) {
      console.error('Failed to get Monaco editor content:', error);
    }

    return '';
  }

  /**
   * Detect programming language from UI
   */
  private static detectLanguage(): string {
    const selectors = [
      '[data-cy="lang-select"]',
      '[id*="lang"]',
      'button[class*="lang"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim().toLowerCase();
      }
    }

    return 'unknown';
  }

  /**
   * Extract runtime and memory statistics
   */
  static extractStats(): { runtime: string; memory: string } {
    const stats = {
      runtime: 'N/A',
      memory: 'N/A',
    };

    // Look for runtime stat
    const runtimeSelectors = [
      '[data-e2e-locator="runtime"]',
      '[class*="runtime"]',
    ];

    for (const selector of runtimeSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        stats.runtime = element.textContent.trim();
        break;
      }
    }

    // Look for memory stat
    const memorySelectors = [
      '[data-e2e-locator="memory"]',
      '[class*="memory"]',
    ];

    for (const selector of memorySelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        stats.memory = element.textContent.trim();
        break;
      }
    }

    return stats;
  }

  /**
   * Create a complete submission object
   */
  static createSubmission(
    problem: Problem,
    code: string,
    language: string,
    stats: { runtime: string; memory: string }
  ): Submission {
    return {
      id: this.generateSubmissionId(),
      problemId: problem.id,
      problem,
      code,
      language,
      timestamp: Date.now(),
      runtime: stats.runtime,
      memory: stats.memory,
      status: 'Accepted',
    };
  }

  /**
   * Generate unique submission ID
   */
  private static generateSubmissionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

