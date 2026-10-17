// Work package card: position on the page, focus order, tooltips, keyboard, Accept write (toast, disabled while pending), Decline form keys.
// node card.mjs <email> <width> <height> <label>
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', width = '1440', height = '1000', label = 'desktop'] = process.argv.slice(2);
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: Number(width), height: Number(height) }, timezoneId: 'Asia/Dubai', storageState: statePath });
const page = await context.newPage();
const out = {};

const findCardFrame = async () => {
  for (const frame of page.frames()) {
    try {
      if (await frame.locator('text=What do I do now?').count()) return frame;
    } catch { /* detached */ }
  }
  return null;
};

await page.goto(`${BASE}/object/workPackage/${ids.workPackages.OFFERED}`);
await page.waitForTimeout(10000);
const frame = await findCardFrame();
out.cardInIframe = frame !== null && frame !== page.mainFrame();
const card = frame ?? page.mainFrame();
const cardBox = await page.evaluate(() => {
  const candidates = [...document.querySelectorAll('iframe')];
  const rect = candidates[0]?.getBoundingClientRect();
  return rect ? { top: Math.round(rect.top), height: Math.round(rect.height), viewportHeight: window.innerHeight } : null;
});
out.cardPosition = cardBox;
out.cardText = (await card.locator('body').innerText()).slice(0, 1200);

// Bring the card into view and screenshot it.
await page.locator('iframe').first().scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(1000);
await page.screenshot({ path: `${SHOTS}${label}-card-offered.png` });

// Focus order inside the card.
await card.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
const focusOrder = [];
for (let index = 0; index < 14; index += 1) {
  await page.keyboard.press('Tab');
  const focused = await card.evaluate(() => {
    const element = document.activeElement;
    if (!element || element === document.body) return null;
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      text: (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 50),
      outline: `${style.outlineStyle} ${style.outlineWidth}`,
      boxShadow: style.boxShadow.slice(0, 60),
    };
  }).catch(() => null);
  focusOrder.push(focused);
}
out.focusOrder = focusOrder;

// Tooltip on focus of the first info icon.
const info = card.locator('.kuec-info').first();
await info.focus().catch(() => {});
await page.waitForTimeout(800);
out.tooltipOnFocus = await card.locator('[role="tooltip"], [data-side]').allInnerTexts().catch(() => []);

// Decline form: does Escape close it, does focus move into the input?
await card.getByRole('button', { name: 'Decline', exact: true }).click();
await page.waitForTimeout(600);
out.declineFormFocus = await card.evaluate(() => document.activeElement?.tagName + ':' + (document.activeElement?.id ?? ''));
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
out.declineFormOpenAfterEscape = await card.locator('#kuec-decline-reason').count();
await page.screenshot({ path: `${SHOTS}${label}-card-decline-form.png` });
const cancel = card.getByRole('button', { name: 'Cancel', exact: true });
if (await cancel.count()) await cancel.click();

// Accept: button disabled while pending, toast after.
const accept = card.getByRole('button', { name: 'Accept', exact: true });
const buttonStates = [];
await accept.click();
for (let index = 0; index < 8; index += 1) {
  buttonStates.push(await card.evaluate(() => [...document.querySelectorAll('button')].map((button) => `${button.textContent.trim()}:${button.disabled ? 'disabled' : 'enabled'}`).join(', ')).catch(() => 'n/a'));
  await page.waitForTimeout(150);
}
out.buttonsWhilePending = buttonStates;
await page.waitForTimeout(1500);
out.toasts = await page.locator('[class*="snack" i], [role="alert"], [data-sonner-toast]').allInnerTexts().catch(() => []);
await page.screenshot({ path: `${SHOTS}${label}-card-after-accept.png` });
out.cardTextAfterAccept = (await card.locator('body').innerText()).slice(0, 600);

writeFileSync(new URL(`./evidence/card-${label}.json`, import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
