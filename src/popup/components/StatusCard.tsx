import React from 'react';
import { useStore } from '../../store/useStore';

export const StatusCard: React.FC = () => {
  const { isAuthenticated, githubUser, submissions, syncHistory, selectedRepo } = useStore();

  const successfulSyncs = syncHistory.filter((r) => r.status === 'success').length;
  const failedSyncs = syncHistory.filter((r) => r.status === 'failed').length;

  return (
    <div className="card animate-slide-up">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Status</h2>

      <div className="space-y-3">
        <StatusItem
          label="GitHub"
          value={
            isAuthenticated ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connected {githubUser && `(@${githubUser})`}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Not Connected
              </span>
            )
          }
        />

        {isAuthenticated && (
          <>
            <StatusItem
              label="Repository"
              value={selectedRepo || <span className="text-yellow-600">Not Selected</span>}
            />

            <StatusItem label="Total Submissions" value={submissions.length.toString()} />

            <StatusItem
              label="Successful Syncs"
              value={
                <span className="text-green-600 font-semibold">{successfulSyncs.toString()}</span>
              }
            />

            {failedSyncs > 0 && (
              <StatusItem
                label="Failed Syncs"
                value={<span className="text-red-600 font-semibold">{failedSyncs.toString()}</span>}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  value: React.ReactNode;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
};

