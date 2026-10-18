'use client';

import { type ReactNode } from 'react';
import { Drawer } from '@mantine/core';

import { useLocale } from '@/i18n/LocaleContext';
import { KUEC_LAYOUT } from '@/theme/kuec-tokens';

type KuecDrawerProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// The one drawer: opens from the end side (mirrors in RTL), 250 ms, right-rail width on desktop, full width on phones.
export const KuecDrawer = ({ opened, onClose, title, children }: KuecDrawerProps) => {
  const { direction } = useLocale();

  return (
    <Drawer opened={opened} onClose={onClose} title={title} position={direction === 'rtl' ? 'left' : 'right'} size={KUEC_LAYOUT.rightRailWidthPx + 120} trapFocus returnFocus>
      {children}
    </Drawer>
  );
};
