'use client';

import { Box, Group, Text } from '@mantine/core';

import { KUEC_CONTROL, kuecStatusCssColor, type KuecStatusTone } from '@/theme/kuec-tokens';

type KuecStatusProps = {
  tone: KuecStatusTone;
  label: string;
  size?: 'sm' | 'xs';
};

// The only way status is shown: a 6 px dot in one of the four semantic colours
// and the plain word beside it. Never a filled badge, never a system value.
export const KuecStatus = ({ tone, label, size = 'sm' }: KuecStatusProps) => (
  <Group gap={6} wrap="nowrap" component="span" role="status" aria-label={label} style={{ display: 'inline-flex', minWidth: 0 }}>
    <Box
      component="span"
      aria-hidden
      style={{ width: KUEC_CONTROL.statusDotPx, height: KUEC_CONTROL.statusDotPx, borderRadius: '50%', backgroundColor: kuecStatusCssColor(tone), flexShrink: 0 }}
    />
    <Text component="span" size={size} fw={600} c={tone === 'neutral' ? 'dimmed' : kuecStatusCssColor(tone)} style={{ whiteSpace: 'nowrap' }}>
      {label}
    </Text>
  </Group>
);
