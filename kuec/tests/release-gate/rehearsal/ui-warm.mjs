import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { rest } from './lib.mjs';
const ids = JSON.parse(readFileSync(new URL('./ui-ids.json', import.meta.url)));
const opps = (await rest('GET', `opportunities?limit=12&filter=${encodeURIComponent('name[like]:"Load Co 1%"')}`)).json.data.opportunities;
const wps = (await rest('GET', `workPackages?limit=12&filter=${encodeURIComponent('name[like]:"Draft load item 1%"')}`)).json.data.workPackages;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://server:3000/');
await page.getByPlaceholder(/email/i).fill('bd1@kuec.test');
await page.getByRole('button', { name: /continue/i }).first().click();
await page.getByPlaceholder(/password/i).fill('Rehearsal-2026!pw');
await page.getByRole('button', { name: /sign in|continue/i }).first().click();
await page.waitForTimeout(5000);
for (let i = 0; i < 12; i++) { const skip = page.getByRole('button', { name: /^skip$/i }).first(); if (!(await skip.count()) && !(await page.getByText('Create profile').count())) break; if (await skip.count()) { await skip.click(); await page.waitForTimeout(800); const c = page.getByRole('dialog').getByRole('button').filter({ hasText: /skip|continue|confirm|yes/i }).last(); if (await c.count()) await c.click(); } else { await page.getByRole('button', { name: /continue/i }).first().click().catch(() => {}); } await page.waitForTimeout(2000); }
await page.goto(`http://server:3000/object/opportunity/${ids.opportunity}`);
await page.waitForTimeout(6000);
const go = async (object, record) => {
  const start = Date.now();
  await page.evaluate((url) => { window.history.pushState({}, '', url); window.dispatchEvent(new PopStateEvent('popstate')); }, `/object/${object}/${record.id}`);
  await page.getByText(record.name, { exact: true }).first().waitFor({ timeout: 20000 });
  return Date.now() - start;
};
const times = { opportunity: [], workPackage: [] };
for (let i = 0; i < 10; i++) { times.opportunity.push(await go('opportunity', opps[i])); times.workPackage.push(await go('workPackage', wps[i])); }
const p = (a) => { const s = [...a].sort((x, y) => x - y); return { p50: s[Math.floor(s.length / 2)], p95: s[Math.floor(s.length * 0.95)], max: s[s.length - 1] }; };
console.log(JSON.stringify({ persona: 'bd1', warmNavigationMs: { opportunity: p(times.opportunity), workPackage: p(times.workPackage) }, raw: times }));
await browser.close();
