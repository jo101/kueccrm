// Phone width (390 x 844): Home, the work package card and the BD Team tab. Measures overflow, what is above the fold, button sizes.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const layout = (name) => model.pageLayouts.find((candidate) => candidate.name === name && candidate.type === 'STANDALONE_PAGE');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'Asia/Dubai',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  storageState: new URL('./state-bd1.json', import.meta.url).pathname,
});
const page = await context.newPage();
const out = {};
const measure = async (name) => {
  const facts = await page.evaluate(() => {
    const doc = document.documentElement;
    const visible = (pattern) => [...document.querySelectorAll('button, a, span, p, div')].some((element) => {
      if (!pattern.test(element.textContent?.trim() ?? '') || element.children.length > 2) return false;
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0;
    });
    const cardButtons = [...document.querySelectorAll('button')].filter((button) => /^(Accept|Decline|Request help|Submit)$/.test(button.textContent.trim())).map((button) => {
      const rect = button.getBoundingClientRect();
      return `${button.textContent.trim()} ${Math.round(rect.width)}x${Math.round(rect.height)} at y=${Math.round(rect.top)}`;
    });
    return {
      horizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
      widths: [doc.scrollWidth, doc.clientWidth],
      pageHeight: doc.scrollHeight,
      guidanceAboveFold: visible(/^What it is:/),
      firstTableAboveFold: visible(/^(Needs your decision|Open work packages per owner, by status)$/),
      cardButtonsAboveFold: visible(/^(Accept|Submit)$/),
      cardButtons,
    };
  });
  await page.screenshot({ path: `${SHOTS}phone-${name}.png` });
  await page.screenshot({ path: `${SHOTS}phone-${name}-full.png`, fullPage: true }).catch(() => {});
  out[name] = facts;
  console.log(name, JSON.stringify(facts));
};

await page.goto(`${BASE}/page/${layout('Home').id}`);
await page.waitForTimeout(10000);
await measure('home');

await page.goto(`${BASE}/object/workPackage/${ids.workPackages.ACCEPTED}`);
await page.waitForTimeout(10000);
await measure('work-package-accepted');
const submit = page.getByRole('button', { name: 'Submit', exact: true });
if (await submit.count()) {
  const scrolls = await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((candidate) => candidate.textContent.trim() === 'Submit');
    return Math.round(button.getBoundingClientRect().top + window.scrollY);
  });
  out.cardSubmitOffsetPx = scrolls;
  await submit.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SHOTS}phone-work-package-card.png` });
}

await page.goto(`${BASE}/page/${layout('BD').id}`);
await page.waitForTimeout(9000);
const team = page.getByText('Team', { exact: true }).locator('visible=true').first();
out.teamTabReachable = await team.count();
if (out.teamTabReachable) {
  await team.click();
  await page.waitForTimeout(9000);
}
await measure('bd-team');
writeFileSync(new URL('./evidence/phone.json', import.meta.url), JSON.stringify(out, null, 1));
await browser.close();
