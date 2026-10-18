// What "Create" on Leads shows a BD officer: the form, how many fields, where Source, Company, Person and Need are.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const objectId = model.objects.find((candidate) => candidate.nameSingular === 'lead').id;
const inbox = model.views.find((view) => view.objectMetadataId === objectId && view.name === 'Lead inbox');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: new URL('./state-bd1.json', import.meta.url).pathname });
const page = await context.newPage();
const out = {};
await page.goto(`${BASE}/objects/leads?viewId=${inbox.id}`);
await page.waitForTimeout(8000);
const create = page.getByText('Create', { exact: true }).locator('visible=true').first();
out.createButton = await create.count();
const started = Date.now();
await create.click();
await page.waitForTimeout(3000);
await page.screenshot({ path: `${SHOTS}desktop-lead-create.png` });
const panelText = await page.locator('body').innerText();
out.panelExcerpt = panelText.split('\n').filter(Boolean).slice(-80).join(' / ').slice(0, 2500);
out.url = page.url();
out.formLabels = await page.evaluate(() => [...document.querySelectorAll('[data-testid*="field" i] label, label')].map((label) => label.textContent.trim()).filter(Boolean).slice(0, 60));
out.msToForm = Date.now() - started;
writeFileSync(new URL('./evidence/lead-create.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
