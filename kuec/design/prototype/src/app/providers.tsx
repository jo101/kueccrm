'use client';

import { type ReactNode, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { CrmShell } from '@/components/shell/CrmShell';
import { DAYJS_LOCALE, FIRST_DAY_OF_WEEK, WEEKEND_DAYS } from '@/i18n/dates';
import { UrlLocaleProvider, directionOf, htmlLangOf, useLocale } from '@/i18n/LocaleContext';
import { WorkbenchStoreProvider } from '@/store/WorkbenchStore';
import { kuecTheme, themeVarsResolver } from '@/theme/kuec-theme';
import { KUEC_MOTION } from '@/theme/kuec-tokens';

type ProvidersProps = { children: ReactNode };

type Scheme = 'light' | 'dark';

const isScheme = (value: string | null): value is Scheme => value === 'light' || value === 'dark';

const DirectedMantine = ({ children }: ProvidersProps) => {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const direction = directionOf(locale);
  const requestedScheme = searchParams.get('scheme');
  const scheme: Scheme = isScheme(requestedScheme) ? requestedScheme : 'light';
  const viewerId = searchParams.get('as') ?? 'bd1';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', htmlLangOf(locale));
  }, [direction, locale]);

  return (
    <DirectionProvider initialDirection={direction} detectDirection={false} key={direction}>
      <MantineProvider theme={kuecTheme} forceColorScheme={scheme} cssVariablesResolver={themeVarsResolver}>
        <DatesProvider settings={{ locale: DAYJS_LOCALE[locale], firstDayOfWeek: FIRST_DAY_OF_WEEK, weekendDays: WEEKEND_DAYS, consistentWeeks: true }}>
          <ModalsProvider>
            <Notifications position="top-center" limit={3} autoClose={4000} transitionDuration={KUEC_MOTION.panelMs} />
            <WorkbenchStoreProvider viewerId={viewerId}>
              <CrmShell>{children}</CrmShell>
            </WorkbenchStoreProvider>
          </ModalsProvider>
        </DatesProvider>
      </MantineProvider>
    </DirectionProvider>
  );
};

// Order mirrors the proposal for uVENTURE (design/theme.md section 4):
// DirectionProvider -> MantineProvider -> DatesProvider -> ModalsProvider ->
// Notifications -> app providers. The colour scheme is forced from the URL so
// a screenshot reproduces light or dark exactly; uVENTURE's "auto" stays in production.
export const Providers = ({ children }: ProvidersProps) => (
  <Suspense fallback={null}>
    <UrlLocaleProvider>
      <DirectedMantine>{children}</DirectedMantine>
    </UrlLocaleProvider>
  </Suspense>
);
