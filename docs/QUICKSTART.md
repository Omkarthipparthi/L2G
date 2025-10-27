# Leet2Git - Quick Start Guide

Get up and running with Leet2Git in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- Chrome browser
- GitHub account

## Installation Steps

### 1. Clone & Install (1 minute)

```bash
git clone <repository-url>
cd Leet2Git
npm install
```

### 2. Build Extension (30 seconds)

```bash
npm run build
```

### 3. Load in Chrome (1 minute)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist` folder

✅ Extension installed!

### 4. Setup GitHub (2 minutes)

1. **Create GitHub Token:**
   - Visit: https://github.com/settings/tokens/new?scopes=repo
   - Name: "Leet2Git Extension"
   - Scope: ✅ `repo`
   - Click "Generate token"
   - **Copy the token!**

2. **Connect Extension:**
   - Click Leet2Git icon in Chrome
   - Click "Connect GitHub"
   - Paste your token
   - Click "Connect"

3. **Select Repository:**
   - Go to Settings tab
   - Select existing repo OR create new one
   - Done!

## First Test

### Test the Extension (1 minute)

1. Go to: https://leetcode.com/problems/two-sum/
2. Add `?debug=leet2git` to URL
3. Click the blue "🧪 Test" button (bottom-right)
4. Check browser console for logs

### Full Workflow Test (5 minutes)

1. Pick any easy problem on LeetCode
2. Write/paste a solution
3. Submit it
4. Wait for "Accepted"
5. Look for green notification from Leet2Git
6. Check your GitHub repo for the new file!

## Troubleshooting

### Extension won't load?
- Make sure you ran `npm run build`
- Check for errors on `chrome://extensions/`

### Popup is blank?
- Press F12 on the popup to see console errors
- Try rebuilding: `npm run build`

### Content script not working?
- Reload the LeetCode page
- Check console (F12) for "🚀 Leet2Git" logs

### GitHub sync fails?
- Verify token has `repo` scope
- Ensure repository is selected in Settings
- Check background worker logs (click "service worker" on extensions page)

## Next Steps

- Read [TESTING.md](./TESTING.md) for comprehensive testing guide
- Check [PLAN_README.md](./PLAN_README.md) for development roadmap
- See [README.md](./README.md) for full documentation

## Development Commands

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Project Structure

```
Leet2Git/
├── src/
│   ├── popup/          # React UI components
│   ├── background/     # Service worker
│   ├── content/        # LeetCode page script
│   ├── services/       # GitHub & Storage services
│   ├── types/          # TypeScript definitions
│   └── utils/          # Helper functions
├── public/
│   ├── manifest.json   # Extension manifest
│   └── icons/          # Extension icons
└── dist/               # Built extension (load this in Chrome)
```

## Tips

- Use `?debug=leet2git` on LeetCode pages to enable test button
- Check "service worker" logs for background errors
- Press F12 on any page to see console logs
- Use `chrome.storage.sync.get(null, console.log)` to see stored data

## Success Checklist

- [x] Extension loads in Chrome ✅
- [ ] Popup opens and works
- [ ] GitHub connected
- [ ] Repository selected
- [ ] Settings can be changed
- [ ] LeetCode content script runs
- [ ] Can sync a solution to GitHub
- [ ] Files appear in GitHub repo
- [ ] History shows submissions

Once all checked, you're ready to go! 🎉

## Need Help?

1. Check console logs (F12)
2. Look at TESTING.md for detailed guides
3. Check background worker logs
4. Create an issue on GitHub

---

**Happy Coding! 💻✨**

