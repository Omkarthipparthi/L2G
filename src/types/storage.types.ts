import { Submission } from './problem.types';

export interface StorageData {
  githubToken?: string;
  selectedRepo?: string;
  settings: Settings;
  submissions: Submission[];
  syncHistory: SyncRecord[];
}

export interface Settings {
  autoSync: boolean;
  folderStructure: 'difficulty' | 'category' | 'date';
  includeDescription: boolean;
  commitMessageTemplate: string;
  excludedProblems: number[];
  theme: 'light' | 'dark';
}

export interface SyncRecord {
  id: string;
  submissionId: string;
  timestamp: number;
  status: 'success' | 'failed';
  error?: string;
  commitUrl?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  autoSync: true,
  folderStructure: 'difficulty',
  includeDescription: true,
  commitMessageTemplate: 'Add {{problemId}}. {{title}}',
  excludedProblems: [],
  theme: 'light',
};

