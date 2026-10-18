'use client';

import { Anchor, Group, Text, Title } from '@mantine/core';

type KuecSectionHeaderProps = {
  title: string;
  count?: number;
  listLabel?: string;
  listHref?: string;
};

// Section title at 20 px with its count; the list is one tap away.
export const KuecSectionHeader = ({ title, count, listLabel, listHref }: KuecSectionHeaderProps) => (
  <Group justify="space-between" align="baseline" mt={32} mb="sm" wrap="nowrap">
    <Group gap="xs" align="baseline" wrap="nowrap">
      <Title order={2}>{title}</Title>
      {count !== undefined ? (
        <Text c="dimmed" size="sm" fw={600} aria-label={`${count}`}>
          {count}
        </Text>
      ) : null}
    </Group>
    {listHref && listLabel ? (
      <Anchor href={listHref} size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
        {listLabel}
      </Anchor>
    ) : null}
  </Group>
);
