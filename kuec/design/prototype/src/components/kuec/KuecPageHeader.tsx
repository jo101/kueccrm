'use client';

import { type ReactNode } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

import type { MessageKey } from '@/i18n/messages';

import { HowThisWorks } from './HowThisWorks';

type KuecPageHeaderProps = {
  title: string;
  description?: string;
  howThisWorks: [MessageKey, MessageKey, MessageKey, MessageKey, MessageKey];
  primaryAction?: ReactNode;
};

// Composes uVENTURE's PageHeader shape (title, description, one action) with
// the info icon that opens the five lines in the user's language only.
export const KuecPageHeader = ({ title, description, howThisWorks, primaryAction }: KuecPageHeaderProps) => (
  <Group justify="space-between" align="flex-start" wrap="nowrap" mb="lg">
    <Stack gap={4} style={{ minWidth: 0 }}>
      <Group gap="xs" wrap="nowrap" align="center">
        <Title order={2} style={{ lineHeight: 1.2 }}>
          {title}
        </Title>
        <HowThisWorks lineKeys={howThisWorks} />
      </Group>
      {description ? (
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      ) : null}
    </Stack>
    {primaryAction}
  </Group>
);
