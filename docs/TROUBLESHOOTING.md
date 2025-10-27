# Leet2Git - Troubleshooting "Connecting..." Issue

## Issue: Authentication Stuck on "Connecting..."

### Immediate Fix Steps:

1. **Reload the Extension**
   - Go to `chrome://extensions/`
   - Find Leet2Git
   - Click the reload icon (🔄)
   - Try connecting again

2. **Check Background Worker Status**
   - On `chrome://extensions/` page
   - Look under Leet2Git for "service worker"
   - Is it **blue/clickable** or showing **(inactive)**?

### If Service Worker is Inactive:

**Solution A: Wake it up**
- Click the Leet2Git extension icon (this wakes the worker)
- Try connecting again immediately

**Solution B: Force reload**
- Remove the extension completely
- Add it back by loading unpacked from `dist/` folder

### Detailed Debugging:

#### Step 1: Open Background Worker Console
1. Go to `chrome://extensions/`
2. Find Leet2Git
3. Click **"service worker"** (blue link)
4. Console opens

**Expected logs when you connect:**
```
🚀 Leet2Git: Background service worker started
📨 Received message: AUTH_GITHUB
🔐 handleGitHubAuth called
Setting GitHub token...
GitHubService.setToken: Saving token to storage...
✅ GitHub authentication successful
✅ Sending response: {success: true, ...}
```

#### Step 2: Open Popup Console
1. Right-click extension icon
2. Click "Inspect popup"
3. Console opens

**Expected logs:**
```
Starting GitHub authentication...
Sending AUTH_GITHUB message...
Received response: {success: true, data: {...}}
Authentication successful!
```

### Manual Test

**In Background Worker Console, paste this:**
```javascript
// Test GitHub API directly
const testToken = 'YOUR_TOKEN_HERE'; // Replace with your token

const octokit = new (await import('https://cdn.skypack.dev/@octokit/rest')).Octokit({
  auth: testToken
});

octokit.users.getAuthenticated()
  .then(result => console.log('✅ GitHub API works:', result.data.login))
  .catch(error => console.error('❌ GitHub API failed:', error.message));
```

### Common Errors:

**Error: "Bad credentials"**
- Your token is invalid
- Create new token at: https://github.com/settings/tokens/new?scopes=repo
- Make sure `repo` scope is checked

**Error: "Could not establish connection"**
- Service worker is dead
- Reload extension
- Try waking it up by clicking icon first

**No error, just stuck:**
- Service worker isn't receiving message
- Check both consoles for errors
- Try reloading extension

### Quick Diagnostic Script

**Paste in Popup Console:**
```javascript
// Test message passing
console.log('Testing message to background...');

chrome.runtime.sendMessage(
  { type: 'TEST_CONNECTION' },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Message failed:', chrome.runtime.lastError.message);
      console.log('Background worker is probably inactive!');
    } else {
      console.log('✅ Message works! Response:', response);
    }
  }
);
```

**Result:**
- ✅ If you get a response → Message passing works, check token
- ❌ If you get "Could not establish connection" → Reload extension

### Nuclear Option: Fresh Start

If nothing works:

1. **Remove Extension**
   - Go to `chrome://extensions/`
   - Click "Remove" on Leet2Git

2. **Clear Browser Cache**
   - Press `Ctrl+Shift+Delete`
   - Clear cached files

3. **Rebuild Extension**
   ```bash
   npm run build
   ```

4. **Load Fresh**
   - `chrome://extensions/`
   - Load unpacked → Select `dist/` folder

5. **Try Again**

### Still Not Working?

Please provide:

1. **Background Worker Console logs** (copy all text)
2. **Popup Console logs** (copy all text)
3. **Chrome version** (Help → About Google Chrome)
4. **Token format** (first 4 chars, e.g., `ghp_`)
5. **Any red errors** anywhere

### Advanced: Check Storage

**In Background Worker Console:**
```javascript
// Check what's stored
chrome.storage.sync.get(null, (data) => {
  console.log('Stored data:', data);
});

// Test storage write
chrome.storage.sync.set({ test: 'value' }, () => {
  console.log('Storage write:', chrome.runtime.lastError || 'OK');
});
```

### Known Issue: Service Worker Sleep

Chrome puts service workers to sleep after 30 seconds of inactivity. The latest build includes a keep-alive mechanism that should prevent this.

If you still see issues:
- Click extension icon to wake worker
- Immediately try connecting (within 30 seconds)

---

**Need More Help?**

Share the console logs from both:
1. Background Worker (service worker console)
2. Popup (popup inspector)

And I can help debug further!

