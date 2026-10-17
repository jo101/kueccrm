// Card skeleton (slow API) and error state (API refused) as the person sees them.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: new URL('./state-bd1.json', import.meta.url).pathname });
const page = await context.newPage();
// Slow only the card's own reads: the front component queries workPackage through /graphql after the page shell loads.
let delayCard = false;
let failCard = false;
await page.route('**/graphql', async (route) => {
  const body = route.request().postData() ?? '';
  const isCardRead = /workPackage/i.test(body) && /doneCriteria|expectedOutput/.test(body);
  if (isCardRead && failCard) return route.fulfill({ status: 500, body: '{"errors":[{"message":"rehearsal: refused"}]}' });
  if (isCardRead && delayCard) await new Promise((resolve) => setTimeout(resolve, 8000));
  return route.continue();
});
delayCard = true;
await page.goto(`${BASE}/object/workPackage/${ids.workPackages.ACCEPTED}`);
await page.waitForTimeout(5000);
const card = page.locator('.kuec-card').first();
if (await card.count()) {
  await card.scrollIntoViewIfNeeded();
  console.log('loading:', (await card.innerText()).replace(/\n+/g, ' / ').slice(0, 300), '| skeleton blocks:', await card.locator('[aria-busy="true"]').count());
  await card.screenshot({ path: `${SHOTS}desktop-card-loading.png` });
} else console.log('loading: card not rendered yet');
delayCard = false;
failCard = true;
await page.goto(`${BASE}/object/workPackage/${ids.workPackages.SUBMITTED}`);
await page.waitForTimeout(9000);
const errorCard = page.locator('.kuec-card').first();
if (await errorCard.count()) {
  await errorCard.scrollIntoViewIfNeeded();
  console.log('error:', (await errorCard.innerText()).replace(/\n+/g, ' / ').slice(0, 400));
  await errorCard.screenshot({ path: `${SHOTS}desktop-card-error.png` });
} else console.log('error: card not rendered');
await browser.close();
