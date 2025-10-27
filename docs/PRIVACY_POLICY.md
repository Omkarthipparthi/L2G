# Privacy Policy for Leet2Git

**Last Updated:** October 26, 2025

## Overview

Leet2Git ("we", "our", or "the extension") is a Chrome browser extension that automatically saves your LeetCode problem solutions to your GitHub repository. We are committed to protecting your privacy and being transparent about how we handle your data.

## Information We Collect

### 1. GitHub Authentication Data
- **What:** GitHub Personal Access Token or OAuth token
- **Why:** To authenticate with GitHub API and commit your code to your repository
- **How Stored:** Encrypted using Chrome's built-in storage encryption (`chrome.storage.sync`)
- **Retention:** Stored until you disconnect your GitHub account or uninstall the extension

### 2. LeetCode Submission Data
- **What:** 
  - Problem information (title, ID, difficulty, tags, description)
  - Your submitted code solutions
  - Submission metadata (language, runtime, memory usage, timestamp)
- **Why:** To format and organize your solutions before syncing to GitHub
- **How Stored:** Locally in your browser using Chrome Storage API (`chrome.storage.local`)
- **Retention:** Up to 100 most recent submissions (automatically rotates older submissions)

### 3. User Settings and Preferences
- **What:** 
  - Auto-sync preferences
  - Folder structure preferences
  - Selected GitHub repository
  - Excluded problems list
  - Theme preferences
  - Commit message templates
- **Why:** To customize the extension behavior according to your preferences
- **How Stored:** `chrome.storage.sync` (syncs across your Chrome browsers)
- **Retention:** Stored until you change settings or uninstall the extension

### 4. Sync History
- **What:** Records of sync operations (timestamps, success/failure status, commit URLs)
- **Why:** To provide you with a history of synced submissions and troubleshoot issues
- **How Stored:** Locally in `chrome.storage.local`
- **Retention:** Up to 50 most recent sync records (automatically rotates)

## How We Use Your Information

We use the collected information solely to provide the core functionality of the extension:

1. **Authentication:** Your GitHub token is used to authenticate API requests to GitHub
2. **Code Syncing:** Your LeetCode solutions are formatted and committed to your selected GitHub repository
3. **Organization:** Problem data is used to organize your solutions in folders (by difficulty, category, or date)
4. **History Tracking:** Submission and sync records help you track what has been synced and when

## Data Sharing and Third Parties

### GitHub API
- Your code and problem data are sent directly to GitHub's API to create commits in your repository
- We use the official GitHub API via the Octokit library
- GitHub's privacy policy applies to data stored in your GitHub account: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

### No Other Third Parties
- We do NOT share, sell, or transfer your data to any other third parties
- We do NOT use your data for advertising, analytics, or any purpose other than the extension's core functionality
- We do NOT collect any data for our own purposes

## Data Storage and Security

### Local Storage
- All data is stored locally on your device using Chrome's Storage API
- Chrome automatically encrypts sensitive data like tokens
- No data is transmitted to our servers (we don't have any servers)

### GitHub Communication
- All communication with GitHub uses HTTPS (encrypted)
- Your GitHub token is never logged or exposed in plain text
- Tokens are stored using Chrome's secure storage mechanisms

## Your Data Rights

### Access
- All your data is stored locally on your device
- You can view your stored submissions and sync history in the extension's History page

### Deletion
You can delete your data at any time:
1. **Clear All Data:** Click "Clear All Data" in the Settings page (disconnects GitHub, clears all submissions and history)
2. **Disconnect GitHub:** Removes your GitHub token from storage
3. **Uninstall Extension:** Automatically removes all stored data

### Export
- Your synced code is already in your GitHub repository
- Submission history can be viewed in the extension's History page

## Permissions Explained

The extension requests the following Chrome permissions:

### Required Permissions
- **`storage`:** To save your settings, GitHub token, and submission history locally
- **`identity`:** For GitHub OAuth authentication flow
- **`alarms`:** To keep the background service worker active for processing submissions

### Host Permissions
- **`https://leetcode.com/*`:** To detect when you successfully submit a problem and extract the solution code
- **`https://api.github.com/*`:** To communicate with GitHub API to sync your solutions

We do NOT request permissions for:
- Browsing history
- Cookies from other sites
- Webcam/microphone
- Your files
- Other websites besides LeetCode

## Children's Privacy

This extension is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Changes will be reflected by updating the "Last Updated" date at the top of this policy. We encourage you to review this policy periodically.

Significant changes will be communicated through:
- Extension update notes
- Notification in the extension popup

## Data Retention

- **Submissions:** Automatically limited to 100 most recent (older submissions are automatically deleted)
- **Sync History:** Automatically limited to 50 most recent records
- **GitHub Token:** Retained until you disconnect or uninstall
- **Settings:** Retained until you change them or uninstall

## International Data Transfers

Since all data is stored locally on your device, there are no international data transfers except:
- When you sync to GitHub (governed by GitHub's policies and your GitHub account location)

## Open Source

Leet2Git is open source software. You can review our code and data handling practices at:
https://github.com/Omkarthipparthi/L2G

## Contact Us

If you have questions or concerns about this privacy policy or how we handle your data:

- **Email:** omkarthipparthi@gmail.com
- **GitHub Issues:** https://github.com/Omkarthipparthi/L2G/issues
- **Website:** https://github.com/Omkarthipparthi/L2G

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Chrome Web Store User Data Privacy Policy
- Google API Services User Data Policy (Limited Use requirements)

## Your Consent

By installing and using Leet2Git, you consent to this privacy policy and our data handling practices as described herein.

---

**Note to Users:** This extension operates entirely on your local device. We cannot access your data, and we do not have any servers collecting information. Your privacy and security are our top priorities.

