import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KuecMetricStrip } from './KuecMetricStrip';

const meta: Meta<typeof KuecMetricStrip> = {
  title: 'Patterns/KuecMetricStrip',
  component: KuecMetricStrip,
  args: {
    scopeLabel: 'Mine',
    metrics: [
      { label: 'Closed this quarter', value: 'AED 0', detail: 'of AED 625K target', ratio: 0, href: '#' },
      { label: 'Open pipeline', value: 'AED 725K', detail: '3 opportunities', href: '#' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof KuecMetricStrip>;

export const Default: Story = {};
export const Team: Story = { args: { scopeLabel: 'Team', metrics: [{ label: 'Closed this quarter', value: 'AED 1.2M', detail: 'of AED 2.5M target', ratio: 0.48, href: '#' }, { label: 'Open pipeline', value: 'AED 765K', detail: '4 opportunities', href: '#' }] } };
