// The work package card and the guidance widget for a member whose language is Arabic.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ar-SA', timezoneId: 'Asia/Dubai', storageState: new URL('./state-bd2.json', import.meta.url).pathname });
const page = await context.newPage();
await page.goto(`${BASE}/object/workPackage/${ids.workPackages.ACCEPTED}`);
await page.waitForTimeout(10000);
const card = page.locator('.kuec-card').first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
console.log('card direction:', await card.evaluate((element) => getComputedStyle(element).direction));
console.log('card text:', (await card.innerText()).replace(/\n+/g, ' / ').slice(0, 700));
await card.screenshot({ path: `${SHOTS}arabic-card.png` });
await browser.close();
