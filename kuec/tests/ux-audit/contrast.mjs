// WCAG contrast of every status tag on the BD Team tab, My work, the kanban and the card, plus the card's secondary text.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE } from './browser.mjs';

const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const viewId = (object, name) => {
  const objectId = model.objects.find((candidate) => candidate.nameSingular === object).id;
  return model.views.find((view) => view.objectMetadataId === objectId && view.name === name)?.id;
};
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Dubai', storageState: new URL('./state-bd1.json', import.meta.url).pathname });
const page = await context.newPage();

const MEASURE = () => {
  // Computed colours come back as color(display-p3 r g b [/ a]) with channels 0..1; luminance uses the P3 (D65) coefficients.
  const parse = (value) => {
    const isP3 = value.includes('display-p3');
    const numbers = (value.replace('display-p3', '').match(/[\d.]+/g) ?? []).map(Number);
    const channels = isP3 ? numbers.slice(0, 3) : numbers.slice(0, 3).map((channel) => channel / 255);
    const alpha = isP3 ? (numbers[3] ?? 1) : (numbers[3] ?? 1);
    return [...channels, alpha];
  };
  const luminance = ([red, green, blue]) => {
    const channel = (value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2290 * channel(red) + 0.6917 * channel(green) + 0.0793 * channel(blue);
  };
  const backgroundOf = (element) => {
    let current = element;
    while (current) {
      const color = parse(getComputedStyle(current).backgroundColor);
      if (color[3] > 0.5) return color.slice(0, 3);
      current = current.parentElement;
    }
    return [1, 1, 1];
  };
  const ratio = (element) => {
    const foreground = parse(getComputedStyle(element).color).slice(0, 3);
    const background = backgroundOf(element);
    const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
  };
  const results = {};
  const STATUS_WORDS = /^(Planned|Offered|Accepted|Submitted|Blocked|Done|Declined|Cancelled|New|Screening|Meeting|Proposal|Customer|Signed|Lost|Parked|Not started|Waiting to be accepted|In progress|Waiting for review|Stopped|Green \(on track\)|Amber \(at risk\)|Red \(off track\)|Contacted|Engaged|Qualified|Converted|Nurture|Dead|To do)$/;
  for (const element of document.querySelectorAll('span, div')) {
    const text = element.textContent?.trim() ?? '';
    if (!STATUS_WORDS.test(text) || element.children.length > 1) continue;
    const style = getComputedStyle(element);
    if (style.backgroundColor === 'rgba(0, 0, 0, 0)' && !element.parentElement) continue;
    const value = ratio(element);
    results[text] = Math.min(results[text] ?? 99, value);
  }
  for (const selector of ['.kuec-card__muted', '.kuec-card__eyebrow', '.kuec-card__hint', '.kuec-card__meta', '.kuec-info']) {
    const element = document.querySelector(selector);
    if (element) results[selector] = ratio(element);
  }
  return results;
};

const out = {};
for (const [name, url] of [
  ['my-work', `${BASE}/objects/workPackages?viewId=${viewId('workPackage', 'My work')}`],
  ['work-packages-by-status-kanban', `${BASE}/objects/workPackages?viewId=${viewId('workPackage', 'By status')}`],
  ['pipeline-kanban', `${BASE}/objects/opportunities?viewId=${viewId('opportunity', 'Pipeline')}`],
  ['card-accepted', `${BASE}/object/workPackage/${ids.workPackages.ACCEPTED}`],
  ['card-blocked', `${BASE}/object/workPackage/${ids.workPackages.BLOCKED}`],
  ['card-submitted', `${BASE}/object/workPackage/${ids.workPackages.SUBMITTED}`],
  ['card-planned', `${BASE}/object/workPackage/${ids.workPackages.PLANNED}`],
]) {
  await page.goto(url);
  await page.waitForTimeout(9000);
  out[name] = await page.evaluate(MEASURE);
  console.log(name, JSON.stringify(out[name]));
}
writeFileSync(new URL('./evidence/contrast.json', import.meta.url), JSON.stringify(out, null, 1));
await browser.close();
