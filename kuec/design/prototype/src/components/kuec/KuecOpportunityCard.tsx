'use client';

import { Button, Card, Group, Stack, Text } from '@mantine/core';

import type { KuecStatusTone } from '@/theme/kuec-tokens';

import { KuecStatus } from './KuecStatus';

export type KuecOpportunityCardProps = {
  name: string;
  account: string;
  amount: string;
  stageLabel: string;
  nextStep: string;
  nextStepDue: string;
  nextStepTone: KuecStatusTone;
  owner?: string;
  actionLabel: string;
  actionHref: string;
  primary?: boolean;
};

// Same card template, read for an opportunity: the Next Step is the context
// line, because it is the one fact the owner must keep current.
export const KuecOpportunityCard = ({ name, account, amount, stageLabel, nextStep, nextStepDue, nextStepTone, owner, actionLabel, actionHref, primary = false }: KuecOpportunityCardProps) => (
  <Card component="article" aria-label={name}>
    <Stack gap={8}>
      <Group justify="space-between" align="baseline" wrap="nowrap" gap="md">
        <Text fw={600} size="md" component="h3" style={{ margin: 0, lineHeight: 1.35, minWidth: 0 }}>
          <bdi>{name}</bdi>
          <Text component="span" c="dimmed" fw={400} size="sm">
            {' '}
            · <bdi>{account}</bdi>
          </Text>
        </Text>
        <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
          {amount}
        </Text>
      </Group>
      <Text size="sm" c={nextStepTone === 'blocked' ? undefined : 'dimmed'} lineClamp={2}>
        <bdi>{nextStep}</bdi>
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
            {stageLabel}
          </Text>
          <Text size="xs" c="dimmed" aria-hidden>
            ·
          </Text>
          <KuecStatus tone={nextStepTone} label={nextStepDue} size="xs" />
        </Group>
        <Button component="a" href={actionHref} variant={primary ? 'filled' : 'default'} className="kuec-action">
          {actionLabel}
        </Button>
      </Group>
    </Stack>
  </Card>
);
