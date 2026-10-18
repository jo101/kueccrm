import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '@mantine/core';

import { KuecActionCard } from './KuecActionCard';

const meta: Meta<typeof KuecActionCard> = {
  title: 'Patterns/KuecActionCard',
  component: KuecActionCard,
  args: {
    title: 'Prepare the term sheet for Al Marzouqi',
    context: 'Part of Corrosion sensor licence · Al Marzouqi Engineering',
    due: 'Due in 4 days',
    statusTone: 'attention',
    statusLabel: 'Assigned',
    actionLabel: 'Accept',
    actionHref: '#',
    primary: true,
  },
};
export default meta;

type Story = StoryObj<typeof KuecActionCard>;

export const Primary: Story = {};
export const Secondary: Story = { args: { primary: false, actionLabel: 'Open', statusTone: 'ok', statusLabel: 'In Progress' } };
export const WithOwner: Story = { args: { primary: false, owner: 'Omar Haddad', statusTone: 'blocked', statusLabel: 'Blocked', actionLabel: 'Reassign', due: 'Late since Wed 14 Oct' } };
export const Stacked: Story = {
  render: (args) => (
    <Stack gap="sm">
      <KuecActionCard {...args} />
      <KuecActionCard {...args} primary={false} title="Scope the membrane pilot with Dana Water" statusTone="ok" statusLabel="In Progress" actionLabel="Open" />
      <KuecActionCard {...args} primary={false} owner="Rohan Pillai" title="Price the fatigue testing quote" statusTone="attention" statusLabel="Pending Review" actionLabel="Review" />
    </Stack>
  ),
};
