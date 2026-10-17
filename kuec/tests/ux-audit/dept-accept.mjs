// A department-role member (same permission set as Commercialization) presses Accept and Request help on their own work package.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';
const workPackageId = readFileSync(new URL('./evidence/ipo-wp.id', import.meta.url), 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: new URL('./state-ipo.json', import.meta.url).pathname });
const page = await context.newPage();
await page.goto(`${BASE}/object/workPackage/${workPackageId}`);
await page.waitForTimeout(10000);
const accept = page.getByRole('button', { name: 'Accept', exact: true });
console.log('Accept shown:', await accept.count());
await accept.scrollIntoViewIfNeeded();
await accept.click();
const seen = new Set();
for (let index = 0; index < 16; index += 1) {
  for (const text of await page.getByText(/Accepted\.|didn't save|changed this a moment ago|permission/i).allInnerTexts()) seen.add(text.slice(0, 120));
  if (index === 3) await page.screenshot({ path: `${SHOTS}desktop-department-accept.png` });
  await page.waitForTimeout(250);
}
console.log('after Accept:', JSON.stringify([...seen]));
console.log('card now:', (await page.locator('.kuec-card').first().innerText()).replace(/\n+/g, ' / ').slice(0, 300));
await browser.close();
