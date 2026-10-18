'use client';

import { type ReactNode } from 'react';
import { Anchor, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export type KuecContextSection = {
  title: string;
  // One-sentence tooltip behind an info icon beside the title.
  info?: string;
  count?: number;
  linkLabel?: string;
  linkHref?: string;
  content: ReactNode;
};

type KuecContextPanelProps = {
  sections: KuecContextSection[];
};

// The 280 px right rail of the record template: Next Step first, then key
// contacts and documents. Each section is a quiet card with a 14 px title.
export const KuecContextPanel = ({ sections }: KuecContextPanelProps) => (
  <Stack gap="md" component="aside" className="kuec-rail">
    {sections.map((section) => (
      <Card key={section.title} component="section" aria-label={section.title}>
        <Stack gap={8}>
          <Group justify="space-between" align="baseline" wrap="nowrap">
            <Group gap={6} align="baseline" wrap="nowrap">
              <Text fw={600} size="sm" component="h2" style={{ margin: 0 }}>
                {section.title}
              </Text>
              {section.count !== undefined ? (
                <Text size="xs" c="dimmed" fw={600}>
                  {section.count}
                </Text>
              ) : null}
              {section.info ? (
                <Tooltip label={section.info} multiline w={256} events={{ hover: true, focus: true, touch: true }}>
                  <span role="img" aria-label={section.info} tabIndex={0} style={{ display: 'inline-flex', color: 'var(--uv-accent-icon-color)' }}>
                    <IconInfoCircle size={14} aria-hidden />
                  </span>
                </Tooltip>
              ) : null}
            </Group>
            {section.linkHref && section.linkLabel ? (
              <Anchor href={section.linkHref} size="xs" fw={600} target="_blank" rel="noreferrer">
                {section.linkLabel}
              </Anchor>
            ) : null}
          </Group>
          {section.content}
        </Stack>
      </Card>
    ))}
  </Stack>
);
