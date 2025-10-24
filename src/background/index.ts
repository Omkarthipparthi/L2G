import { Message, MessageResponse } from '../types/messages.types';
import { Submission } from '../types/problem.types';
import { StorageService } from '../services/storage.service';
import { GitHubService } from '../services/github.service';
import { Settings } from '../types/storage.types';

console.log('🚀 Leet2Git: Background service worker started');

/**
 * Keep service worker alive
 */
let keepAliveInterval: number | null = null;

function startKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  
  keepAliveInterval = setInterval(() => {
    chrome.storage.local.set({ keepAlive: Date.now() });
  }, 20000) as unknown as number; // Every 20 seconds
}

startKeepAlive();

/**
 * Listen for messages from content script and popup
 */
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  console.log('📨 Received message:', message.type, message);

  // Keep worker alive during message processing
  startKeepAlive();

  handleMessage(message)
    .then((response) => {
      console.log('✅ Sending response:', response);
      sendResponse(response);
    })
    .catch((error) => {
      console.error('❌ Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    });

  // Return true to indicate async response
  return true;
});

/**
 * Handle incoming messages
 */
async function handleMessage(message: Message): Promise<MessageResponse> {
  try {
    switch (message.type) {
      case 'SUBMISSION_DETECTED':
        return await handleSubmission(message.payload as Submission);

      case 'AUTH_GITHUB':
        return await handleGitHubAuth(message.payload as string);

      case 'TEST_CONNECTION':
        return await handleTestConnection();

      case 'GET_REPOS':
        return await handleGetRepos();

      case 'CREATE_REPO':
        return await handleCreateRepo(
          message.payload as { name: string; isPrivate: boolean; description?: string }
        );

      case 'GET_SETTINGS':
        return await handleGetSettings();

      case 'UPDATE_SETTINGS':
        return await handleUpdateSettings(message.payload as Partial<Settings>);

      case 'GET_SUBMISSIONS':
        return await handleGetSubmissions();

      case 'GET_SYNC_HISTORY':
        return await handleGetSyncHistory();

      case 'MANUAL_SYNC':
        return await handleManualSync(message.payload as string);

      default:
        return { success: false, error: `Unknown message type: ${message.type}` };
    }
  } catch (error: any) {
    console.error('Error in handleMessage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle new submission from content script
 */
async function handleSubmission(submission: Submission): Promise<MessageResponse> {
  try {
    console.log('Processing submission:', submission.problem.title);

    // Save submission first
    await StorageService.addSubmission(submission);
    console.log('Submission saved to storage');

    // Get settings
    const settings = await StorageService.getSettings();

    // Check if auto-sync is enabled
    if (!settings.autoSync) {
      console.log('Auto-sync disabled, skipping GitHub sync');
      return {
        success: true,
        data: { synced: false, reason: 'Auto-sync disabled' },
      };
    }

    // Check if problem is excluded
    if (settings.excludedProblems.includes(submission.problemId)) {
      console.log('Problem is excluded, skipping sync');
      return {
        success: true,
        data: { synced: false, reason: 'Problem excluded' },
      };
    }

    // Check if GitHub is connected
    const token = await StorageService.getGitHubToken();
    if (!token) {
      console.log('GitHub not connected, skipping sync');
      return {
        success: true,
        data: { synced: false, reason: 'GitHub not connected' },
      };
    }

    // Check if repository is selected
    const selectedRepo = await StorageService.getSelectedRepo();
    if (!selectedRepo) {
      console.log('No repository selected, skipping sync');
      return {
        success: true,
        data: { synced: false, reason: 'No repository selected' },
      };
    }

    // Sync to GitHub
    console.log('Syncing to GitHub...');
    const result = await GitHubService.syncSubmission(submission);

    // Save sync record
    await StorageService.addSyncRecord({
      id: `sync_${Date.now()}`,
      submissionId: submission.id,
      timestamp: Date.now(),
      status: result.success ? 'success' : 'failed',
      error: result.error,
      commitUrl: result.commitUrl,
    });

    if (result.success) {
      console.log('✅ Successfully synced to GitHub:', result.commitUrl);
    } else {
      console.error('❌ Failed to sync to GitHub:', result.error);
    }

    return {
      success: true,
      data: {
        synced: result.success,
        commitUrl: result.commitUrl,
        error: result.error,
      },
    };
  } catch (error: any) {
    console.error('Error handling submission:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle GitHub authentication
 */
async function handleGitHubAuth(token: string): Promise<MessageResponse> {
  console.log('🔐 handleGitHubAuth called');

  try {
    if (!token) {
      console.error('No token provided');
      return { success: false, error: 'Token is required' };
    }

    console.log('Setting GitHub token...');
    // Set token
    await GitHubService.setToken(token);
    console.log('Token set successfully');

    // Test connection
    console.log('Testing GitHub connection...');
    const testResult = await GitHubService.testConnection();
    console.log('Test result:', testResult);

    if (testResult.success) {
      console.log('✅ GitHub authentication successful, user:', testResult.user);
      return {
        success: true,
        data: {
          authenticated: true,
          user: testResult.user,
        },
      };
    } else {
      console.error('❌ GitHub authentication failed:', testResult.error);
      await StorageService.set('githubToken', undefined);
      return {
        success: false,
        error: testResult.error || 'Authentication failed',
      };
    }
  } catch (error: any) {
    console.error('❌ Error handling GitHub auth:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

/**
 * Handle test connection
 */
async function handleTestConnection(): Promise<MessageResponse> {
  try {
    const result = await GitHubService.testConnection();
    return { success: result.success, data: result, error: result.error };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Handle get repositories
 */
async function handleGetRepos(): Promise<MessageResponse> {
  try {
    const repos = await GitHubService.getRepositories();
    console.log(`Found ${repos.length} repositories`);
    return { success: true, data: repos };
  } catch (error: any) {
    console.error('Error getting repositories:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle create repository
 */
async function handleCreateRepo(payload: {
  name: string;
  isPrivate: boolean;
  description?: string;
}): Promise<MessageResponse> {
  try {
    const repo = await GitHubService.createRepository(
      payload.name,
      payload.isPrivate,
      payload.description
    );
    console.log('Repository created:', repo.full_name);

    // Automatically select the new repo
    await StorageService.setSelectedRepo(repo.full_name);

    return { success: true, data: repo };
  } catch (error: any) {
    console.error('Error creating repository:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle get settings
 */
async function handleGetSettings(): Promise<MessageResponse> {
  try {
    const settings = await StorageService.getSettings();
    return { success: true, data: settings };
  } catch (error: any) {
    console.error('Error getting settings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle update settings
 */
async function handleUpdateSettings(updates: Partial<Settings>): Promise<MessageResponse> {
  try {
    await StorageService.updateSettings(updates);
    const settings = await StorageService.getSettings();
    console.log('Settings updated:', settings);
    return { success: true, data: settings };
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle get submissions
 */
async function handleGetSubmissions(): Promise<MessageResponse> {
  try {
    const submissions = await StorageService.getSubmissions();
    return { success: true, data: submissions };
  } catch (error: any) {
    console.error('Error getting submissions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle get sync history
 */
async function handleGetSyncHistory(): Promise<MessageResponse> {
  try {
    const history = await StorageService.getSyncHistory();
    return { success: true, data: history };
  } catch (error: any) {
    console.error('Error getting sync history:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle manual sync of existing submission
 */
async function handleManualSync(submissionId: string): Promise<MessageResponse> {
  try {
    const submissions = await StorageService.getSubmissions();
    const submission = submissions.find((s) => s.id === submissionId);

    if (!submission) {
      return { success: false, error: 'Submission not found' };
    }

    console.log('Manual sync requested for:', submission.problem.title);

    const result = await GitHubService.syncSubmission(submission);

    // Save sync record
    await StorageService.addSyncRecord({
      id: `sync_${Date.now()}`,
      submissionId: submission.id,
      timestamp: Date.now(),
      status: result.success ? 'success' : 'failed',
      error: result.error,
      commitUrl: result.commitUrl,
    });

    if (result.success) {
      console.log('✅ Manual sync successful:', result.commitUrl);
      return { success: true, data: result };
    } else {
      console.error('❌ Manual sync failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('Error in manual sync:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // First time installation
    console.log('🎉 Welcome to Leet2Git!');

    // Initialize default settings
    const settings = await StorageService.getSettings();
    console.log('Default settings initialized:', settings);

    // Open welcome page or popup
    // chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('Extension updated to version:', chrome.runtime.getManifest().version);
  }
});

/**
 * Handle extension startup
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started');
});

// Keep service worker alive by handling alarms (if needed)
chrome.alarms.create('keep-alive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keep-alive') {
    // console.log('Keep-alive ping');
  }
});

