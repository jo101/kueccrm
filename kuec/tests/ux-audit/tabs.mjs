// Clicks through every tab of the BD and uVENTURE pages and records the guidance widget and widget errors.
// node tabs.mjs <email> <width> <height> <label>
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', width = '1440', height = '1000', label = 'desktop'] = process.argv.slice(2);
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: Number(width), height: Number(height) }, timezoneId: 'Asia/Dubai', storageState: statePath });
const page = await context.newPage();
const results = {};
for (const pageName of ['BD', 'uVENTURE', 'Data quality', 'Exceptions', 'Home']) {
  const layout = model.pageLayouts.find((candidate) => candidate.name === pageName && candidate.type === 'STANDALONE_PAGE');
  await page.goto(`${BASE}/page/${layout.id}`);
  await page.waitForTimeout(7000);
  for (const tab of [...layout.tabs].sort((a, b) => a.position - b.position)) {
    if (layout.tabs.length > 1) {
      await page.getByText(tab.title, { exact: true }).locator('visible=true').first().click();
      await page.waitForTimeout(9000);
    }
    const name = `${pageName}-${tab.title}`.toLowerCase().replace(/\W+/g, '-');
    const facts = await page.evaluate(() => {
      const text = document.body.innerText;
      const doc = document.documentElement;
      return {
        guidanceBody: /What it is:/.test(text),
        guidanceArabic: /ما هذا/.test(text),
        requestHelp: /Request help/.test(text),
        noData: (text.match(/No data|No records|Nothing/gi) ?? []).length,
        errors: (text.match(/error|went wrong|could not/gi) ?? []).length,
        horizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
        widths: [doc.scrollWidth, doc.clientWidth],
        skeletons: document.querySelectorAll('[class*="skeleton" i], .react-loading-skeleton').length,
      };
    });
    await page.screenshot({ path: `${SHOTS}${label}-tab-${name}.png`, fullPage: false });
    results[name] = facts;
    console.log(name, JSON.stringify(facts));
  }
}
writeFileSync(new URL(`./evidence/tabs-${label}-${email.split('@')[0]}.json`, import.meta.url), JSON.stringify(results, null, 1));
await browser.close();
