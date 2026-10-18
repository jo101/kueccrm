import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '@mantine/core';

import { KuecStagePath } from './KuecStagePath';

const meta: Meta<typeof KuecStagePath> = { title: 'Patterns/KuecStagePath', component: KuecStagePath, args: { stage: 'MEETING', onMarkComplete: () => undefined, markCompletePrimary: true } };
export default meta;

type Story = StoryObj<typeof KuecStagePath>;

export const Default: Story = {};
export const EveryStage: Story = {
  render: () => (
    <Stack gap="md">
      <KuecStagePath stage="NEW" onMarkComplete={() => undefined} />
      <KuecStagePath stage="PROPOSAL" onMarkComplete={() => undefined} />
      <KuecStagePath stage="SIGNED" />
      <KuecStagePath stage="LOST" />
      <KuecStagePath stage="PARKED" />
    </Stack>
  ),
};
