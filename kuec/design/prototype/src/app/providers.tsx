'use client';

import { type ReactNode, Suspense } from 'react';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { CrmShell } from '@/components/shell/CrmShell';
import { LocaleProvider, useLocale } from '@/i18n/LocaleContext';
import { PrototypeStoreProvider } from '@/store/PrototypeStore';
import { kuecTheme, themeVarsResolver } from '@/theme/kuec-theme';

type ProvidersProps = { children: ReactNode };

const DirectedMantine = ({ children }: ProvidersProps) => {
  const { direction } = useLocale();

  return (
    <DirectionProvider initialDirection={direction} detectDirection={false} key={direction}>
      <MantineProvider theme={kuecTheme} defaultColorScheme="light" cssVariablesResolver={themeVarsResolver}>
        <Notifications position="top-center" limit={3} autoClose={4000} />
        <PrototypeStoreProvider>
          <CrmShell>{children}</CrmShell>
        </PrototypeStoreProvider>
      </MantineProvider>
    </DirectionProvider>
  );
};

// Order mirrors the proposal for uVENTURE (theme.md section 4):
// DirectionProvider -> MantineProvider -> Notifications -> app providers.
export const Providers = ({ children }: ProvidersProps) => (
  <Suspense fallback={null}>
    <LocaleProvider>
      <DirectedMantine>{children}</DirectedMantine>
    </LocaleProvider>
  </Suspense>
);
