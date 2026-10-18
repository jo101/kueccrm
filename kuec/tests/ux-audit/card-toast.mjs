// Accept on the card and capture the toast within its 4 seconds.
// node card-toast.mjs <email> <workPackageId>
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', workPackageId] = process.argv.slice(2);
const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: statePath });
const page = await context.newPage();
await page.goto(`${BASE}/object/workPackage/${workPackageId}`);
await page.waitForTimeout(10000);
await page.getByRole('button', { name: 'Accept', exact: true }).scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Accept', exact: true }).dblclick();
const seen = new Set();
for (let index = 0; index < 20; index += 1) {
  for (const text of await page.getByText(/Accepted\.|didn't save|changed this a moment ago/).allInnerTexts()) seen.add(text);
  if (index === 3) await page.screenshot({ path: `${SHOTS}desktop-card-toast.png` });
  await page.waitForTimeout(250);
}
console.log(JSON.stringify([...seen]));
await browser.close();
