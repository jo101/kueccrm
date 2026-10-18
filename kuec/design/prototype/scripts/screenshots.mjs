// Captures the prototype at the design checkpoints with the system Chromium.
// Usage: node scripts/screenshots.mjs [baseUrl] (default http://localhost:3100/crm)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3100/crm';
const OUT = path.resolve(process.cwd(), '..', 'prototype-shots');
const EXECUTABLE = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const SHOTS = [
  { name: '01-today-bd-officer-desktop', path: '/?as=bd1', width: 1440, height: 1000 },
  { name: '02-today-ed-desktop', path: '/?as=ed', width: 1440, height: 1000 },
  { name: '03-today-ops-desktop', path: '/?as=ops', width: 1440, height: 1000 },
  { name: '04-work-package-offered-desktop', path: '/work/wp-term-sheet?as=bd1&from=notification', width: 1440, height: 1000 },
  { name: '05-work-package-review-desktop', path: '/work/wp-fatigue-quote?as=bd1', width: 1440, height: 1000 },
  { name: '06-today-bd-officer-phone', path: '/?as=bd1', width: 390, height: 844 },
  { name: '07-work-package-offered-phone', path: '/work/wp-term-sheet?as=bd1&from=notification', width: 390, height: 844 },
  { name: '08-today-bd-officer-arabic-desktop', path: '/?as=bd1&lang=ar', width: 1440, height: 1000 },
  { name: '09-work-package-offered-arabic-phone', path: '/work/wp-term-sheet?as=bd1&lang=ar&from=notification', width: 390, height: 844 },
  { name: '10-today-ed-arabic-desktop', path: '/?as=ed&lang=ar', width: 1440, height: 1000 },
  { name: '11-today-technical-contributor-phone', path: '/?as=eng2', width: 390, height: 844 },
  { name: '12-today-tablet', path: '/?as=bd1', width: 768, height: 1024 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: EXECUTABLE });
const results = [];

for (const shot of SHOTS) {
  const context = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 1, timezoneId: 'Asia/Dubai' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const file = path.join(OUT, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const metrics = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('.kuec-action, header button, header a, footer a, footer button')].map((element) => element.getBoundingClientRect());
    const filled = document.querySelectorAll('.mantine-Button-root[data-variant="filled"]').length;
    const dir = document.documentElement.getAttribute('dir');
    const firstCard = document.querySelector('article');
    return {
      dir,
      filledButtonsInViewport: [...document.querySelectorAll('.mantine-Button-root[data-variant="filled"]')].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      }).length,
      filledButtonsTotal: filled,
      smallestActionHeight: Math.min(...buttons.filter((rect) => rect.height > 0).map((rect) => rect.height)),
      firstCardTop: firstCard ? Math.round(firstCard.getBoundingClientRect().top) : null,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  results.push({ shot: shot.name, ...metrics, errors });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
