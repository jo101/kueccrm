'use client';

import { Button, Stack, Text } from '@mantine/core';

type KuecEmptyStateProps = {
  title: string;
  nextStep: string;
  actionLabel?: string;
  actionHref?: string;
};

// One sentence that teaches the next step, one button, nothing decorative.
export const KuecEmptyState = ({ title, nextStep, actionLabel, actionHref }: KuecEmptyStateProps) => (
  <Stack
    align="center"
    gap="sm"
    py={32}
    px="md"
    role="status"
    style={{ textAlign: 'center', border: '1px dashed var(--uv-surface-neutral-border)', borderRadius: 12 }}
  >
    <Text fw={600} size="md">
      {title}
    </Text>
    <Text c="dimmed" size="sm" maw={420}>
      {nextStep}
    </Text>
    {actionLabel && actionHref ? (
      <Button component="a" href={actionHref} variant="default" className="kuec-action">
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);
