'use client';

import { Card, Group, Progress, Stack, Text } from '@mantine/core';

export type KuecMetric = {
  label: string;
  value: string;
  detail: string;
  // 0 to 1; shown as a thin neutral bar with the accent fill.
  ratio?: number;
  href?: string;
};

type KuecMetricStripProps = {
  metrics: KuecMetric[];
  scopeLabel?: string;
};

// One compact performance strip on Home: closed this quarter against target
// and open pipeline. Numbers at 20 px, labels at 13 px; the only colour is
// the accent fill of the progress bar.
export const KuecMetricStrip = ({ metrics, scopeLabel }: KuecMetricStripProps) => (
  <Card component="section" aria-label={scopeLabel} padding={16}>
    <Group gap={0} wrap="wrap" align="stretch" style={{ rowGap: 16 }}>
      {metrics.map((metric, index) => (
        <Stack
          key={metric.label}
          gap={4}
          component={metric.href ? 'a' : 'div'}
          {...(metric.href ? { href: metric.href } : {})}
          style={{
            flex: '1 1 180px',
            minWidth: 0,
            paddingInlineStart: index === 0 ? 0 : 16,
            borderInlineStart: index === 0 ? undefined : '1px solid var(--uv-surface-neutral-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Text size="xs" c="dimmed">
            {metric.label}
            {scopeLabel && index === 0 ? ` · ${scopeLabel}` : ''}
          </Text>
          <Text size="lg" fw={600} style={{ lineHeight: 1.2 }}>
            {metric.value}
          </Text>
          <Text size="xs" c="dimmed">
            {metric.detail}
          </Text>
          {metric.ratio !== undefined ? <Progress value={Math.round(metric.ratio * 100)} size={4} radius="xl" aria-label={metric.detail} mt={4} /> : null}
        </Stack>
      ))}
    </Group>
  </Card>
);
