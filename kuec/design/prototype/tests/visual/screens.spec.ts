import { expect, test, type Page } from '@playwright/test';

import { SCREENS, VARIANTS, VIEWPORTS, variantName, variantQuery } from './matrix';

// Fonts and images settle before the capture; animations are disabled by the config.
const settle = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
};

type Checks = {
  dir: string | null;
  lang: string | null;
  filledButtonsInViewport: number;
  smallestActionHeight: number;
  horizontalOverflow: boolean;
  firstArticleTop: number | null;
  uppercase: number;
  filledBadges: number;
};

const measure = (page: Page): Promise<Checks> =>
  page.evaluate(() => {
    const filled = [...document.querySelectorAll<HTMLElement>('.mantine-Button-root[data-variant="filled"]')];
    const inViewport = filled.filter((element) => {
      const rect = element.getBoundingClientRect();

      return rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    const actions = [...document.querySelectorAll<HTMLElement>('.kuec-action, footer a, footer button')].map((element) => element.getBoundingClientRect()).filter((rect) => rect.height > 0);
    const uppercase = [...document.querySelectorAll<HTMLElement>('main *')].filter((element) => element.children.length === 0 && element.textContent?.trim() && getComputedStyle(element).textTransform === 'uppercase').length;
    const filledBadges = document.querySelectorAll('.mantine-Badge-root[data-variant="filled"]').length;
    const firstArticle = document.querySelector('main article');

    return {
      dir: document.documentElement.getAttribute('dir'),
      lang: document.documentElement.getAttribute('lang'),
      filledButtonsInViewport: inViewport.length,
      smallestActionHeight: actions.length > 0 ? Math.min(...actions.map((rect) => rect.height)) : 0,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      firstArticleTop: firstArticle ? Math.round(firstArticle.getBoundingClientRect().top) : null,
      uppercase,
      filledBadges,
    };
  });

for (const screen of SCREENS) {
  test.describe(screen.id, () => {
    for (const variant of VARIANTS) {
      const name = variantName(variant);

      test(`${screen.description} [${name}]`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(String(error)));
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        await page.setViewportSize(VIEWPORTS[variant.viewport]);
        await page.goto(`/crm${screen.path}?${variantQuery(variant, screen.query)}`);
        await settle(page);

        const checks = await measure(page);
        expect.soft(errors, 'no console errors').toEqual([]);
        expect.soft(checks.dir, 'direction follows the locale').toBe(variant.locale === 'ar' ? 'rtl' : 'ltr');
        expect.soft(checks.lang).toBe(variant.locale === 'ar' ? 'ar-AE' : 'en-AE');
        expect.soft(checks.horizontalOverflow, 'no horizontal overflow').toBe(false);
        expect.soft(checks.filledButtonsInViewport, 'at most one filled button in the viewport').toBeLessThanOrEqual(1);
        expect.soft(checks.uppercase, 'no all-caps text').toBe(0);
        expect.soft(checks.filledBadges, 'status never a filled badge').toBe(0);
        if (variant.viewport === 'phone') {
          expect.soft(checks.smallestActionHeight, 'actions at least 44 px on a phone').toBeGreaterThanOrEqual(44);
        }
        if (screen.id.startsWith('task-')) {
          expect.soft(checks.firstArticleTop, 'the card is first on the page').toBeLessThan(200);
        }

        // A full-page capture keeps fixed chrome at the original viewport bottom, mid-page;
        // for the mockup the bottom bar is pinned to the end of the document instead.
        await page.evaluate(() => {
          const footer = document.querySelector<HTMLElement>('.mantine-AppShell-footer');
          if (footer) {
            const height = footer.getBoundingClientRect().height;
            footer.style.position = 'absolute';
            footer.style.insetBlockStart = `${document.documentElement.scrollHeight - height}px`;
            footer.style.insetBlockEnd = 'auto';
          }
          document.querySelectorAll<HTMLElement>('.kuec-sticky-actions').forEach((element) => {
            element.style.position = 'static';
          });
        });
        await expect(page).toHaveScreenshot(`${screen.id}--${name}.png`, { fullPage: true });
      });
    }
  });
}
