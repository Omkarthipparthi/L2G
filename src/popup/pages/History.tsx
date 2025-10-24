import React from 'react';
import { useStore } from '../../store/useStore';
import { formatDate } from '../../utils/formatters';

export const History: React.FC = () => {
  const { submissions, syncHistory } = useStore();

  const getSubmissionStatus = (submissionId: string) => {
    const sync = syncHistory.find((s) => s.submissionId === submissionId);
    return sync?.status || 'pending';
  };

  const getCommitUrl = (submissionId: string) => {
    const sync = syncHistory.find((s) => s.submissionId === submissionId);
    return sync?.commitUrl;
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-5xl mb-3">📝</div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">No submissions yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Solve problems on LeetCode to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Submission History
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {submissions.length} total
        </span>
      </div>

      <div className="space-y-2">
        {submissions
          .slice()
          .reverse()
          .map((submission) => {
            const status = getSubmissionStatus(submission.id);
            const commitUrl = getCommitUrl(submission.id);

            return (
              <div
                key={submission.id}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {submission.problem.title}
                      </h3>
                      <span
                        className={`badge ${
                          submission.problem.difficulty === 'Easy'
                            ? 'badge-easy'
                            : submission.problem.difficulty === 'Medium'
                            ? 'badge-medium'
                            : 'badge-hard'
                        }`}
                      >
                        {submission.problem.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{submission.language}</span>
                      <span>•</span>
                      <span>{formatDate(submission.timestamp)}</span>
                      {submission.runtime !== 'N/A' && (
                        <>
                          <span>•</span>
                          <span>{submission.runtime}</span>
                        </>
                      )}
                    </div>

                    {submission.problem.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {submission.problem.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {status === 'success' && (
                      <>
                        <span className="badge badge-success">✓ Synced</span>
                        {commitUrl && (
                          <a
                            href={commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View on GitHub →
                          </a>
                        )}
                      </>
                    )}
                    {status === 'failed' && (
                      <span className="badge badge-error">✗ Failed</span>
                    )}
                    {status === 'pending' && (
                      <span className="badge">⏳ Pending</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

