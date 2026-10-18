'use client';

import { Button, Card, Group, Stack, Text } from '@mantine/core';

import { KUEC_TOUCH_TARGET_PX, type KuecStatusTone } from '@/theme/kuec-theme';

import { KuecStatusIndicator } from './KuecStatusIndicator';

type KuecActionCardProps = {
  eyebrow: string;
  title: string;
  caseName: string;
  context: string;
  owner: string;
  deadline: string;
  statusTone: KuecStatusTone;
  statusLabel: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

// At most six facts above the fold: title, case, context, owner, deadline,
// status. One filled button. Composes Card, Stack, Group, Text, Button.
export const KuecActionCard = ({
  eyebrow,
  title,
  caseName,
  context,
  owner,
  deadline,
  statusTone,
  statusLabel,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: KuecActionCardProps) => (
  <Card component="article" aria-label={title}>
    <Stack gap="sm">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
        <Stack gap={2} style={{ minWidth: 0, flex: '1 1 240px' }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.04em' }}>
            {eyebrow}
          </Text>
          <Text fw={600} size="lg" style={{ lineHeight: 1.3 }}>
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            <bdi>{caseName}</bdi>
          </Text>
        </Stack>
        <KuecStatusIndicator tone={statusTone} label={statusLabel} />
      </Group>
      <Text size="sm">{context}</Text>
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Group gap="md">
          <Text size="sm" c="dimmed">
            <bdi>{owner}</bdi>
          </Text>
          <Text size="sm" fw={500}>
            {deadline}
          </Text>
        </Group>
        <Group gap="xs" wrap="nowrap" className="kuec-card-actions">
          {secondaryLabel && secondaryHref ? (
            <Button component="a" href={secondaryHref} variant="default" h={KUEC_TOUCH_TARGET_PX} className="kuec-action">
              {secondaryLabel}
            </Button>
          ) : null}
          <Button component="a" href={primaryHref} variant="filled" h={KUEC_TOUCH_TARGET_PX} className="kuec-action">
            {primaryLabel}
          </Button>
        </Group>
      </Group>
    </Stack>
  </Card>
);
