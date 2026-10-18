import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KuecSectionHeader } from './KuecSectionHeader';

const meta: Meta<typeof KuecSectionHeader> = { title: 'Patterns/KuecSectionHeader', component: KuecSectionHeader, args: { title: 'Needs your attention', count: 3, listLabel: 'Open list', listHref: '#' } };
export default meta;

type Story = StoryObj<typeof KuecSectionHeader>;

export const Default: Story = {};
export const WithoutList: Story = { args: { listHref: undefined, listLabel: undefined } };
