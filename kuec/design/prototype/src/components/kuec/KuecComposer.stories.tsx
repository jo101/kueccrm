import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CONTACTS } from '@/data/seed';

import { KuecComposer } from './KuecComposer';

const meta: Meta<typeof KuecComposer> = { title: 'Patterns/KuecComposer', component: KuecComposer, args: { opportunityId: 'opp-marzouqi', contacts: CONTACTS.filter((contact) => contact.accountId === 'acc-marzouqi'), onNewTask: () => undefined } };
export default meta;

type Story = StoryObj<typeof KuecComposer>;

export const Default: Story = {};
