import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Text } from '@mantine/core';

import { KuecDrawer } from './KuecDrawer';

const meta: Meta<typeof KuecDrawer> = { title: 'Patterns/KuecDrawer', component: KuecDrawer, args: { title: 'New task', opened: false, onClose: () => undefined } };
export default meta;

type Story = StoryObj<typeof KuecDrawer>;

const Demo = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setOpened(true)}>
        Open drawer
      </Button>
      <KuecDrawer opened={opened} onClose={() => setOpened(false)} title="New task">
        <Text size="sm">The drawer opens from the end side and mirrors in RTL.</Text>
      </KuecDrawer>
    </>
  );
};

export const Default: Story = { render: () => <Demo /> };
