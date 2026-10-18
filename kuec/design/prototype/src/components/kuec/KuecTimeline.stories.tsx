import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ACTIVITIES } from '@/data/seed';

import { KuecTimeline } from './KuecTimeline';

const meta: Meta<typeof KuecTimeline> = { title: 'Patterns/KuecTimeline', component: KuecTimeline, args: { activities: ACTIVITIES.filter((activity) => activity.opportunityId === 'opp-marzouqi') } };
export default meta;

type Story = StoryObj<typeof KuecTimeline>;

export const Default: Story = {};
export const Empty: Story = { args: { activities: [] } };
