// Opens every picker view (table, kanban, calendar) of the app as the ED and records whether it rendered.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const rows = readFileSync(new URL('./views.tsv', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split('|')).filter(([, , , type]) => !type.includes('WIDGET'));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://server:3000/');
await page.getByPlaceholder(/email/i).fill('ed@kuec.test');
await page.getByRole('button', { name: /continue/i }).first().click();
await page.getByPlaceholder(/password/i).fill('Rehearsal-2026!pw');
await page.getByRole('button', { name: /sign in|continue/i }).first().click();
await page.waitForTimeout(7000);
const out = [];
for (const [id, plural, name, type, cols] of rows) {
  const start = Date.now();
  await page.evaluate((url) => { window.history.pushState({}, '', url); window.dispatchEvent(new PopStateEvent('popstate')); }, `/objects/${plural}?viewId=${id}`);
  let ok = true;
  try { await page.getByText(name, { exact: true }).first().waitFor({ timeout: 15000 }); } catch { ok = false; }
  await page.waitForTimeout(700);
  const body = await page.locator('body').innerText();
  const error = /something went wrong|error loading|an error occurred/i.test(body);
  out.push({ plural, name, type, cols: Number(cols), opened: ok && !error, ms: Date.now() - start });
  if (!ok || error) await page.screenshot({ path: new URL(`../evidence/view-fail-${plural}-${name.replace(/\W+/g, '-')}.png`, import.meta.url).pathname });
}
writeFileSync(new URL('../evidence/ui-views.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(`opened ${out.filter((o) => o.opened).length}/${out.length}; >6 columns: ${out.filter((o) => o.cols > 6).map((o) => `${o.plural}:${o.cols}`).join(' ')}`);
console.log('not opened:', out.filter((o) => !o.opened).map((o) => `${o.plural}/${o.name}`).join('; '));
await browser.close();
