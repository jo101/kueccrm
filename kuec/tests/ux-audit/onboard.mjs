// Signs a persona in for the first time and records each onboarding screen Twenty shows before the CRM.
// node onboard.mjs <email>
import { existsSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, PASSWORD, SHOTS } from './browser.mjs';

const email = process.argv[2] ?? 'bd1@kuec.test';
const handle = email.split('@')[0];
const statePath = new URL(`./state-${handle}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai' });
const page = await context.newPage();
const log = [];
const started = Date.now();
await page.goto(`${BASE}/`);
await page.getByPlaceholder(/email/i).fill(email);
await page.getByRole('button', { name: /continue/i }).first().click();
await page.getByPlaceholder(/password/i).fill(PASSWORD);
await page.getByRole('button', { name: /sign in|continue/i }).first().click();
await page.waitForTimeout(6000);
for (let step = 0; step < 8; step += 1) {
  const dialog = page.locator('[data-testid="dialog-viewport"]');
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 240);
  log.push({ step, url: page.url().replace(BASE, ''), seconds: Math.round((Date.now() - started) / 1000), text });
  await page.screenshot({ path: `${SHOTS}onboard-${handle}-${step}.png` });
  if (await dialog.count()) {
    await dialog.getByText('Skip anyway', { exact: true }).click();
  } else if (page.url().includes('/create/profile')) {
    await page.getByRole('button', { name: /continue|استمر/i }).click();
  } else if (page.url().includes('/invite-team')) {
    await page.getByText('Skip', { exact: true }).first().click();
  } else if (/\/(sync|onboarding|plan)/.test(page.url())) {
    await page.getByText(/^(Skip|Continue|Get started)$/).first().click();
  } else {
    break;
  }
  await page.waitForTimeout(4000);
}
await page.waitForTimeout(4000);
await context.storageState({ path: statePath });
log.push({ landed: page.url().replace(BASE, ''), seconds: Math.round((Date.now() - started) / 1000) });
writeFileSync(new URL(`./evidence/onboard-${handle}.json`, import.meta.url), JSON.stringify(log, null, 1));
console.log(JSON.stringify(log, null, 1));
await browser.close();
