# Leet2Git

**Automatically push your LeetCode submissions to GitHub**

Leet2Git is a Chrome browser extension that automatically saves your LeetCode problem solutions to a GitHub repository. Never lose your coding solutions again and build an impressive portfolio of your problem-solving journey!

## 🎯 Purpose

This extension is designed to:
- **Automatically capture** your accepted LeetCode submissions
- **Organize** your solutions by difficulty, category, or custom structure
- **Sync** solutions to your GitHub repository automatically
- **Track** your coding progress over time
- **Build** a public portfolio of your problem-solving skills

## 🏗️ Current Status

**⚠️ Work in Progress**

The project is currently in early development stage. Starting fresh with an optimized tech stack for Chrome Extensions:
- ⏳ Project initialization
- ⏳ React + Vite setup for popup UI
- ⏳ Chrome Extension manifest (v3)
- ⏳ Build configuration
- ⏳ Background service worker
- ⏳ Content script for LeetCode page interaction
- ⏳ GitHub OAuth integration

## 🛠️ Technology Stack

- **UI Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast, optimized for extensions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Extension API**: Chrome Extension Manifest V3
- **GitHub Integration**: Octokit (GitHub REST API) + chrome.identity API
- **State Management**: Zustand (lightweight)
- **Storage**: Chrome Storage API (chrome.storage.sync)
- **Target Platform**: LeetCode.com

## 📦 Installation

### For Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Leet2Git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build:extension
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/leet2-git/browser` directory

### For Users

*Note: Extension is not yet published to the Chrome Web Store*

## 🏗️ Architecture

### Extension Components

1. **Popup UI (React + Vite)**
   - Configuration interface
   - Status display
   - Repository connection settings
   - Submission history viewer
   - GitHub authentication flow
   - Dark/Light theme support
   - Built as static HTML/CSS/JS for extension context

2. **Background Service Worker** (`background.ts`)
   - Handles extension lifecycle events
   - Manages GitHub API communication via Octokit
   - Processes submission data from content script
   - Handles OAuth token management via chrome.identity
   - Manages Chrome storage API for settings/data persistence
   - Coordinates communication between popup and content script

3. **Content Script** (`content-script.ts`)
   - Runs on LeetCode.com pages
   - Detects successful submissions via DOM monitoring
   - Extracts problem details (title, difficulty, tags, description)
   - Extracts solution code from editor
   - Sends data to background worker via chrome.runtime
   - Shows non-intrusive notifications

### Build Process

- **Vite Build**: `npm run build` - Builds React popup UI optimized for extensions
- **Output**: `dist/` - Complete extension ready to load in Chrome

## 🎨 Features (Planned)

### Core Features
- [ ] Automatic detection of accepted submissions
- [ ] GitHub authentication (OAuth)
- [ ] Repository selection and creation
- [ ] Customizable file naming and organization patterns
- [ ] Support for multiple programming languages (Python, JavaScript, Java, C++, etc.)
- [ ] Markdown README generation with problem descriptions
- [ ] Manual sync option for existing submissions

### Advanced Features
- [ ] Submission statistics and analytics dashboard
- [ ] Exclude/include problem filtering
- [ ] Private/public repository support
- [ ] Commit message templates
- [ ] Branch management (main/master selection)
- [ ] Folder structure customization (by difficulty/topic/date)
- [ ] Solution metadata (runtime, memory usage, tags)
- [ ] Multi-repository support
- [ ] Submission history viewer
- [ ] Retry failed submissions
- [ ] Batch upload historical solutions

### UI Features
- [ ] Modern, responsive design
- [ ] Dark/Light mode toggle
- [ ] Real-time sync status
- [ ] Toast notifications for sync events
- [ ] Settings management panel
- [ ] GitHub profile integration

## 🚀 Development

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn package manager
- Chrome browser for testing

### Development Server (React UI)
```bash
npm run dev
```
Navigate to `http://localhost:5173/` to see the popup UI in development mode. The page will auto-reload on changes.

### Build for Production
```bash
npm run build:extension
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📝 Project Structure

```
Leet2Git/
├── src/
│   ├── popup/                  # React popup UI
│   │   ├── App.tsx             # Main popup component
│   │   ├── index.tsx           # Entry point
│   │   ├── index.html          # Popup HTML
│   │   ├── components/         # UI components
│   │   │   ├── Header.tsx
│   │   │   ├── StatusCard.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   └── SubmissionList.tsx
│   │   ├── pages/              # Different views
│   │   │   ├── Home.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── History.tsx
│   │   └── styles/             # CSS files
│   │       └── index.css
│   ├── background/             # Background service worker
│   │   └── index.ts
│   ├── content/                # Content script
│   │   └── index.ts
│   ├── services/               # Shared services
│   │   ├── github.service.ts   # GitHub API integration
│   │   ├── storage.service.ts  # Chrome storage wrapper
│   │   └── leetcode.parser.ts  # LeetCode DOM parser
│   ├── types/                  # TypeScript types
│   │   ├── problem.types.ts
│   │   ├── github.types.ts
│   │   └── storage.types.ts
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── store/                  # Zustand state management
│       └── useStore.ts
├── public/                     # Static assets
│   ├── manifest.json           # Extension manifest
│   ├── icons/                  # Extension icons
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── images/
├── dist/                       # Built extension (gitignored)
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
├── PLAN_README.md              # Detailed implementation plan
└── README.md
```

## 🔧 Configuration Files

- **`manifest.json`**: Chrome extension configuration (Manifest V3)
  - Permissions: activeTab, storage, identity, scripting
  - Host permissions: leetcode.com
  - Content scripts injection on LeetCode pages
  - Background service worker registration
  - Action (popup) configuration

- **`vite.config.ts`**: Vite bundler configuration
  - Multiple entry points: popup, background, content script
  - Build optimizations for Chrome extensions
  - Output: dist/ directory with proper structure
  - Hot module replacement for development

- **`tailwind.config.js`**: Tailwind CSS configuration
  - Custom color scheme
  - Extension-specific utilities
  - Dark mode support

## 🔐 GitHub Authentication

The extension uses Chrome Identity API with GitHub OAuth for secure authentication:
1. User clicks "Connect to GitHub" in popup
2. chrome.identity.launchWebAuthFlow initiates OAuth flow
3. User authorizes the app on GitHub
4. Access token is received and securely stored in chrome.storage.sync
5. Token is encrypted and used for all subsequent API calls via Octokit
6. Token refresh handled automatically

## 💡 How It Will Work (When Complete)

1. **Setup**: User installs extension and connects their GitHub account
2. **Configuration**: User selects/creates a repository for solutions
3. **Solving**: User solves a problem on LeetCode
4. **Detection**: Upon successful submission, content script detects the acceptance
5. **Extraction**: Content script extracts problem metadata (title, difficulty, tags) and solution code
6. **Processing**: Data is sent to background worker via Chrome messaging
7. **Formatting**: Background worker formats the code with proper folder structure
8. **Commit**: Solution is committed to GitHub with descriptive commit message
9. **Sync**: User's GitHub repository is automatically updated
10. **Notification**: User receives confirmation toast notification

## 📂 File Organization (Default)

Solutions will be organized in your GitHub repository as:

```
LeetCode-Solutions/
├── README.md                           # Auto-generated stats and problem list
├── Easy/
│   ├── 001-two-sum/
│   │   ├── solution.py
│   │   ├── solution.js
│   │   └── README.md                   # Problem description
│   └── 020-valid-parentheses/
│       └── solution.cpp
├── Medium/
│   └── 003-longest-substring/
│       └── solution.java
└── Hard/
    └── 004-median-sorted-arrays/
        └── solution.py
```

## 🤝 Contributing

Contributions are welcome! This project is in early development and needs:
- Background service worker implementation
- Content script for LeetCode DOM interaction
- GitHub API integration with Octokit
- UI/UX design for popup with React
- Testing (Vitest, React Testing Library)
- Documentation and tutorials

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **LeetCode**: https://leetcode.com
- **Chrome Extensions Documentation**: https://developer.chrome.com/docs/extensions/
- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **GitHub REST API**: https://docs.github.com/en/rest
- **Octokit**: https://github.com/octokit/octokit.js
- **Chrome Web Store Developer Dashboard**: https://chrome.google.com/webstore/devconsole

## 🐛 Known Issues

- Extension currently in development phase
- GitHub OAuth flow needs implementation
- Content script DOM selectors need updating for LeetCode UI changes
- Background worker persistence needs optimization

## 📊 Roadmap

### Phase 1: Core Functionality (Current)
- ✅ Project setup and structure
- ⏳ Background service worker
- ⏳ Content script implementation
- ⏳ Basic GitHub integration

### Phase 2: UI Development
- ⏳ React + Vite popup interface
- ⏳ Settings page
- ⏳ OAuth flow with chrome.identity
- ⏳ Submission history viewer

### Phase 3: Advanced Features
- ⏳ Analytics dashboard
- ⏳ Custom folder structures
- ⏳ Multi-language support
- ⏳ Batch uploads

### Phase 4: Release
- ⏳ Chrome Web Store submission
- ⏳ User documentation
- ⏳ Video tutorials

## 💬 Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

**Built with React 18 + Vite + TypeScript | Powered by Chrome Extension Manifest V3**