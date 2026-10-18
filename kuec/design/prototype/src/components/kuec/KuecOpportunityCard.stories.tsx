import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KuecOpportunityCard } from './KuecOpportunityCard';

const meta: Meta<typeof KuecOpportunityCard> = {
  title: 'Patterns/KuecOpportunityCard',
  component: KuecOpportunityCard,
  args: {
    name: 'Corrosion sensor licence',
    account: 'Al Marzouqi Engineering',
    amount: 'AED 450,000',
    stageLabel: 'Negotiation',
    nextStep: 'Send revised term sheet after legal review',
    nextStepDue: 'Due Tue 20 Oct',
    nextStepTone: 'ok',
    actionLabel: 'Open',
    actionHref: '#',
  },
};
export default meta;

type Story = StoryObj<typeof KuecOpportunityCard>;

export const Default: Story = {};
export const NoNextStep: Story = { args: { nextStep: 'No Next Step', nextStepDue: 'No Next Step', nextStepTone: 'blocked', actionLabel: 'Set Next Step', primary: true } };
export const Late: Story = { args: { nextStep: 'Call Khalid about the quote', nextStepDue: 'Late since Thu 15 Oct', nextStepTone: 'blocked', owner: 'Mariam Al Hosani' } };
