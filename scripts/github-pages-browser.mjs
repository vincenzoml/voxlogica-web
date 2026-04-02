/**
 * Opens Playwright Chromium for GitHub / GoDaddy flows (VoxLogicA Pages migration).
 *
 * First time: npm install (installs Chromium via postinstall)
 *
 *   npm run browser:login    → GitHub sign-in
 *   npm run browser:pages    → voxlogica-web → Settings → Pages
 *   npm run browser:godaddy  → GoDaddy DNS for voxlogica.org (may require login)
 *
 * Close the Chromium window when finished; the script exits when the browser disconnects.
 */

import { chromium } from "playwright";

const urls = {
  login: "https://github.com/login",
  pages: "https://github.com/vincenzoml/voxlogica-web/settings/pages",
  godaddy: "https://dcc.godaddy.com/manage/voxlogica.org/dns",
};

const cmd = process.argv[2] ?? "login";
const url = urls[cmd];

if (!url) {
  console.error("Usage: node scripts/github-pages-browser.mjs <login|pages|godaddy>");
  process.exit(1);
}

const launchOpts = { headless: false };
if (process.env.PLAYWRIGHT_CHROME_CHANNEL) {
  launchOpts.channel = process.env.PLAYWRIGHT_CHROME_CHANNEL;
}
const browser = await chromium.launch(launchOpts);

const context = await browser.newContext();
const page = await context.newPage();

console.log(`Opening: ${url}`);
console.log("Use this Chromium window to sign in and click around.");
console.log("When you close the browser window, this terminal command will finish.\n");

await page.goto(url, { waitUntil: "domcontentloaded" });

await new Promise((resolve) => {
  browser.on("disconnected", resolve);
});
