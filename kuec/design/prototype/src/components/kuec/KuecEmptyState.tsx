'use client';

import { Button, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

type KuecEmptyStateProps = {
  title: string;
  nextStep: string;
  actionLabel?: string;
  actionHref?: string;
};

// Same shape as uVENTURE's EmptyState: icon, title, one sentence, one action.
// The sentence always teaches the next step.
export const KuecEmptyState = ({ title, nextStep, actionLabel, actionHref }: KuecEmptyStateProps) => (
  <Stack align="center" gap="sm" py="xl" px="md" style={{ textAlign: 'center', border: '1px dashed var(--uv-surface-neutral-border)', borderRadius: 'var(--mantine-radius-md)' }}>
    <ThemeIcon variant="light" color="success" size={44} radius="xl">
      <IconCircleCheck size={24} />
    </ThemeIcon>
    <Text fw={600}>{title}</Text>
    <Text c="dimmed" size="sm" maw={420}>
      {nextStep}
    </Text>
    {actionLabel && actionHref ? (
      <Button component="a" href={actionHref} variant="default">
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);
