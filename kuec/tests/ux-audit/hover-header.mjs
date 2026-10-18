// Table column header hover on My work, with a longer dwell.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const objectId = model.objects.find((candidate) => candidate.nameSingular === 'workPackage').id;
const view = model.views.find((candidate) => candidate.objectMetadataId === objectId && candidate.name === 'My work');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: new URL('./state-bd1.json', import.meta.url).pathname });
const page = await context.newPage();
await page.goto(`${BASE}/objects/workPackages?viewId=${view.id}`);
await page.waitForTimeout(9000);
for (const header of ['Due', 'Status', 'Owner']) {
  const cell = page.locator('[role="columnheader"], th, [data-testid*="column-head" i]').filter({ hasText: header }).first();
  const fallback = page.getByText(header, { exact: true }).locator('visible=true').first();
  const target = (await cell.count()) ? cell : fallback;
  await target.hover();
  await page.waitForTimeout(2500);
  const tips = await page.locator('[role="tooltip"]').allInnerTexts().catch(() => []);
  console.log(header, JSON.stringify(tips));
  await page.mouse.move(5, 500);
  await page.waitForTimeout(500);
}
await page.screenshot({ path: `${SHOTS}desktop-hover-table-header.png` });
await browser.close();
