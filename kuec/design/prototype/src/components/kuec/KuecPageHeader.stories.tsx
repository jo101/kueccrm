import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@mantine/core';

import { KuecPageHeader } from './KuecPageHeader';

const meta: Meta<typeof KuecPageHeader> = {
  title: 'Patterns/KuecPageHeader',
  component: KuecPageHeader,
  args: { title: 'Good morning, Mariam', description: 'What needs you today, and the one thing to do on each.', howThisWorks: ['home.how.1', 'home.how.2', 'home.how.3', 'home.how.4', 'home.how.5'] },
};
export default meta;

type Story = StoryObj<typeof KuecPageHeader>;

export const Default: Story = {};
export const WithAction: Story = { args: { action: <Button variant="default">New lead</Button> } };
