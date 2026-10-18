import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import './fonts.css';
import '../src/app/globals.css';

import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { DAYJS_LOCALE, FIRST_DAY_OF_WEEK, WEEKEND_DAYS } from '../src/i18n/dates';
import { LocaleProvider, directionOf, htmlLangOf } from '../src/i18n/LocaleContext';
import type { Locale } from '../src/i18n/messages';
import { WorkbenchStoreProvider } from '../src/store/WorkbenchStore';
import { kuecTheme, themeVarsResolver } from '../src/theme/kuec-theme';

// The eight variants of the test matrix come from two toolbar globals (locale
// and scheme) and the viewport addon (390 and 1440); direction follows the locale.
const withProviders: Decorator = (Story, context) => {
  const locale = (context.globals.locale as Locale) ?? 'en';
  const scheme = (context.globals.scheme as 'light' | 'dark') ?? 'light';
  const viewerId = (context.parameters.viewerId as string | undefined) ?? 'bd1';
  const direction = directionOf(locale);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', htmlLangOf(locale));
  }, [direction, locale]);

  return (
    <LocaleProvider locale={locale} onLocaleChange={() => undefined}>
      <DirectionProvider initialDirection={direction} detectDirection={false} key={direction}>
        <MantineProvider theme={kuecTheme} forceColorScheme={scheme} cssVariablesResolver={themeVarsResolver}>
          <DatesProvider settings={{ locale: DAYJS_LOCALE[locale], firstDayOfWeek: FIRST_DAY_OF_WEEK, weekendDays: WEEKEND_DAYS }}>
            <ModalsProvider>
              <Notifications position="top-center" limit={3} />
              <WorkbenchStoreProvider viewerId={viewerId}>
                <div style={{ padding: 16, maxWidth: 1200 }}>
                  <Story />
                </div>
              </WorkbenchStoreProvider>
            </ModalsProvider>
          </DatesProvider>
        </MantineProvider>
      </DirectionProvider>
    </LocaleProvider>
  );
};

const preview: Preview = {
  decorators: [withProviders],
  globalTypes: {
    locale: {
      description: 'Language and direction',
      toolbar: { title: 'Locale', items: [{ value: 'en', title: 'English (LTR)' }, { value: 'ar', title: 'Arabic (RTL)' }], dynamicTitle: true },
    },
    scheme: {
      description: 'Colour scheme',
      toolbar: { title: 'Scheme', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
  },
  initialGlobals: { locale: 'en', scheme: 'light' },
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    viewport: {
      options: {
        phone: { name: 'Phone 390', styles: { width: '390px', height: '844px' } },
        desktop: { name: 'Desktop 1440', styles: { width: '1440px', height: '1000px' } },
      },
    },
  },
};

export default preview;
