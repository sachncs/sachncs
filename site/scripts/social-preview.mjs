// Render the code-native editorial social card with Playwright.
// Usage: PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/social-preview.mjs
import { pathToFileURL } from 'node:url';
import { profile } from '../.ssr/entry-server.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(`<html><head><style>
*{box-sizing:border-box}body{margin:0;background:#151715;color:#efeee8;font-family:Arial,sans-serif;padding:65px 72px}header{display:flex;align-items:center;gap:16px;font-size:22px}header b{background:#bfd3a4;color:#151715;width:40px;height:40px;display:grid;place-items:center;font:30px Georgia}header span:last-child{margin-left:auto;color:#a8aea5;font:15px monospace}h1{font-size:88px;letter-spacing:-5px;font-weight:500;line-height:1;margin:64px 0 20px}h2{font-size:43px;font-weight:400;letter-spacing:-1.5px;margin:0;color:#bfd3a4}footer{margin-top:77px;border-top:1px solid #41483b;padding-top:24px;color:#bcc6b3;font:18px monospace;letter-spacing:-.5px}</style></head><body><header><b>s.</b><span>${profile.name}</span><span>${profile.url.replace('https://', '')}</span></header><h1>${profile.name}.</h1><h2>${profile.title}</h2><footer>Production AI · Agents · Retrieval · Evaluation · Architecture</footer></body></html>`);
await page.screenshot({ path: 'public/social-preview.png' });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent('<html><body style="margin:0;background:#151715;color:#bfd3a4;display:grid;place-items:center;width:180px;height:180px;font:135px Georgia">s.</body></html>');
await page.screenshot({ path: 'public/apple-touch-icon.png' });
await browser.close();
