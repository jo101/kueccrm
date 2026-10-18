import { defineConfig } from '@playwright/test';

// Visual regression over the eight variants of the test matrix (LTR and RTL x
// light and dark x 390 and 1440) against the committed mockups in ../mockups.
// The browser is the Chromium Playwright 1.56 ships (pre-installed here);
// a production build is served, never the dev server.
const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  snapshotPathTemplate: '{testDir}/../../../mockups/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    timezoneId: 'Asia/Dubai',
    locale: 'en-AE',
    deviceScaleFactor: 1,
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : undefined,
  },
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}/crm`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
