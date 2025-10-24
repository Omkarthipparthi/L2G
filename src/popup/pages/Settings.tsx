import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { SettingsForm } from '../components/SettingsForm';
import { Message } from '../../types/messages.types';
import { GitHubRepo } from '../../types/github.types';

export const Settings: React.FC = () => {
  const {
    repositories,
    selectedRepo,
    setRepositories,
    setSelectedRepo,
    setLoading,
    isLoading,
    isAuthenticated,
  } = useStore();

  const [showCreateRepo, setShowCreateRepo] = useState(false);
  const [newRepoName, setNewRepoName] = useState('leetcode-solutions');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadRepositories();
    }
  }, [isAuthenticated]);

  const loadRepositories = async () => {
    setLoading(true);
    try {
      const message: Message = { type: 'GET_REPOS' };
      const response = await chrome.runtime.sendMessage(message);

      if (response.success) {
        setRepositories(response.data);
      } else {
        console.error('Failed to load repos:', response.error);
      }
    } catch (error) {
      console.error('Error loading repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = async (repoFullName: string) => {
    setSelectedRepo(repoFullName);
    try {
      await chrome.storage.sync.set({ selectedRepo: repoFullName });
    } catch (error) {
      console.error('Failed to save selected repo:', error);
    }
  };

  const handleCreateRepo = async () => {
    if (!newRepoName.trim()) {
      alert('Please enter a repository name');
      return;
    }

    setLoading(true);
    try {
      const message: Message = {
        type: 'CREATE_REPO',
        payload: {
          name: newRepoName,
          isPrivate,
          description: 'My LeetCode solutions synced with Leet2Git',
        },
      };

      const response = await chrome.runtime.sendMessage(message);

      if (response.success) {
        const newRepo = response.data as GitHubRepo;
        setRepositories([newRepo, ...repositories]);
        setSelectedRepo(newRepo.full_name);
        setShowCreateRepo(false);
        setNewRepoName('leetcode-solutions');
        setIsPrivate(false);
      } else {
        alert('Failed to create repository: ' + response.error);
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      alert('Failed to create repository');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect GitHub? This will clear all data.')) {
      return;
    }

    try {
      await chrome.storage.sync.clear();
      window.location.reload();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please connect to GitHub to access settings
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Repository Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Repository</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Select Repository
            </label>
            <select
              value={selectedRepo || ''}
              onChange={(e) => handleSelectRepo(e.target.value)}
              className="select"
              disabled={isLoading}
            >
              <option value="">-- Select a repository --</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name} {repo.private && '🔒'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadRepositories}
              disabled={isLoading}
              className="btn btn-secondary btn-sm flex-1"
            >
              {isLoading ? 'Loading...' : '🔄 Refresh'}
            </button>
            <button
              onClick={() => setShowCreateRepo(!showCreateRepo)}
              className="btn btn-primary btn-sm flex-1"
            >
              ➕ Create New
            </button>
          </div>

          {showCreateRepo && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="leetcode-solutions"
                  className="input"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Private Repository</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="flex gap-2">
                <button onClick={handleCreateRepo} disabled={isLoading} className="btn btn-primary btn-sm flex-1">
                  Create
                </button>
                <button
                  onClick={() => setShowCreateRepo(false)}
                  className="btn btn-secondary btn-sm flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Form */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Sync Settings
        </h2>
        <SettingsForm />
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200 dark:border-red-800">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Disconnecting will remove all saved data including submissions and sync history.
          </p>
          <button onClick={handleDisconnect} className="btn btn-danger">
            Disconnect GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

