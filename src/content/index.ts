import { LeetCodeParser } from '../services/leetcode.parser';
import { Submission } from '../types/problem.types';
import { Message } from '../types/messages.types';

console.log('🚀 Leet2Git: Content script loaded');

// Track last submission to avoid duplicates
let lastSubmissionId = '';
let isProcessing = false;

/**
 * Initialize content script
 */
function init() {
  if (!LeetCodeParser.isProblemPage()) {
    console.log('Not on a problem page, content script idle');
    return;
  }

  console.log('On LeetCode problem page, monitoring for submissions...');

  // Set up mutation observer to watch for submission results
  setupSubmissionObserver();

  // Add debug mode button if enabled
  if (window.location.search.includes('debug=leet2git')) {
    addDebugButton();
  }
}

/**
 * Set up MutationObserver to detect submission results
 */
function setupSubmissionObserver() {
  const observer = new MutationObserver((mutations) => {
    // Debounce rapid mutations
    if (isProcessing) return;

    // Check if any mutation might indicate a submission result
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        checkForSubmission();
        break;
      }
    }
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('Submission observer started');
}

/**
 * Check if a successful submission occurred
 */
async function checkForSubmission() {
  if (isProcessing) return;

  if (!LeetCodeParser.isProblemPage()) return;

  if (!LeetCodeParser.isSubmissionAccepted()) return;

  console.log('✅ Accepted submission detected!');

  isProcessing = true;

  try {
    await processSubmission();
  } catch (error) {
    console.error('Failed to process submission:', error);
    showNotification('❌ Failed to process submission', 'error');
  } finally {
    // Reset processing flag after a delay to prevent immediate re-processing
    setTimeout(() => {
      isProcessing = false;
    }, 3000);
  }
}

/**
 * Process the submission and send to background
 */
async function processSubmission() {
  // Extract problem details
  const problem = LeetCodeParser.extractProblemDetails();
  if (!problem) {
    console.error('Failed to extract problem details');
    showNotification('❌ Could not extract problem details', 'error');
    return;
  }

  console.log('Problem details extracted:', problem);

  // Wait a bit for code to be available
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Extract code
  const codeData = LeetCodeParser.extractSubmittedCode();
  if (!codeData) {
    console.error('Failed to extract code');
    showNotification('❌ Could not extract solution code', 'error');
    return;
  }

  console.log('Code extracted, language:', codeData.language);

  // Extract stats
  const stats = LeetCodeParser.extractStats();

  // Create submission object
  const submission: Submission = LeetCodeParser.createSubmission(
    problem,
    codeData.code,
    codeData.language,
    stats
  );

  // Check for duplicate
  if (submission.id === lastSubmissionId) {
    console.log('Duplicate submission detected, skipping');
    return;
  }

  lastSubmissionId = submission.id;

  console.log('Sending submission to background worker...');

  // Send to background worker
  await sendSubmissionToBackground(submission);
}

/**
 * Send submission to background worker
 */
async function sendSubmissionToBackground(submission: Submission) {
  try {
    // Check if extension context is valid
    if (!chrome.runtime?.id) {
      console.error('Extension context invalidated - try reloading the page');
      showNotification('❌ Extension context lost. Please reload the page.', 'error');
      return;
    }

    const message: Message = {
      type: 'SUBMISSION_DETECTED',
      payload: submission,
    };

    console.log('Sending message to background worker...');
    const response = await chrome.runtime.sendMessage(message);
    console.log('Response received:', response);

    if (!response) {
      console.error('No response from background worker');
      showNotification('❌ Background worker not responding. Try reloading extension.', 'error');
      return;
    }

    if (response.success) {
      console.log('✅ Submission sent successfully:', response);
      showNotification('✅ Solution detected! Syncing to GitHub...', 'success');

      // Show sync result after a delay
      setTimeout(() => {
        if (response.data?.commitUrl) {
          showNotification('🎉 Synced to GitHub!', 'success');
        }
      }, 2000);
    } else {
      console.error('Failed to sync:', response.error);
      showNotification(`❌ Failed to sync: ${response.error}`, 'error');
    }
  } catch (error: any) {
    console.error('Failed to send submission:', error);
    
    // More specific error messages
    if (error.message?.includes('Extension context invalidated')) {
      showNotification('❌ Extension reloaded. Please refresh this page.', 'error');
    } else if (error.message?.includes('Could not establish connection')) {
      showNotification('❌ Background worker not running. Check extension.', 'error');
    } else {
      showNotification('❌ Failed to communicate with extension', 'error');
    }
  }
}

/**
 * Show notification on page
 */
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Remove any existing notification
  const existingNotification = document.getElementById('leet2git-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'leet2git-notification';
  notification.textContent = message;

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s ease-out';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Add debug button for testing
 */
function addDebugButton() {
  const button = document.createElement('button');
  button.textContent = '🧪 Test Leet2Git';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  `;

  button.addEventListener('click', () => {
    console.log('Debug button clicked');
    checkForSubmission();
  });

  button.addEventListener('mouseenter', () => {
    button.style.background = '#2563eb';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = '#3b82f6';
  });

  document.body.appendChild(button);
  console.log('Debug button added');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle dynamic page navigation (SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL changed, reinitializing...');
    init();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for extension reload/update
chrome.runtime.onMessage.addListener((_message, _sender, _sendResponse) => {
  // Keep listener alive
  return true;
});

// Periodic check to detect if extension context is still valid
setInterval(() => {
  if (!chrome.runtime?.id) {
    console.warn('⚠️ Extension context invalidated - page reload required');
    showNotification('⚠️ Extension updated. Please refresh this page!', 'info');
  }
}, 30000); // Check every 30 seconds

