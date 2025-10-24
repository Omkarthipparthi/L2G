import { create } from 'zustand';
import { Settings, SyncRecord } from '../types/storage.types';
import { Submission } from '../types/problem.types';
import { GitHubRepo } from '../types/github.types';

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  githubToken: string | null;
  githubUser: string | null;

  // Repositories
  repositories: GitHubRepo[];
  selectedRepo: string | null;

  // Settings
  settings: Settings | null;

  // Submissions & History
  submissions: Submission[];
  syncHistory: SyncRecord[];

  // UI State
  isLoading: boolean;
  error: string | null;
  currentTab: 'home' | 'settings' | 'history';

  // Actions
  setAuthenticated: (token: string, user: string) => void;
  setRepositories: (repos: GitHubRepo[]) => void;
  setSelectedRepo: (repo: string) => void;
  setSettings: (settings: Settings) => void;
  setSubmissions: (submissions: Submission[]) => void;
  setSyncHistory: (history: SyncRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentTab: (tab: 'home' | 'settings' | 'history') => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  githubToken: null,
  githubUser: null,
  repositories: [],
  selectedRepo: null,
  settings: null,
  submissions: [],
  syncHistory: [],
  isLoading: false,
  error: null,
  currentTab: 'home' as const,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  // Authentication
  setAuthenticated: (token, user) =>
    set({
      isAuthenticated: true,
      githubToken: token,
      githubUser: user,
      error: null,
    }),

  // Repositories
  setRepositories: (repos) => set({ repositories: repos }),

  setSelectedRepo: (repo) => set({ selectedRepo: repo }),

  // Settings
  setSettings: (settings) => set({ settings }),

  // Data
  setSubmissions: (submissions) => set({ submissions }),

  setSyncHistory: (history) => set({ syncHistory: history }),

  // UI
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Logout
  logout: () =>
    set({
      isAuthenticated: false,
      githubToken: null,
      githubUser: null,
      selectedRepo: null,
    }),

  // Reset everything
  reset: () => set(initialState),
}));

