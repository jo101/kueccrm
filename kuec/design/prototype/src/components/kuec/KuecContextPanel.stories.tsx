import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '@mantine/core';

import { OPPORTUNITIES } from '@/data/seed';

import { KuecContextPanel } from './KuecContextPanel';
import { KuecNextStep } from './KuecNextStep';

const meta: Meta<typeof KuecContextPanel> = {
  title: 'Patterns/KuecContextPanel',
  component: KuecContextPanel,
  args: {
    sections: [
      { title: 'Next Step', content: <KuecNextStep opportunity={OPPORTUNITIES[0]} canEdit /> },
      { title: 'Key contacts', count: 2, content: <Text size="sm">Eng. Khalifa Al Marzouqi · Decision maker</Text> },
      { title: 'Documents', count: 1, linkLabel: 'Open in SharePoint', linkHref: '#', content: <Text size="sm">Term sheet v2 (draft)</Text> },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof KuecContextPanel>;

export const Default: Story = { render: (args) => <div style={{ maxWidth: 280 }}><KuecContextPanel {...args} /></div> };
