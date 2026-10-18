// Walks every screen as one persona at one width and records what a first-week employee sees.
// node screens.mjs <email> <width> <height> <label> [locale]   (after onboard.mjs <email>)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, SHOTS } from './browser.mjs';

const [email = 'bd1@kuec.test', width = '1440', height = '1000', label = 'desktop', locale = 'en-US'] = process.argv.slice(2);
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const page_ = (name) => model.pageLayouts.find((layout) => layout.name === name && layout.type === 'STANDALONE_PAGE');
const viewId = (object, name) => {
  const objectId = model.objects.find((candidate) => candidate.nameSingular === object).id;
  return model.views.find((view) => view.objectMetadataId === objectId && view.name === name)?.id;
};

const statePath = new URL(`./state-${email.split('@')[0]}.json`, import.meta.url).pathname;
if (!existsSync(statePath)) {
  console.log(`No session for ${email}: run node onboard.mjs ${email} first.`);
  process.exit(1);
}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({
  viewport: { width: Number(width), height: Number(height) },
  locale,
  timezoneId: 'Asia/Dubai',
  storageState: statePath,
});
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text().slice(0, 160)); });

const SCREENS = [
  ['home', `${BASE}/page/${page_('Home').id}`],
  ['exceptions', `${BASE}/page/${page_('Exceptions').id}`],
  ['data-quality', `${BASE}/page/${page_('Data quality').id}`],
  ...page_('BD').tabs.sort((a, b) => a.position - b.position).map((tab) => [`bd-${tab.title.toLowerCase().replace(/\W+/g, '-')}`, `${BASE}/page/${page_('BD').id}?tabId=${tab.id}`]),
  ...page_('uVENTURE').tabs.sort((a, b) => a.position - b.position).map((tab) => [`uventure-${tab.title.toLowerCase().replace(/\W+/g, '-')}`, `${BASE}/page/${page_('uVENTURE').id}?tabId=${tab.id}`]),
  ...Object.entries(ids.workPackages).map(([status, id]) => [`wp-${status.toLowerCase()}`, `${BASE}/object/workPackage/${id}`]),
  ['opportunity', `${BASE}/object/opportunity/${ids.opportunity}`],
  ['company', `${BASE}/object/company/${ids.company}`],
  ['person', `${BASE}/object/person/${ids.person}`],
  ['lead', `${BASE}/object/lead/${ids.lead}`],
  ['view-leads-inbox', `${BASE}/objects/leads?viewId=${viewId('lead', 'Lead inbox')}`],
  ['view-pipeline', `${BASE}/objects/opportunities?viewId=${viewId('opportunity', 'Pipeline')}`],
  ['view-my-work', `${BASE}/objects/workPackages?viewId=${viewId('workPackage', 'My work')}`],
  ['view-companies-default', `${BASE}/objects/companies`],
  ['view-people-default', `${BASE}/objects/people`],
  ['view-tasks-default', `${BASE}/objects/tasks`],
  ['view-opportunities-default', `${BASE}/objects/opportunities`],
];

const only = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;
const results = {};
for (const [name, url] of SCREENS) {
  if (only && !only.has(name)) continue;
  const started = Date.now();
  await page.goto(url);
  await page.waitForTimeout(Number(process.env.WAIT ?? 9000));
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const text = document.body.innerText;
    return {
      title: document.title,
      horizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      guidanceHeading: /How this (record|tab) works/.test(text),
      guidanceBody: /What it is:/.test(text),
      guidanceArabic: /ما هذا/.test(text),
      whatDoIDoNow: /What do I do now\?/.test(text),
      requestHelpWord: /Request help/.test(text),
      viewName: document.querySelector('[data-testid="view-picker-dropdown-button"], [data-testid="dropdown-button-view-picker"]')?.textContent ?? null,
      iframes: [...document.querySelectorAll('iframe')].map((frame) => frame.src).slice(0, 5),
      firstText: text.slice(0, 600),
    };
  });
  const frameTexts = [];
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    try { frameTexts.push((await frame.locator('body').innerText({ timeout: 2000 })).slice(0, 1500)); } catch { /* cross-origin or gone */ }
  }
  await page.screenshot({ path: `${SHOTS}${label}-${name}.png`, fullPage: false });
  results[name] = { url: page.url(), ms: Date.now() - started, ...metrics, frameTexts };
  console.log(`${name}: overflow=${metrics.horizontalOverflow} (${metrics.scrollWidth}/${metrics.clientWidth}) guidance=${metrics.guidanceHeading}/${metrics.guidanceBody}/${metrics.guidanceArabic} next=${metrics.whatDoIDoNow} frames=${frameTexts.length}`);
}
writeFileSync(new URL(`./evidence/screens-${label}-${email.split('@')[0]}.json`, import.meta.url), JSON.stringify({ results, errors: [...new Set(errors)].slice(0, 40) }, null, 1));
await browser.close();
