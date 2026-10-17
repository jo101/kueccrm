// Hovers field labels on a record page and table headers, and an option in a select, to see which descriptions surface.
// node hover.mjs <email> <label>
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', label = 'desktop'] = process.argv.slice(2);
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const viewId = (object, name) => {
  const objectId = model.objects.find((candidate) => candidate.nameSingular === object).id;
  return model.views.find((view) => view.objectMetadataId === objectId && view.name === name)?.id;
};
const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: statePath });
const page = await context.newPage();
const out = {};

const tooltipText = async () => {
  await page.waitForTimeout(1200);
  return (await page.locator('[role="tooltip"], [data-side][data-open], [class*="tooltip" i]').allInnerTexts().catch(() => [])).filter(Boolean).slice(0, 3);
};

const hoverLabel = async (key, text) => {
  const target = page.getByText(text, { exact: true }).locator('visible=true').first();
  if (!(await target.count())) { out[key] = 'label not found'; return; }
  await target.scrollIntoViewIfNeeded();
  await target.hover();
  out[key] = await tooltipText();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
};

await page.goto(`${BASE}/object/opportunity/${ids.opportunity}`);
await page.waitForTimeout(9000);
await hoverLabel('opportunity: Next action (app field)', 'Next action');
await hoverLabel('opportunity: Stage (Twenty field)', 'Stage');
await hoverLabel('opportunity: Source (app field)', 'Source');
await page.screenshot({ path: `${SHOTS}${label}-hover-record-field.png` });

await page.goto(`${BASE}/object/lead/${ids.lead}`);
await page.waitForTimeout(9000);
await hoverLabel('lead: Need', 'Need');
await hoverLabel('lead: Need identified', 'Need identified');

await page.goto(`${BASE}/objects/workPackages?viewId=${viewId('workPackage', 'My work')}`);
await page.waitForTimeout(9000);
await hoverLabel('My work table header: Due', 'Due');
await page.screenshot({ path: `${SHOTS}${label}-hover-table-header.png` });

// Open the Source select on the opportunity and hover an option.
await page.goto(`${BASE}/object/opportunity/${ids.opportunity}`);
await page.waitForTimeout(9000);
const sourceValue = page.getByText('Inbound (web or email or phone)', { exact: true }).locator('visible=true').first();
if (await sourceValue.count()) {
  await sourceValue.click();
  await page.waitForTimeout(1200);
  const option = page.getByText('Referral: colleague', { exact: true }).locator('visible=true').first();
  if (await option.count()) {
    await option.hover();
    out['opportunity: Source option hover'] = await tooltipText();
    out['opportunity: Source options visible'] = (await page.locator('[role="listbox"], [role="menu"]').first().innerText().catch(() => '')).split('\n').slice(0, 30);
  }
  await page.screenshot({ path: `${SHOTS}${label}-hover-option.png` });
  await page.keyboard.press('Escape');
}
writeFileSync(new URL(`./evidence/hover-${label}.json`, import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
