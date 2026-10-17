import { type CONTRACT_KIND } from 'src/objects/contract.object';

export type ContractRecordKind = (typeof CONTRACT_KIND)[keyof typeof CONTRACT_KIND];

export type ObjectNames = {
  singular: string;
  plural: string;
};

export const OBJECT_NAMES = {
  workPackage: { singular: 'workPackage', plural: 'workPackages' },
  opportunity: { singular: 'opportunity', plural: 'opportunities' },
  project: { singular: 'project', plural: 'projects' },
  milestone: { singular: 'milestone', plural: 'milestones' },
  engagement: { singular: 'engagement', plural: 'engagements' },
  company: { singular: 'company', plural: 'companies' },
  contract: { singular: 'contract', plural: 'contracts' },
  task: { singular: 'task', plural: 'tasks' },
  taskTarget: { singular: 'taskTarget', plural: 'taskTargets' },
  workspaceMember: { singular: 'workspaceMember', plural: 'workspaceMembers' },
  playbookRoleAssignment: {
    singular: 'playbookRoleAssignment',
    plural: 'playbookRoleAssignments',
  },
  publicHoliday: { singular: 'publicHoliday', plural: 'publicHolidays' },
  lead: { singular: 'lead', plural: 'leads' },
  document: { singular: 'document', plural: 'documents' },
  person: { singular: 'person', plural: 'people' },
  note: { singular: 'note', plural: 'notes' },
  noteTarget: { singular: 'noteTarget', plural: 'noteTargets' },
} as const satisfies Record<string, ObjectNames>;
