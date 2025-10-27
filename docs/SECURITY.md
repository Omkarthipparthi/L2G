# Security Policy for Leet2Git

## Overview

Security is a top priority for Leet2Git. This document explains the security measures we implement to protect your data and how to report security vulnerabilities.

## Security Measures

### 1. Token Storage and Protection

#### GitHub Access Tokens
- **Encrypted Storage:** Tokens are stored using Chrome's `chrome.storage.sync` API, which is automatically encrypted by Chrome
- **Never in Code:** Tokens are never hardcoded or logged in production builds
- **HTTPS Only:** All API communication with GitHub uses HTTPS encryption
- **Scoped Access:** We request minimal permissions (only `repo` scope needed)

**Best Practices for Users:**
1. Use GitHub Personal Access Tokens with minimal scopes
2. Prefer OAuth tokens over personal access tokens when possible
3. Regularly rotate your tokens in GitHub settings
4. Revoke token access if you suspect compromise

### 2. Data Transmission Security

#### GitHub API Communication
- **Protocol:** All requests use HTTPS (TLS 1.2+)
- **Authentication:** Token-based authentication (Bearer token in headers)
- **No Man-in-the-Middle:** Direct communication with GitHub API only
- **Certificate Validation:** Chrome automatically validates SSL certificates

#### LeetCode Content Script
- **Read-Only Access:** Content script only reads problem data and your submitted code
- **No Account Access:** Never accesses your LeetCode credentials or password
- **No Injection:** Doesn't inject scripts or modify LeetCode functionality
- **Isolated Context:** Runs in isolated Chrome extension context

### 3. Data Storage Security

#### Local Storage (chrome.storage.local)
```typescript
// What's stored:
- Submission history (last 100 submissions)
- Sync history (last 50 records)
```

**Security Features:**
- Isolated per-extension (other extensions can't access)
- Isolated per-profile (other Chrome users can't access)
- Automatic cleanup (old data rotated out)

#### Sync Storage (chrome.storage.sync)
```typescript
// What's stored:
- GitHub token (encrypted)
- User settings
- Selected repository
```

**Security Features:**
- Chrome-encrypted automatically
- Synced securely across your Chrome browsers
- Google account authentication required

### 4. Permissions and Sandboxing

#### Minimal Permissions Principle
We only request permissions absolutely necessary for core functionality:

```json
{
  "permissions": ["storage", "identity", "alarms"],
  "host_permissions": [
    "https://leetcode.com/*",
    "https://api.github.com/*"
  ]
}
```

**Why Each Permission:**
- `storage`: Save settings and data locally (encrypted)
- `identity`: GitHub OAuth authentication
- `alarms`: Keep service worker alive
- `leetcode.com`: Detect submissions (read-only)
- `api.github.com`: Sync to GitHub

**Permissions We DON'T Request:**
- ❌ Browsing history
- ❌ All websites access
- ❌ Tabs permission (read all pages)
- ❌ Cookies from other sites
- ❌ Downloads
- ❌ Clipboard

### 5. Content Security Policy

Extension follows Chrome's default CSP for Manifest V3:
```
script-src 'self'; object-src 'self'
```

**This prevents:**
- Inline script execution
- Loading scripts from external sources
- Code injection attacks

### 6. Input Validation and Sanitization

#### User Input Validation
```typescript
// Settings validation
- Auto-sync: boolean only
- Folder structure: limited enum values
- Commit template: string sanitized

// Repository names validated against GitHub format
- Format: owner/repo-name
- Characters: alphanumeric, hyphens, underscores
```

#### API Response Validation
- All GitHub API responses validated before storage
- Error handling prevents crashes from malformed data
- Type checking with TypeScript

### 7. No External Dependencies at Runtime

**Build Dependencies Only:**
- React, Vite, TypeScript (development only)
- Octokit (bundled, not loaded externally)

**No External Calls:**
- No analytics services
- No error reporting to external servers
- No CDNs loaded at runtime
- No tracking pixels

## Known Security Considerations

### 1. GitHub Token Security

**Current Implementation:**
- Tokens stored in Chrome storage (encrypted by Chrome)
- Tokens have full `repo` scope access

**Recommendations:**
- Use fine-grained personal access tokens when available
- Limit token to specific repositories
- Rotate tokens regularly
- Revoke tokens when not using extension

### 2. Content Script Context

**What Content Script Can Access:**
- ✅ DOM of LeetCode problem pages
- ✅ Your submitted code visible in the editor
- ✅ Problem metadata (title, description, difficulty)

**What Content Script CANNOT Access:**
- ❌ Your LeetCode password or login credentials
- ❌ Other users' solutions
- ❌ LeetCode cookies or session tokens
- ❌ Data from other websites

### 3. Local Storage Limits

**Automatic Data Rotation:**
- Submissions: Limited to 100 most recent
- Sync history: Limited to 50 records
- Prevents storage quota issues
- Old data automatically deleted

## Security Best Practices for Users

### 1. Secure Your GitHub Token

✅ **DO:**
- Use OAuth flow when available
- Create token with minimal scope (only `repo`)
- Use fine-grained tokens for specific repos
- Set token expiration dates
- Revoke unused tokens

❌ **DON'T:**
- Share your token with anyone
- Use tokens with admin or delete permissions
- Store tokens in other places
- Use same token for multiple apps

### 2. Review Repository Access

Before syncing:
1. Verify the selected repository is correct
2. Check repository visibility (public vs private)
3. Review what's already in the repository
4. Ensure you have write access

### 3. Monitor Synced Content

Regularly check:
- Commits made by the extension in your GitHub repo
- Files created/modified
- Commit messages and timestamps
- Unexpected changes

### 4. Keep Extension Updated

- Enable automatic updates in Chrome
- Review update notes for security patches
- Report any suspicious behavior

### 5. Use Private Repositories

If your solutions contain sensitive information:
- Use private GitHub repositories
- Don't sync to public repos you don't control
- Review GitHub repository visibility settings

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously. If you discover a security issue:

### How to Report

**Preferred Method:**
- Email: omkarthipparthi@gmail.com
- Subject: "SECURITY: [Brief Description]"

**GitHub Security Advisory:**
- Go to: https://github.com/Omkarthipparthi/L2G/security/advisories
- Click "Report a vulnerability"

**Please Include:**
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if you have one)
5. Your contact information (for follow-up)

### What to Expect

1. **Acknowledgment:** Within 48 hours
2. **Initial Assessment:** Within 1 week
3. **Fix Development:** Depends on severity
4. **Disclosure:** Coordinated disclosure after fix

### Responsible Disclosure

**Please:**
- ✅ Give us reasonable time to fix before public disclosure
- ✅ Don't exploit the vulnerability
- ✅ Don't access other users' data
- ✅ Report in good faith

**We Will:**
- ✅ Acknowledge your report promptly
- ✅ Keep you updated on fix progress
- ✅ Credit you in security advisory (if desired)
- ✅ Not take legal action for good-faith reports

## Security Incident Response

### If Your Token is Compromised

**Immediate Steps:**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Revoke the compromised token immediately
3. Disconnect GitHub in extension settings
4. Create a new token with fresh permissions
5. Reconnect GitHub with new token

**Check for Damage:**
1. Review recent commits in your repository
2. Check GitHub audit log for unexpected activity
3. Review repository access logs

### If Extension is Compromised

1. Immediately uninstall the extension
2. Revoke GitHub token
3. Report to Chrome Web Store
4. Check your GitHub repository for unexpected changes

## Security Audit Trail

### Logging and Monitoring

**What's Logged (in console, development only):**
- Message passing between components
- API call status (success/failure)
- Storage operations

**NOT Logged:**
- ❌ GitHub tokens (never)
- ❌ Sensitive user data
- ❌ Code content in production

**Production Builds:**
- Minimal logging
- No sensitive data exposure
- Error messages sanitized

## Compliance

### Chrome Web Store Security Requirements

✅ **Manifest V3:** Latest security model
✅ **No Remote Code:** All code bundled, no eval()
✅ **Content Security Policy:** Strict CSP enforced
✅ **Permission Justification:** All permissions documented
✅ **Privacy Policy:** Detailed privacy disclosure

### Code Security

✅ **TypeScript:** Type safety reduces bugs
✅ **Linting:** ESLint catches security issues
✅ **Dependencies:** Regularly updated, audited
✅ **No Minification:** Code is readable for security review (optional)

## Security Checklist for Developers

If you're contributing to this project:

- [ ] Never log sensitive data (tokens, user code)
- [ ] Validate all user inputs
- [ ] Sanitize data before storage
- [ ] Use TypeScript types strictly
- [ ] Review Chrome extension security best practices
- [ ] Test with different permission scenarios
- [ ] Check for XSS vulnerabilities in UI
- [ ] Verify API calls use HTTPS
- [ ] Don't introduce new permissions without documentation
- [ ] Run `npm audit` before commits

## Security Resources

### Chrome Extension Security
- [Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/contentSecurityPolicy/)
- [Manifest V3 Security](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/#security)

### GitHub Security
- [GitHub Token Security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)
- [Fine-grained PATs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token)

### General Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Application Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## Security Roadmap

Future security enhancements planned:

- [ ] GitHub OAuth implementation (more secure than PATs)
- [ ] Token encryption at application level (in addition to Chrome's)
- [ ] Permission scoping (only access selected repo)
- [ ] Audit logging of all operations
- [ ] Two-factor authentication support
- [ ] Automatic token rotation
- [ ] Security vulnerability scanning in CI/CD

## Contact

**Security Team:** omkarthipparthi@gmail.com  
**General Support:** omkarthipparthi@gmail.com  
**GitHub:** https://github.com/Omkarthipparthi/L2G

---

**Last Updated:** October 26, 2025

**Version:** 1.0.0

This security policy is a living document and will be updated as new security measures are implemented or vulnerabilities are discovered.

