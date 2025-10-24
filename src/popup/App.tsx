import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { History } from './pages/History';
import { Message } from '../types/messages.types';

export const App: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setSettings,
    setSubmissions,
    setSyncHistory,
    setAuthenticated,
    setSelectedRepo,
    setRepositories,
  } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load settings
      const settingsMessage: Message = { type: 'GET_SETTINGS' };
      const settingsResponse = await chrome.runtime.sendMessage(settingsMessage);
      if (settingsResponse.success) {
        setSettings(settingsResponse.data);
      }

      // Load submissions
      const submissionsMessage: Message = { type: 'GET_SUBMISSIONS' };
      const submissionsResponse = await chrome.runtime.sendMessage(submissionsMessage);
      if (submissionsResponse.success) {
        setSubmissions(submissionsResponse.data || []);
      }

      // Load sync history
      const historyMessage: Message = { type: 'GET_SYNC_HISTORY' };
      const historyResponse = await chrome.runtime.sendMessage(historyMessage);
      if (historyResponse.success) {
        setSyncHistory(historyResponse.data || []);
      }

      // Load auth status
      const storageData = await chrome.storage.sync.get([
        'githubToken',
        'selectedRepo',
      ]);

      if (storageData.githubToken) {
        // Test connection to get user
        const testMessage: Message = { type: 'TEST_CONNECTION' };
        const testResponse = await chrome.runtime.sendMessage(testMessage);

        if (testResponse.success && testResponse.data.success) {
          setAuthenticated(storageData.githubToken, testResponse.data.user || '');

          // Load repositories
          const reposMessage: Message = { type: 'GET_REPOS' };
          const reposResponse = await chrome.runtime.sendMessage(reposMessage);
          if (reposResponse.success) {
            setRepositories(reposResponse.data || []);
          }
        }
      }

      if (storageData.selectedRepo) {
        setSelectedRepo(storageData.selectedRepo);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div className="w-[420px] min-h-[600px] max-h-[600px] bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex shadow-sm">
        <TabButton
          label="Home"
          icon="🏠"
          active={currentTab === 'home'}
          onClick={() => setCurrentTab('home')}
        />
        <TabButton
          label="Settings"
          icon="⚙️"
          active={currentTab === 'settings'}
          onClick={() => setCurrentTab('settings')}
        />
        <TabButton
          label="History"
          icon="📜"
          active={currentTab === 'history'}
          onClick={() => setCurrentTab('history')}
        />
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {currentTab === 'home' && <Home />}
        {currentTab === 'settings' && <Settings />}
        {currentTab === 'history' && <History />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Made with ❤️ for LeetCode</span>
          <a
            href="https://github.com/yourusername/leet2git"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 text-sm font-medium transition-all ${
        active
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  );
};

