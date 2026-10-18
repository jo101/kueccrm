import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { Task } from '@/data/model';
import { TASKS, WORKBENCH_NOW_ISO } from '@/data/seed';
import { getTaskTone } from '@/store/rules';

import { KuecListView } from './KuecListView';
import { KuecStatus } from './KuecStatus';

const meta: Meta<typeof KuecListView<Task>> = {
  title: 'Patterns/KuecListView',
  component: KuecListView<Task>,
  args: {
    ariaLabel: 'Tasks',
    records: TASKS,
    columns: [
      { accessor: 'title', title: 'Title', render: (task: Task) => task.title.en },
      { accessor: 'status', title: 'Status', width: 160, render: (task: Task) => <KuecStatus tone={getTaskTone(task, WORKBENCH_NOW_ISO)} label={task.status} size="xs" /> },
      { accessor: 'dueAt', title: 'Due', width: 140, render: (task: Task) => task.dueAt.slice(0, 10) },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof KuecListView<Task>>;

export const Default: Story = {};
export const Empty: Story = { args: { records: [] } };
