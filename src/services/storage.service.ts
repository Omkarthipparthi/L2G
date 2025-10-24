import { StorageData, Settings, DEFAULT_SETTINGS, SyncRecord } from '../types/storage.types';
import { Submission } from '../types/problem.types';

/**
 * Service for managing Chrome storage
 * Uses chrome.storage.sync for cross-device synchronization
 */
export class StorageService {
  /**
   * Get a value from storage
   */
  static async get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | undefined> {
    try {
      const result = await chrome.storage.sync.get(key);
      return result[key];
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return undefined;
    }
  }

  /**
   * Set a value in storage
   */
  static async set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
    try {
      await chrome.storage.sync.set({ [key]: value });
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
      throw error;
    }
  }

  /**
   * Get settings with defaults
   */
  static async getSettings(): Promise<Settings> {
    const settings = await this.get('settings');
    return settings || DEFAULT_SETTINGS;
  }

  /**
   * Update settings (merges with existing)
   */
  static async updateSettings(updates: Partial<Settings>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    await this.set('settings', updated);
  }

  /**
   * Get GitHub token
   */
  static async getGitHubToken(): Promise<string | undefined> {
    return this.get('githubToken');
  }

  /**
   * Set GitHub token
   */
  static async setGitHubToken(token: string): Promise<void> {
    await this.set('githubToken', token);
  }

  /**
   * Get selected repository
   */
  static async getSelectedRepo(): Promise<string | undefined> {
    return this.get('selectedRepo');
  }

  /**
   * Set selected repository
   */
  static async setSelectedRepo(repo: string): Promise<void> {
    await this.set('selectedRepo', repo);
  }

  /**
   * Get all submissions
   */
  static async getSubmissions(): Promise<Submission[]> {
    const submissions = await this.get('submissions');
    return submissions || [];
  }

  /**
   * Add a new submission
   */
  static async addSubmission(submission: Submission): Promise<void> {
    const submissions = await this.getSubmissions();
    submissions.push(submission);

    // Keep only last 100 submissions to avoid storage quota issues
    if (submissions.length > 100) {
      submissions.shift();
    }

    await this.set('submissions', submissions);
  }

  /**
   * Get sync history
   */
  static async getSyncHistory(): Promise<SyncRecord[]> {
    const history = await this.get('syncHistory');
    return history || [];
  }

  /**
   * Add sync record
   */
  static async addSyncRecord(record: SyncRecord): Promise<void> {
    const history = await this.getSyncHistory();
    history.push(record);

    // Keep only last 50 records
    if (history.length > 50) {
      history.shift();
    }

    await this.set('syncHistory', history);
  }

  /**
   * Clear all storage data
   */
  static async clear(): Promise<void> {
    try {
      await chrome.storage.sync.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  /**
   * Get storage usage info
   */
  static async getStorageInfo(): Promise<{ bytesInUse: number; quota: number }> {
    try {
      const bytesInUse = await chrome.storage.sync.getBytesInUse();
      // Chrome sync storage quota is 102,400 bytes
      return { bytesInUse, quota: 102400 };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { bytesInUse: 0, quota: 102400 };
    }
  }
}

