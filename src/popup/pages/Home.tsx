import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { StatusCard } from '../components/StatusCard';
import { Message } from '../../types/messages.types';

export const Home: React.FC = () => {
  const { isAuthenticated, selectedRepo, setAuthenticated, setLoading, isLoading } = useStore();
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleConnectGitHub = async () => {
    if (!token.trim()) {
      alert('Please enter a GitHub token');
      return;
    }

    setLoading(true);
    console.log('Starting GitHub authentication...');

    try {
      const message: Message = {
        type: 'AUTH_GITHUB',
        payload: token,
      };

      console.log('Sending AUTH_GITHUB message...');
      const response = await chrome.runtime.sendMessage(message);
      console.log('Received response:', response);

      if (response && response.success) {
        console.log('Authentication successful!');
        setAuthenticated(token, response.data.user || '');
        setShowTokenInput(false);
        setToken('');
      } else {
        console.error('Authentication failed:', response);
        alert('Failed to authenticate: ' + (response?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Failed to connect to GitHub. Please check console for details.');
    } finally {
      setLoading(false);
      console.log('Authentication flow completed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 animate-fade-in">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome to Leet2Git!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
          Connect your GitHub account to start syncing your LeetCode solutions
        </p>

        {!showTokenInput ? (
          <button onClick={() => setShowTokenInput(true)} className="btn btn-primary">
            Connect GitHub
          </button>
        ) : (
          <div className="w-full space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="input"
                onKeyPress={(e) => e.key === 'Enter' && handleConnectGitHub()}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  github.com/settings/tokens
                </a>
                <br />
                Required scope: <code className="text-blue-600">repo</code>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConnectGitHub}
                disabled={isLoading || !token.trim()}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
              <button
                onClick={() => {
                  setShowTokenInput(false);
                  setToken('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>✅ Your code stays private</p>
          <p>✅ Token stored securely</p>
          <p>✅ No data collected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <StatusCard />

      {!selectedRepo && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Repository Not Selected
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Please select a repository in Settings to start syncing solutions
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How it works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Solve a problem on LeetCode</li>
          <li>Submit your solution</li>
          <li>Leet2Git automatically syncs to GitHub</li>
          <li>Check your repository for the new solution</li>
        </ol>
      </div>

      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Quick Tip</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add <code className="text-blue-600 text-xs">?debug=leet2git</code> to any LeetCode problem
          URL to enable the test button for debugging.
        </p>
      </div>
    </div>
  );
};

