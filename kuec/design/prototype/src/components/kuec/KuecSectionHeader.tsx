'use client';

import { Anchor, Group, Text, Title } from '@mantine/core';

type KuecSectionHeaderProps = {
  title: string;
  count?: number;
  listLabel?: string;
  listHref?: string;
};

export const KuecSectionHeader = ({ title, count, listLabel, listHref }: KuecSectionHeaderProps) => (
  <Group justify="space-between" align="baseline" mt="xl" mb="sm">
    <Group gap="xs" align="baseline">
      <Title order={4}>{title}</Title>
      {count !== undefined ? (
        <Text c="dimmed" size="sm">
          {count}
        </Text>
      ) : null}
    </Group>
    {listHref && listLabel ? (
      <Anchor href={listHref} size="sm">
        {listLabel}
      </Anchor>
    ) : null}
  </Group>
);
