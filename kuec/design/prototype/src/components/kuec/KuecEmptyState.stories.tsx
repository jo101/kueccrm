import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KuecEmptyState } from './KuecEmptyState';

const meta: Meta<typeof KuecEmptyState> = {
  title: 'Patterns/KuecEmptyState',
  component: KuecEmptyState,
  args: { title: 'Nothing needs you right now.', nextStep: 'Log a call or a new lead so the next step is on record.', actionLabel: 'New lead', actionHref: '#' },
};
export default meta;

type Story = StoryObj<typeof KuecEmptyState>;

export const Default: Story = {};
export const WithoutAction: Story = { args: { actionLabel: undefined, actionHref: undefined } };
