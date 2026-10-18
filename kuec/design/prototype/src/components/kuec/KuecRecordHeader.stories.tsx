import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KuecRecordHeader } from './KuecRecordHeader';

const meta: Meta<typeof KuecRecordHeader> = {
  title: 'Patterns/KuecRecordHeader',
  component: KuecRecordHeader,
  args: {
    eyebrow: 'Opportunity',
    title: 'Corrosion sensor licence',
    howThisWorks: ['opp.how.1', 'opp.how.2', 'opp.how.3', 'opp.how.4', 'opp.how.5'],
    facts: [
      { label: 'Account', value: 'Al Marzouqi Engineering' },
      { label: 'Amount', value: 'AED 450,000' },
      { label: 'Close Date', value: '15 Nov 2026' },
      { label: 'Stage', value: 'Negotiation' },
      { label: 'Owner', value: 'Mariam' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof KuecRecordHeader>;

export const Default: Story = {};
