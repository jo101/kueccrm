import { create, list, remove, update } from 'src/__tests__/utils/test-api';
import { type PlaybookRole } from 'src/objects/playbook-role-assignment.object';

export type IdRecord = { id: string };

export type WorkPackage = IdRecord & {
  name: string;
  status: string;
  ownerId: string | null;
  reviewerId: string | null;
  dueAt: string | null;
  offeredAt: string | null;
  acceptedAt: string | null;
  blockedAt: string | null;
  blockedReason: string | null;
  playbookStep: string | null;
  dependsOnId: string | null;
  acceptReminderSentAt: string | null;
  reassignedAt: string | null;
  overdueOwnerNotifiedAt: string | null;
  overdueEdNotifiedAt: string | null;
  createdAt: string;
};

export type Opportunity = IdRecord & {
  name: string;
  playbookApplied: boolean;
  playbookType: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  nextActionFlaggedOn: string | null;
};

export type Task = IdRecord & {
  title: string;
  assigneeId: string | null;
  createdAt: string;
  bodyV2: { markdown: string | null } | null;
};

export type TrackedRecord = { namePlural: string; id: string };

export const createTracker = () => {
  const records: TrackedRecord[] = [];

  return {
    track: <TRecord extends IdRecord>(namePlural: string, record: TRecord) => {
      records.push({ namePlural, id: record.id });

      return record;
    },
    removeAll: async () => {
      for (const { namePlural, id } of [...records].reverse()) {
        await remove(namePlural, id);
      }
    },
  };
};

export const tasksTitledSince = async (title: string, since: string) =>
  (
    await list<Task>(
      'tasks',
      `and(title[eq]:"${title}",createdAt[gte]:"${since}")`,
    )
  ).filter(({ title: taskTitle }) => taskTitle === title);

type PlaybookRoleAssignment = IdRecord & {
  playbookRole: string;
  memberId: string;
  isActive: boolean;
};

// The ED and ops coordinator are the first active assignment of their role,
// so assignments left by other runs are parked for the duration of a spec.
export const assignPlaybookRoles = async (
  runTag: string,
  roleMembers: Partial<Record<PlaybookRole, string>>,
) => {
  const parked = await list<PlaybookRoleAssignment>(
    'playbookRoleAssignments',
    'isActive[eq]:true',
  );

  for (const assignment of parked) {
    await update('playbookRoleAssignments', assignment.id, { isActive: false });
  }

  const created: string[] = [];

  for (const [playbookRole, memberId] of Object.entries(roleMembers)) {
    const assignment = await create<IdRecord>(
      'playbookRoleAssignments',
      'playbookRoleAssignment',
      { name: `${runTag} ${playbookRole}`, playbookRole, memberId, isActive: true },
    );

    created.push(assignment.id);
  }

  return async () => {
    for (const id of created) {
      await remove('playbookRoleAssignments', id);
    }

    for (const assignment of parked) {
      await update('playbookRoleAssignments', assignment.id, { isActive: true });
    }
  };
};

export const listMemberIds = async (): Promise<string[]> =>
  (await list<IdRecord & { createdAt: string }>('workspaceMembers', 'id[is]:NOT_NULL'))
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
    .map(({ id }) => id);

export const secondsBetween = (from: string | null, to: string | null) =>
  (Date.parse(to ?? '') - Date.parse(from ?? '')) / 1000;
