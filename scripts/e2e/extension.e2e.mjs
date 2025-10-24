import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const distDir = path.join(projectRoot, 'dist');
const manifestPath = path.join(distDir, 'manifest.json');

function log(msg) {
  // Keep output minimal for CI/local readability
  console.log(msg);
}

function readManifest() {
  const raw = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(raw);
}

async function launchWithExtension() {
  // Use a temporary user data dir for a fresh profile (helps extension initialization)
  const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'l2g-e2e-'));
  const args = [
    `--disable-extensions-except=${distDir}`,
    `--load-extension=${distDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`,
  ];

  const headless = process.env.HEADLESS ? 'new' : false;
  const browser = await puppeteer.launch({
    headless,
    args,
    defaultViewport: { width: 1280, height: 800 },
  });

  // Determine extensionId from targets with retries and a trigger via chrome://extensions
  let extensionId;
  const pollTargets = async (ms) => {
    const start = Date.now();
    while (!extensionId && Date.now() - start < ms) {
      const targets = await browser.targets();
      for (const t of targets) {
        const url = t.url();
        const match = url.match(/chrome-extension:\/\/([a-p]{32})\//);
        if (match) {
          extensionId = match[1];
          break;
        }
      }
      if (!extensionId) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
  };

  // First attempt: 10s
  await pollTargets(10000);

  // If not found, open chrome://extensions to nudge initialization, then try another 10s
  if (!extensionId) {
    try {
      const tmp = await browser.newPage();
      // Open the extension's internal page to surface an extension target
      await tmp.goto('chrome://inspect/#extensions', { waitUntil: 'domcontentloaded' }).catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));
      await tmp.close().catch(() => {});
    } catch {}
    await pollTargets(10000);
  }

  // If still not found, navigate to a matched site to trigger content script/service worker
  if (!extensionId) {
    try {
      const tmp2 = await browser.newPage();
      await tmp2.goto('https://leetcode.com/problems/two-sum', { waitUntil: 'domcontentloaded' }).catch(() => {});
      await new Promise((r) => setTimeout(r, 1500));
      await tmp2.close().catch(() => {});
    } catch {}
    await pollTargets(10000);
  }

  if (!extensionId) {
    await browser.close();
    throw new Error('Failed to determine extensionId');
  }

  return { browser, extensionId };
}

async function main() {
  if (!fs.existsSync(distDir) || !fs.existsSync(manifestPath)) {
    throw new Error('dist/manifest.json not found. Run: npm run build');
  }

  const manifest = readManifest();
  const { browser, extensionId } = await launchWithExtension();
  try {
    const popupPath = manifest.action?.default_popup || 'src/popup/index.html';
    const popupUrl = `chrome-extension://${extensionId}/${popupPath}`;

    const page = await browser.newPage();
    await page.goto(popupUrl, { waitUntil: 'domcontentloaded' });

    // Basic assertions
    await page.waitForSelector('h1', { timeout: 15000 });
    const header = await page.$eval('h1', (el) => el.textContent || '');
    if (!/Leet2Git/i.test(header)) {
      throw new Error('Header text not found');
    }

    const tabs = await page.$$eval('nav button', (els) => els.map((e) => e.textContent?.trim()).join(' '));
    if (!/Home/.test(tabs) || !/Settings/.test(tabs) || !/History/.test(tabs)) {
      throw new Error('Tabs not rendered');
    }

    log('E2E passed: Popup loaded and UI verified');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


