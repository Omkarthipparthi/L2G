// src/background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'codeSubmitted') {
      // Handle code submission
      // This is where I'll implement GitHub API calls
      console.log('Code submitted:', message.code);
      console.log('Problem:', message.problemTitle);
      // TODO: Implement GitHub API interaction
    }
  });