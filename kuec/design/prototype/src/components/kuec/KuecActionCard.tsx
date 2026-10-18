'use client';

import { Button, Card, Group, Stack, Text } from '@mantine/core';

import type { KuecStatusTone } from '@/theme/kuec-tokens';

import { KuecStatus } from './KuecStatus';

export type KuecActionCardProps = {
  title: string;
  context: string;
  // Owner is shown only when it is not the viewer.
  owner?: string;
  due: string;
  statusTone: KuecStatusTone;
  statusLabel: string;
  actionLabel: string;
  actionHref: string;
  // Exactly one card on a screen carries the filled button: the one thing to do now.
  primary?: boolean;
};

// The one card template (brief part 6): title, context, meta (owner · due ·
// status), one button. 15 px title on Home, 13 px meta, 1 px border, no shadow.
export const KuecActionCard = ({ title, context, owner, due, statusTone, statusLabel, actionLabel, actionHref, primary = false }: KuecActionCardProps) => (
  <Card component="article" aria-label={title}>
    <Stack gap={8}>
      <Text fw={600} size="md" component="h3" style={{ margin: 0, lineHeight: 1.35 }}>
        <bdi>{title}</bdi>
      </Text>
      <Text size="sm" c="dimmed" lineClamp={2}>
        <bdi>{context}</bdi>
      </Text>
      <Group justify="space-between" align="center" wrap="wrap" gap={8} className="kuec-card-footer">
        <Group gap={8} wrap="wrap" align="center" style={{ minWidth: 0 }}>
          {owner ? (
            <>
              <Text size="xs" c="dimmed">
                <bdi>{owner}</bdi>
              </Text>
              <Text size="xs" c="dimmed" aria-hidden>
                ·
              </Text>
            </>
          ) : null}
          <Text size="xs" c="dimmed">
            {due}
          </Text>
          <Text size="xs" c="dimmed" aria-hidden>
            ·
          </Text>
          <KuecStatus tone={statusTone} label={statusLabel} size="xs" />
        </Group>
        <Button component="a" href={actionHref} variant={primary ? 'filled' : 'default'} className="kuec-action">
          {actionLabel}
        </Button>
      </Group>
    </Stack>
  </Card>
);
