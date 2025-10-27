# GitHub OAuth Setup Guide for Leet2Git

This guide explains how to set up proper GitHub OAuth authentication for your Chrome extension.

## 🎯 Why OAuth Instead of Personal Access Tokens?

### OAuth (Recommended) ✅
- ✅ More secure
- ✅ Users don't see or handle tokens
- ✅ Can be revoked by user anytime
- ✅ Professional user experience
- ✅ Better for Chrome Web Store approval
- ✅ Scopes are clear to users

### Personal Access Tokens (Current) ⚠️
- ⚠️ Users must manually create tokens
- ⚠️ Risk of users giving too many permissions
- ⚠️ Tokens can be accidentally exposed
- ⚠️ Poor user experience
- ⚠️ Chrome Web Store may flag as less secure

---

## 📋 Prerequisites

Before starting:
- [ ] GitHub account (for creating OAuth App)
- [ ] Leet2Git extension built and ready
- [ ] Extension ID (get from `chrome://extensions/` when loaded)

---

## 🚀 Option 1: GitHub OAuth App (Recommended for Public Extensions)

### Step 1: Create GitHub OAuth App

1. **Go to GitHub OAuth Apps:**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Fill in Application Details:**
   ```
   Application name: Leet2Git
   Homepage URL: https://github.com/Omkarthipparthi/L2G
   Application description: Automatically sync LeetCode solutions to GitHub
   Authorization callback URL: https://[EXTENSION-ID].chromiumapp.org/
   ```

   **⚠️ Important:** Replace `[EXTENSION-ID]` with your actual extension ID
   - Get it from: `chrome://extensions/` (e.g., `abcdefghijklmnopqrstuvwxyz123456`)
   - Format: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`

3. **Register Application:**
   - Click "Register application"
   - **Save your Client ID** (you'll need this!)
   - **Save your Client Secret** (you'll need this!)

### Step 2: Update Extension Code

1. **Update `src/services/github-oauth.service.ts`:**
   ```typescript
   private static readonly CLIENT_ID = 'your-github-oauth-client-id-here';
   ```
   Replace `YOUR_GITHUB_OAUTH_CLIENT_ID` with your actual Client ID

2. **Update `public/manifest.json`:**
   
   Add OAuth2 configuration (if not already present):
   ```json
   {
     "oauth2": {
       "client_id": "your-github-oauth-client-id.apps.googleusercontent.com",
       "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
     },
     "permissions": [
       "identity"
     ]
   }
   ```

   **Note:** For GitHub OAuth with chrome.identity, you might not need the oauth2 field in manifest.
   The `identity` permission is sufficient.

### Step 3: Update Home.tsx to Use OAuth

Update `src/popup/pages/Home.tsx` to add OAuth button:

```typescript
const handleOAuthLogin = async () => {
  try {
    setLoading(true);
    setError(null);

    // Import OAuth service
    const { GitHubOAuthService } = await import('../../services/github-oauth.service');
    
    // Start OAuth flow
    const result = await GitHubOAuthService.authenticate();

    if (result.success && result.accessToken) {
      // Send token to background worker
      const message: Message = {
        type: 'AUTH_GITHUB',
        payload: result.accessToken,
      };

      const response = await chrome.runtime.sendMessage(message);

      if (response.success) {
        setIsAuthenticated(true);
        setGitHubUser(result.user?.login || 'User');
        console.log('✅ GitHub authenticated via OAuth');
      } else {
        setError(response.error || 'Failed to save authentication');
      }
    } else {
      setError(result.error || 'OAuth authentication failed');
    }
  } catch (error: any) {
    console.error('OAuth error:', error);
    setError(error.message || 'Failed to authenticate');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Test OAuth Flow

1. **Rebuild extension:**
   ```bash
   npm run build
   ```

2. **Reload extension in Chrome:**
   - Go to `chrome://extensions/`
   - Click reload icon

3. **Test authentication:**
   - Open extension popup
   - Click "Connect GitHub" (with OAuth)
   - Should open GitHub authorization page
   - Approve permissions
   - Should redirect back and authenticate

### Step 5: Verify It Works

Check console logs:
```
🔐 Starting GitHub OAuth flow...
🔗 Redirect URL: https://[extension-id].chromiumapp.org/
🔗 Auth URL: https://github.com/login/oauth/authorize?...
✅ OAuth callback received
✅ Access token obtained
✅ User authenticated: [username]
```

---

## 🚀 Option 2: GitHub App (Alternative, More Advanced)

GitHub Apps are more secure but more complex:

1. **Create GitHub App:**
   - Go to: https://github.com/settings/apps/new
   - Fill in details similar to OAuth App
   - Set permissions: Repository contents (Read & Write)

2. **Install App:**
   - Install on your account or organization
   - Get installation ID

3. **Implementation:**
   - More complex authentication flow
   - Requires JWT generation
   - Better for organization-level access

**Recommendation:** Use OAuth App (Option 1) for simplicity

---

## 🔧 Option 3: Keep Using Personal Access Tokens

If OAuth setup is too complex right now, you can keep using PATs:

### Improve PAT UX

Update your UI to provide clear instructions:

```tsx
const PATInstructions = () => (
  <div className="pat-instructions">
    <h3>How to Create a Personal Access Token:</h3>
    <ol>
      <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank">GitHub Token Settings</a></li>
      <li>Name: "Leet2Git Extension"</li>
      <li>Expiration: 90 days or longer</li>
      <li>Scopes: Check "repo" (all sub-scopes)</li>
      <li>Click "Generate token"</li>
      <li>Copy and paste token below</li>
    </ol>
    <p><strong>⚠️ Keep this token secret! Don't share it.</strong></p>
  </div>
);
```

### Validate PAT on Input

```typescript
import { GitHubPATService } from '../../services/github-oauth.service';

const handlePATSubmit = async (token: string) => {
  const result = await GitHubPATService.validatePAT(token);
  
  if (result.success) {
    // Save token and authenticate
    // ...
  } else {
    setError(result.error);
  }
};
```

---

## 🎨 UI Implementation Example

### Dual Authentication Methods

```tsx
const AuthenticationPage = () => {
  const [authMethod, setAuthMethod] = useState<'oauth' | 'pat'>('oauth');

  return (
    <div>
      {/* Method Selector */}
      <div className="auth-method-selector">
        <button
          className={authMethod === 'oauth' ? 'active' : ''}
          onClick={() => setAuthMethod('oauth')}
        >
          🔐 OAuth (Recommended)
        </button>
        <button
          className={authMethod === 'pat' ? 'active' : ''}
          onClick={() => setAuthMethod('pat')}
        >
          🔑 Personal Access Token
        </button>
      </div>

      {/* OAuth Flow */}
      {authMethod === 'oauth' && (
        <div className="oauth-section">
          <h3>Secure GitHub Authentication</h3>
          <p>Connect your GitHub account securely with one click.</p>
          <button onClick={handleOAuthLogin} className="btn btn-primary">
            Connect with GitHub
          </button>
          <p className="text-sm text-gray-600">
            ✓ No need to create tokens manually<br/>
            ✓ Secure OAuth 2.0 authentication<br/>
            ✓ Revoke access anytime in GitHub settings
          </p>
        </div>
      )}

      {/* PAT Flow */}
      {authMethod === 'pat' && (
        <div className="pat-section">
          <h3>Manual Token Authentication</h3>
          <PATInstructions />
          <input
            type="password"
            placeholder="Paste your GitHub token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input"
          />
          <button onClick={() => handlePATSubmit(token)} className="btn btn-primary">
            Connect
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## 🔒 Security Best Practices

### Do's ✅
- ✅ Use OAuth when possible
- ✅ Request minimum required scopes (only `repo`)
- ✅ Validate tokens before storing
- ✅ Use HTTPS for all API calls
- ✅ Clear tokens on disconnect
- ✅ Show clear permissions to users

### Don'ts ❌
- ❌ Store Client Secret in extension code (not needed for client-side OAuth)
- ❌ Request more scopes than needed
- ❌ Log tokens to console in production
- ❌ Share tokens between users
- ❌ Hard-code tokens

---

## 🧪 Testing OAuth Implementation

### Test Checklist

- [ ] OAuth flow opens GitHub authorization page
- [ ] User can approve permissions
- [ ] Callback redirects back to extension
- [ ] Token is extracted correctly
- [ ] User info is fetched successfully
- [ ] Token is stored securely
- [ ] Extension works with OAuth token
- [ ] User can disconnect and reconnect
- [ ] Error handling works (user cancels, network error, etc.)

### Test Scenarios

1. **Happy Path:**
   - Click "Connect" → Approve → Success

2. **User Cancels:**
   - Click "Connect" → Cancel → Show error message

3. **Invalid Token:**
   - Token doesn't have repo scope → Show error

4. **Network Error:**
   - No internet → Show error message

5. **Token Revoked:**
   - User revokes on GitHub → Next API call fails → Prompt to reconnect

---

## 📊 Comparison: OAuth vs PAT

| Feature | OAuth | PAT |
|---------|-------|-----|
| User Experience | ⭐⭐⭐⭐⭐ One click | ⭐⭐ Manual steps |
| Security | ⭐⭐⭐⭐⭐ Very secure | ⭐⭐⭐ Good if used properly |
| Setup Complexity | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐⭐ Easy |
| Chrome Store Approval | ⭐⭐⭐⭐⭐ Preferred | ⭐⭐⭐ Acceptable |
| Token Management | ⭐⭐⭐⭐⭐ Automatic | ⭐⭐ Manual |
| Revocation | ⭐⭐⭐⭐⭐ Easy for users | ⭐⭐⭐ Must go to GitHub |

**Recommendation:** 
- **For Launch:** Use PAT (simpler, works now)
- **For Future:** Implement OAuth (better UX and security)

---

## 🚢 Migration Strategy

### Phase 1: Launch with PAT ✅ Current
- Use existing PAT implementation
- Add clear instructions
- Validate tokens properly
- Submit to Chrome Web Store

### Phase 2: Add OAuth ⏭️ Future Enhancement
- Set up GitHub OAuth App
- Implement OAuth service (already created!)
- Add OAuth button to UI
- Keep PAT as fallback option
- Release as v1.1 or v2.0

### Phase 3: Deprecate PAT ⏭️ Long-term
- Make OAuth the default
- Show migration prompt to PAT users
- Eventually remove PAT option (optional)

---

## 📝 Summary

### For Initial Release (v1.0):
**Keep using Personal Access Tokens** ✅
- Simpler to implement
- Works immediately
- Acceptable for Chrome Web Store
- Good user instructions provided

### For Future Releases (v1.1+):
**Add OAuth** ⚠️
- Better user experience
- More secure
- Professional authentication
- Service already created (ready to use!)

---

## ✅ Action Items

### For Now (v1.0 Launch):
- [x] PAT validation implemented
- [x] OAuth service created (for future)
- [ ] Add clear PAT instructions to UI
- [ ] Test PAT flow thoroughly
- [ ] Document PAT setup in README

### For Later (v1.1+):
- [ ] Create GitHub OAuth App
- [ ] Add Client ID to oauth service
- [ ] Update UI with OAuth button
- [ ] Test OAuth flow
- [ ] Release with OAuth support

---

## 📞 Need Help?

### GitHub OAuth Resources:
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [OAuth Best Practices](https://oauth.net/2/oauth-best-practice/)

### Common Issues:
- **Redirect URL mismatch:** Check extension ID matches
- **Client ID not working:** Verify it's from correct OAuth App
- **Scopes not showing:** Check OAuth App settings
- **Callback not received:** Check chrome.identity permission

---

**Last Updated:** October 26, 2025

**Status:** OAuth service implemented, ready for future use  
**Current:** Using PAT for v1.0 launch  
**Future:** OAuth for v1.1+

