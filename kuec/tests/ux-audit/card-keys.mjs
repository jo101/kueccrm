// Card on a slow network: focus order from the card's first control, Enter in the form, Accept pending state and toast.
// node card-keys.mjs <email> <workPackageId>
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', workPackageId] = process.argv.slice(2);
const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: statePath });
const page = await context.newPage();
const out = {};
await page.goto(`${BASE}/object/workPackage/${workPackageId}`);
await page.waitForTimeout(10000);

const openFull = page.getByRole('button', { name: 'Open full record', exact: true });
await openFull.scrollIntoViewIfNeeded();
const cardTop = await openFull.evaluate((element) => Math.round(element.getBoundingClientRect().top + window.scrollY));
out.cardTopPx = cardTop;
await openFull.focus();
const order = [];
for (let index = 0; index < 10; index += 1) {
  order.push(await page.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    return `${element.tagName}:${(element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 40)} [outline ${style.outlineStyle} ${style.outlineWidth}]`;
  }));
  await page.keyboard.press('Tab');
}
out.focusOrderFromCard = order;

// Request help form: Enter to send?
await page.getByRole('button', { name: 'Request help', exact: true }).click();
await page.waitForTimeout(500);
out.helpFormFocus = await page.evaluate(() => `${document.activeElement.tagName}#${document.activeElement.id}`);
await page.locator('#kuec-help-question').fill('Which lab can run salt-spray tests in November?');
await page.keyboard.press('Enter');
await page.waitForTimeout(1500);
out.afterEnterModalOpen = await page.getByText('Ask Olivia for help?').count();
out.afterEnterFormOpen = await page.locator('#kuec-help-question').count();
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
if (await page.getByRole('button', { name: 'Cancel', exact: true }).count()) await page.getByRole('button', { name: 'Cancel', exact: true }).click();

// Slow network for the Accept write.
const session = await context.newCDPSession(page);
await session.send('Network.enable');
await session.send('Network.emulateNetworkConditions', { offline: false, latency: 2500, downloadThroughput: 50_000, uploadThroughput: 50_000 });
const accept = page.getByRole('button', { name: 'Accept', exact: true });
await accept.click();
const states = [];
for (let index = 0; index < 10; index += 1) {
  states.push(await page.evaluate(() => [...document.querySelectorAll('button')].filter((button) => /^(Accept|Decline|Request help|Submit)$/.test(button.textContent.trim())).map((button) => `${button.textContent.trim()}:${button.disabled || button.getAttribute('aria-disabled') === 'true' ? 'disabled' : 'enabled'}`).join(', ')));
  if (index === 1) await page.screenshot({ path: `${SHOTS}desktop-card-accept-pending.png` });
  await page.waitForTimeout(500);
}
out.buttonsDuringAccept = states;
// Double click test: a second click while pending.
await session.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
await page.waitForTimeout(6000);
out.toastText = await page.getByText(/Accepted\. It's on your list\.|That didn't save|Someone changed this/).allInnerTexts();
await page.screenshot({ path: `${SHOTS}desktop-card-after-accept.png` });
writeFileSync(new URL('./evidence/card-keys.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
