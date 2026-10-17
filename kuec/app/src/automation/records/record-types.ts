import { type CreatedByActor } from 'src/automation/rules/default-owner.rule';
import { type TimerWorkPackage } from 'src/automation/timers/work-package-timers';
import { type ContractRecordKind } from 'src/automation/records/object-names';
import { type MilestoneStatus } from 'src/objects/milestone.object';
import { type PlaybookRole } from 'src/objects/playbook-role-assignment.object';
import {
  type ProjectHealth,
  type ProjectType,
} from 'src/objects/project.object';

export type WorkPackageRecord = TimerWorkPackage & {
  name: string | null;
  ownerId: string | null;
  reviewerId: string | null;
  opportunityId: string | null;
  projectId: string | null;
  milestoneId: string | null;
  dependsOnId: string | null;
  playbookStep: string | null;
  dueOffsetBusinessDays: number | null;
  blockedReason: string | null;
  acceptedAt: string | null;
  submittedAt: string | null;
  blockedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
};

export type OpportunityRecord = {
  id: string;
  name: string | null;
  stage: string;
  ownerId: string | null;
  companyId: string | null;
  playbookType: string | null;
  playbookApplied: boolean;
  nextAction: string | null;
  nextActionDate: string | null;
  nextActionFlaggedOn: string | null;
  stageEnteredAt: string | null;
  staleFrom: string | null;
  lostReason: string | null;
  clientDeadline: string | null;
  createdAt: string;
  createdBy: CreatedByActor | null;
  updatedAt: string;
};

export type ProjectRecord = {
  id: string;
  name: string | null;
  playbookType: ProjectType | null;
  status: string;
  health: ProjectHealth;
  percentComplete: number | null;
  eventDate: string | null;
  playbookApplied: boolean;
  ownerId: string | null;
  opportunityId: string | null;
  closeTaskCreatedAt: string | null;
};

export type MilestoneRecord = {
  id: string;
  name: string | null;
  status: MilestoneStatus;
  dueAt: string | null;
  projectId: string | null;
};

export type EngagementRecord = {
  id: string;
  name: string | null;
  date: string | null;
  nextStep: string | null;
  companyId: string | null;
  opportunityId: string | null;
};

export type CompanyRecord = {
  id: string;
  name: string | null;
  lastEngagementAt: string | null;
  engagementLapsesAt: string | null;
};

export type ContractRecord = {
  id: string;
  kind: ContractRecordKind | null;
  opportunityId: string | null;
};

export type WorkspaceMemberRecord = {
  id: string;
  name: { firstName: string | null; lastName: string | null } | null;
  userEmail: string | null;
};

export type PlaybookRoleAssignmentRecord = {
  id: string;
  playbookRole: PlaybookRole | null;
  memberId: string | null;
  isActive: boolean;
  createdAt: string;
};

export type PublicHolidayRecord = {
  id: string;
  date: string | null;
};

export type TaskRecord = {
  id: string;
};
