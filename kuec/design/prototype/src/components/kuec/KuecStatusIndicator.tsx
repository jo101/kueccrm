'use client';

import { Badge, Box, Group } from '@mantine/core';

import { KUEC_STATUS_COLOR, type KuecStatusTone } from '@/theme/kuec-theme';

type KuecStatusIndicatorProps = {
  tone: KuecStatusTone;
  label: string;
};

// Semantic colour only (success, warning, error, gray from uVENTURE's theme);
// the label is always the plain word from the glossary, never a system value.
export const KuecStatusIndicator = ({ tone, label }: KuecStatusIndicatorProps) => (
  <Badge
    variant="light"
    color={KUEC_STATUS_COLOR[tone]}
    size="lg"
    radius="xl"
    styles={{
      root: { textTransform: 'none', fontWeight: 500, paddingInline: 10, height: 'auto', minHeight: 26, paddingBlock: 3, maxWidth: '100%' },
      label: { overflow: 'visible', whiteSpace: 'normal', lineHeight: 1.3, textAlign: 'start' },
    }}
    leftSection={
      <Group gap={0} aria-hidden>
        <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: `var(--mantine-color-${KUEC_STATUS_COLOR[tone]}-filled)` }} />
      </Group>
    }
  >
    {label}
  </Badge>
);
