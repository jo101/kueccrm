'use client';

import { type ReactNode } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

import { HowThisWorks, type HowThisWorksKeys } from './HowThisWorks';

export type KuecRecordFact = {
  label: string;
  value: ReactNode;
};

type KuecRecordHeaderProps = {
  eyebrow: string;
  title: string;
  facts: KuecRecordFact[];
  howThisWorks: HowThisWorksKeys;
  action?: ReactNode;
};

// The record header of the Lightning frame: object name, record name, the
// five key facts in one row, one action in the same position as every page.
export const KuecRecordHeader = ({ eyebrow, title, facts, howThisWorks, action }: KuecRecordHeaderProps) => (
  <Stack gap="md" component="header" mb="md">
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
      <Stack gap={2} style={{ minWidth: 0 }}>
        <Text size="xs" c="dimmed">
          {eyebrow}
        </Text>
        <Group gap={4} wrap="nowrap" align="center">
          <Title order={1} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            <bdi>{title}</bdi>
          </Title>
          <HowThisWorks lineKeys={howThisWorks} />
        </Group>
      </Stack>
      {action}
    </Group>
    <dl className="kuec-facts">
      {facts.map((fact) => (
        <div key={fact.label} className="kuec-fact">
          <dt>
            <Text size="xs" c="dimmed" component="span">
              {fact.label}
            </Text>
          </dt>
          <dd>
            <Text size="sm" fw={600} component="span" style={{ overflowWrap: 'anywhere' }}>
              {fact.value}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  </Stack>
);
