import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PERSONAS } from '@/data/seed';

import { KuecPersonPicker } from './KuecPersonPicker';

const meta: Meta<typeof KuecPersonPicker> = { title: 'Patterns/KuecPersonPicker', component: KuecPersonPicker, args: { label: 'Give this task to', people: PERSONAS, value: 'ops', onChange: () => undefined } };
export default meta;

type Story = StoryObj<typeof KuecPersonPicker>;

const Demo = () => {
  const [value, setValue] = useState<string | null>('ops');

  return <KuecPersonPicker label="Give this task to" people={PERSONAS} value={value} onChange={setValue} excludeIds={['bd1']} />;
};

export const Default: Story = { render: () => <Demo /> };
