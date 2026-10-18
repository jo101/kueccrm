import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OPPORTUNITIES } from '@/data/seed';

import { KuecNextStep } from './KuecNextStep';

const meta: Meta<typeof KuecNextStep> = { title: 'Patterns/KuecNextStep', component: KuecNextStep, args: { opportunity: OPPORTUNITIES[0], canEdit: true } };
export default meta;

type Story = StoryObj<typeof KuecNextStep>;

export const Current: Story = {};
export const Missing: Story = { args: { opportunity: OPPORTUNITIES[2], primary: true } };
export const Late: Story = { args: { opportunity: OPPORTUNITIES[1], primary: true } };
export const ReadOnly: Story = { args: { canEdit: false } };
