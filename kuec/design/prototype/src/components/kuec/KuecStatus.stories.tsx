import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Group, Stack } from '@mantine/core';

import { KuecStatus } from './KuecStatus';

const meta: Meta<typeof KuecStatus> = { title: 'Patterns/KuecStatus', component: KuecStatus, args: { tone: 'ok', label: 'In Progress' } };
export default meta;

type Story = StoryObj<typeof KuecStatus>;

export const Default: Story = {};

// The whole status map on one screen: ok, attention, blocked, neutral.
export const AllTones: Story = {
  render: () => (
    <Stack gap="sm">
      <Group gap="lg">
        <KuecStatus tone="ok" label="In Progress" />
        <KuecStatus tone="attention" label="Assigned" />
        <KuecStatus tone="blocked" label="Blocked" />
        <KuecStatus tone="neutral" label="Completed" />
      </Group>
      <Group gap="lg">
        <KuecStatus tone="ok" label="قيد التنفيذ" size="xs" />
        <KuecStatus tone="attention" label="مُسنَدة" size="xs" />
        <KuecStatus tone="blocked" label="متوقفة" size="xs" />
        <KuecStatus tone="neutral" label="مكتملة" size="xs" />
      </Group>
    </Stack>
  ),
};
