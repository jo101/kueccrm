import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TASKS } from '@/data/seed';

import { KuecTaskCard } from './KuecTaskCard';

const byId = (id: string) => TASKS.find((task) => task.id === id)!;

const meta: Meta<typeof KuecTaskCard> = { title: 'Patterns/KuecTaskCard', component: KuecTaskCard, args: { task: byId('task-term-sheet'), fromNotification: true }, parameters: { viewerId: 'bd1' } };
export default meta;

type Story = StoryObj<typeof KuecTaskCard>;

export const AssignedToMe: Story = {};
export const InProgress: Story = { args: { task: byId('task-membrane-scope'), fromNotification: false } };
export const PendingReviewAsReviewer: Story = { args: { task: byId('task-fatigue-quote'), fromNotification: false } };
export const Blocked: Story = { args: { task: byId('task-falcon-handover'), fromNotification: false }, parameters: { viewerId: 'bd2' } };
export const BlockedAsEd: Story = { args: { task: byId('task-falcon-handover'), fromNotification: false }, parameters: { viewerId: 'ed' } };
export const Completed: Story = { args: { task: byId('task-nda-dana'), fromNotification: false } };
export const SomeoneElses: Story = { args: { task: byId('task-workshop-brief'), fromNotification: false } };
