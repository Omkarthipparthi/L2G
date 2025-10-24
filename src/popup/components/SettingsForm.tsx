import React from 'react';
import { useStore } from '../../store/useStore';
import { Settings } from '../../types/storage.types';
import { Message } from '../../types/messages.types';

export const SettingsForm: React.FC = () => {
  const { settings, setSettings } = useStore();

  if (!settings) return null;

  const handleChange = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Send to background to save
    try {
      const message: Message = {
        type: 'UPDATE_SETTINGS',
        payload: updates,
      };
      await chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Auto Sync Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Auto Sync
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Automatically sync solutions to GitHub
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.autoSync}
            onChange={(e) => handleChange({ autoSync: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {/* Folder Structure */}
      <div>
        <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">
          Folder Structure
        </label>
        <select
          value={settings.folderStructure}
          onChange={(e) =>
            handleChange({ folderStructure: e.target.value as 'difficulty' | 'category' | 'date' })
          }
          className="select"
        >
          <option value="difficulty">By Difficulty (Easy/Medium/Hard)</option>
          <option value="category">By Category/Tags</option>
          <option value="date">By Date (Year/Month)</option>
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          How to organize your solutions in the repository
        </p>
      </div>

      {/* Include Description */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Include Problem Description
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Create README with problem details
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.includeDescription}
            onChange={(e) => handleChange({ includeDescription: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {/* Commit Message Template */}
      <div>
        <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">
          Commit Message Template
        </label>
        <input
          type="text"
          value={settings.commitMessageTemplate}
          onChange={(e) => handleChange({ commitMessageTemplate: e.target.value })}
          className="input"
          placeholder="Add {{problemId}}. {{title}}"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Variables: <code className="text-blue-600">{'{{problemId}}'}</code>,{' '}
          <code className="text-blue-600">{'{{title}}'}</code>,{' '}
          <code className="text-blue-600">{'{{difficulty}}'}</code>,{' '}
          <code className="text-blue-600">{'{{language}}'}</code>
        </p>
      </div>
    </div>
  );
};

