'use client';

import { type ReactNode } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

import { HowThisWorks, type HowThisWorksKeys } from './HowThisWorks';

type KuecPageHeaderProps = {
  title: string;
  description?: string;
  howThisWorks: HowThisWorksKeys;
  // At most one control, in the same position on every screen.
  action?: ReactNode;
};

// Page title at 24 px, one line of description, the info icon, one action.
export const KuecPageHeader = ({ title, description, howThisWorks, action }: KuecPageHeaderProps) => (
  <Group justify="space-between" align="flex-start" wrap="nowrap" mb="lg" gap="md">
    <Stack gap={4} style={{ minWidth: 0 }}>
      <Group gap={4} wrap="nowrap" align="center">
        <Title order={1}>{title}</Title>
        <HowThisWorks lineKeys={howThisWorks} />
      </Group>
      {description ? (
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      ) : null}
    </Stack>
    {action}
  </Group>
);
