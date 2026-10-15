import { isDefined } from 'twenty-sdk/utils';

import {
  createRecord,
  listRecords,
  quoteFilterValues,
  updateRecord,
  type TwentyApi,
} from 'src/automation/api/twenty-api';
import { type AutomationContext } from 'src/automation/api/load-automation-context';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import {
  planCaseWorkPackages,
  type DueAnchors,
  type PlannedWorkPackage,
} from 'src/automation/playbooks/plan-case-work-packages';
import { type CaseTemplate } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type MilestoneRecord,
  type WorkPackageRecord,
} from 'src/automation/records/record-types';
import {
  publishWorkPackageTransition,
  WORK_PACKAGE_TRANSITION,
} from 'src/automation/timeline/publish-work-package-transition';
import { scheduleWorkPackageTimers } from 'src/automation/timers/schedule-work-package-timers';
import { STATUSES_WITH_DUE_TIMER } from 'src/automation/timers/work-package-timers';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

export type CaseReference =
  | { kind: 'opportunity'; id: string }
  | { kind: 'project'; id: string };

const caseForeignKey = (caseReference: CaseReference) =>
  caseReference.kind === 'opportunity'
    ? { opportunityId: caseReference.id }
    : { projectId: caseReference.id };

const countOpenWorkPackagesByMember = async (
  api: TwentyApi,
  context: AutomationContext,
): Promise<Record<string, number>> => {
  const candidateIds = [
    ...new Set(Object.values(context.membersByRole).flat()),
  ];

  if (candidateIds.length === 0) {
    return {};
  }

  const openWorkPackages = await listRecords<WorkPackageRecord>(
    api.asApplication,
    OBJECT_NAMES.workPackage,
    `and(ownerId[in]:${quoteFilterValues(candidateIds)},status[in]:${quoteFilterValues([WORK_PACKAGE_STATUS.PLANNED, ...STATUSES_WITH_DUE_TIMER])})`,
  );

  return openWorkPackages.reduce<Record<string, number>>(
    (counts, { ownerId }) =>
      isDefined(ownerId)
        ? { ...counts, [ownerId]: (counts[ownerId] ?? 0) + 1 }
        : counts,
    {},
  );
};

// A retried run finds what the previous attempt created by playbook step (or,
// if it stopped before stamping the step, by title) and creates only the rest.
const findExisting = <TRecord extends { name: string | null; playbookStep: string | null }>(
  existing: TRecord[],
  playbookStep: string,
  name: string,
): TRecord | undefined =>
  existing.find((record) => record.playbookStep === playbookStep) ??
  existing.find(
    (record) => !isDefined(record.playbookStep) && record.name === name,
  );

export const instantiateCase = async ({
  api,
  context,
  caseReference,
  caseName,
  caseTemplate,
  anchors,
  caseOwnerMemberId,
  now,
}: {
  api: TwentyApi;
  context: AutomationContext;
  caseReference: CaseReference;
  caseName: string;
  caseTemplate: CaseTemplate;
  anchors: DueAnchors;
  caseOwnerMemberId: string | null;
  now: Date;
}): Promise<{ workPackages: WorkPackageRecord[]; firstPlanned: PlannedWorkPackage | null }> => {
  const plan = planCaseWorkPackages({
    caseTemplate,
    openedAt: now,
    holidays: context.holidays,
    anchors,
    caseOwnerMemberId,
    opsCoordinatorMemberId: context.opsCoordinatorMemberId,
    membersByRole: context.membersByRole,
    openWorkPackageCountByMember: await countOpenWorkPackagesByMember(
      api,
      context,
    ),
  });

  const caseFilter =
    caseReference.kind === 'opportunity'
      ? `opportunityId[eq]:"${caseReference.id}"`
      : `projectId[eq]:"${caseReference.id}"`;

  const existingMilestones =
    caseReference.kind === 'project'
      ? await listRecords<MilestoneRecord & { playbookStep: string | null }>(
          api.asApplication,
          OBJECT_NAMES.milestone,
          caseFilter,
        )
      : [];
  const milestoneIdByKey = new Map<string, string>();

  for (const plannedMilestone of plan.milestones) {
    const milestone =
      findExisting(existingMilestones, plannedMilestone.playbookStep, plannedMilestone.name) ??
      (await createRecord<MilestoneRecord>(api.asPerson, OBJECT_NAMES.milestone, {
        name: plannedMilestone.name,
        dueAt: plannedMilestone.dueAt,
        ...caseForeignKey(caseReference),
      }));

    await updateRecord(api.asApplication, OBJECT_NAMES.milestone, milestone.id, {
      playbookStep: plannedMilestone.playbookStep,
    });
    milestoneIdByKey.set(plannedMilestone.key, milestone.id);
  }

  const existingWorkPackages = await listRecords<WorkPackageRecord>(
    api.asApplication,
    OBJECT_NAMES.workPackage,
    caseFilter,
  );
  const workPackageIdByKey = new Map<string, string>();
  const createdWorkPackages: WorkPackageRecord[] = [];

  for (const planned of plan.workPackages) {
    const existing = findExisting(
      existingWorkPackages,
      planned.playbookStep,
      planned.name,
    );
    const workPackage =
      existing ??
      (await createRecord<WorkPackageRecord>(api.asPerson, OBJECT_NAMES.workPackage, {
        name: planned.name,
        objective: planned.objective,
        expectedOutput: planned.expectedOutput,
        doneCriteria: planned.doneCriteria,
        status: planned.status,
        dueAt: planned.dueAt,
        ownerId: planned.ownerMemberId,
        reviewerId: planned.reviewerMemberId,
        dependsOnId: isDefined(planned.dependsOnKey)
          ? (workPackageIdByKey.get(planned.dependsOnKey) ?? null)
          : null,
        milestoneId: isDefined(planned.milestoneKey)
          ? (milestoneIdByKey.get(planned.milestoneKey) ?? null)
          : null,
        ...caseForeignKey(caseReference),
      }));

    const systemFields = {
      playbookStep: planned.playbookStep,
      dueOffsetBusinessDays: planned.dueOffsetBusinessDays,
      offeredAt: existing?.offeredAt ?? planned.offeredAt,
    };

    await updateRecord(
      api.asApplication,
      OBJECT_NAMES.workPackage,
      workPackage.id,
      systemFields,
    );
    workPackageIdByKey.set(planned.key, workPackage.id);
    createdWorkPackages.push({ ...workPackage, ...systemFields });
  }

  // Created records emit no .updated event, so the offered step's timers,
  // timeline row and notification start here.
  for (const workPackage of createdWorkPackages) {
    if (workPackage.status !== WORK_PACKAGE_STATUS.OFFERED) {
      continue;
    }

    await scheduleWorkPackageTimers({
      workPackage,
      holidays: context.holidays,
      now,
    });
    await publishWorkPackageTransition({
      workPackage,
      transition: WORK_PACKAGE_TRANSITION.OFFERED,
      happenedAt: workPackage.offeredAt ?? now.toISOString(),
    });

    const target = {
      objectNameSingular: OBJECT_NAMES.workPackage.singular,
      recordId: workPackage.id,
    };

    await notifyMembers({
      api,
      memberIds: [workPackage.ownerId],
      message: NOTIFICATION_MESSAGES.workPackageOffered({
        subject: `${workPackage.name ?? ''} (${caseName})`,
        link: recordLinkFor(target),
      }),
      taskTitle: `Accept or decline: ${workPackage.name ?? ''}`,
      target,
      dedupeKey: `offered:${workPackage.id}:${Date.parse(workPackage.offeredAt ?? now.toISOString())}`,
      now,
    });
  }

  return {
    workPackages: createdWorkPackages,
    firstPlanned: plan.workPackages[0] ?? null,
  };
};
