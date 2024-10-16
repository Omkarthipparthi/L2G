// src/content-script.ts
function detectCodeSubmission() {
    // Logic to detect when a code submission occurs on LeetCode
    const submitButton = document.querySelector('[data-cy="submit-code-btn"]');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        setTimeout(() => {
          const code = extractCode();
          const problemTitle = extractProblemTitle();
          if (code && problemTitle) {
            chrome.runtime.sendMessage({
              action: 'codeSubmitted',
              code: code,
              problemTitle: problemTitle
            });
          }
        }, 2000); // Wait for submission to process
      });
    }
  }
  
  function extractCode(): string | null {
    const codeElement = document.querySelector('.CodeMirror-code');
    return codeElement ? codeElement.textContent : null;
  }
  
  function extractProblemTitle(): string | null {
    const titleElement = document.querySelector('[data-cy="question-title"]');
    return titleElement ? titleElement.textContent : null;
  }
  
  detectCodeSubmission();