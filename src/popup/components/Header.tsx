import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Leet2Git</h1>
            <p className="text-xs text-blue-100">LeetCode → GitHub</p>
          </div>
        </div>
        <span className="text-xs text-blue-200 font-medium">v1.0.0</span>
      </div>
    </header>
  );
};

