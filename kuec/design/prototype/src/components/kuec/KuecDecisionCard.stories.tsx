import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DECISIONS } from '@/data/seed';

import { KuecDecisionCard } from './KuecDecisionCard';

const meta: Meta<typeof KuecDecisionCard> = { title: 'Patterns/KuecDecisionCard', component: KuecDecisionCard, args: { decision: DECISIONS[0], primary: true }, parameters: { viewerId: 'ed' } };
export default meta;

type Story = StoryObj<typeof KuecDecisionCard>;

export const Routine: Story = {};
export const Commercial: Story = { args: { decision: DECISIONS[1], primary: false } };
