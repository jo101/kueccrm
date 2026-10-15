import { isDefined } from 'twenty-sdk/utils';

import {
  addBusinessDaysToDate,
  dueAtAfterBusinessDays,
  dueAtOnDate,
  type HolidaySet,
} from 'src/automation/dates/business-days';
import {
  type CaseTemplate,
  type DueAnchorKey,
  type WorkPackageTemplate,
} from 'src/automation/playbooks/playbook-templates';
import { type PlaybookRole } from 'src/objects/playbook-role-assignment.object';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

export type DueAnchors = Partial<Record<DueAnchorKey, string>>;

export type PlannedWorkPackage = {
  key: string;
  playbookStep: string;
  name: string;
  objective: string;
  expectedOutput: string;
  doneCriteria: string;
  status: WorkPackageStatus;
  ownerMemberId: string | null;
  reviewerMemberId: string | null;
  dueAt: string | null;
  dueOffsetBusinessDays: number | null;
  dependsOnKey: string | null;
  offeredAt: string | null;
  milestoneKey: string | null;
};

export type PlannedMilestone = {
  key: string;
  name: string;
  playbookStep: string;
  dueAt: string | null;
};

export type PlanCaseInput = {
  caseTemplate: CaseTemplate;
  openedAt: Date;
  holidays: HolidaySet;
  anchors: DueAnchors;
  caseOwnerMemberId: string | null;
  opsCoordinatorMemberId: string | null;
  membersByRole: Partial<Record<PlaybookRole, string[]>>;
  openWorkPackageCountByMember: Record<string, number>;
};

export const computeWorkPackageDueAt = ({
  workPackageTemplate,
  start,
  anchors,
  holidays,
}: {
  workPackageTemplate: WorkPackageTemplate;
  start: Date;
  anchors: DueAnchors;
  holidays: HolidaySet;
}): Date | null => {
  const { dueAnchor, dueCap, dueOffsetDays } = workPackageTemplate;
  let dueAt: Date | null = null;

  if (isDefined(dueAnchor)) {
    const anchorDate = anchors[dueAnchor.anchor];

    dueAt = isDefined(anchorDate)
      ? dueAtOnDate(
          addBusinessDaysToDate(
            anchorDate,
            dueAnchor.businessDaysAfter,
            holidays,
          ),
        )
      : null;
  } else if (isDefined(dueOffsetDays)) {
    dueAt = dueAtAfterBusinessDays(start, dueOffsetDays, holidays);
  }

  const capAnchorDate = isDefined(dueCap) ? anchors[dueCap.anchor] : undefined;

  if (isDefined(dueAt) && isDefined(dueCap) && isDefined(capAnchorDate)) {
    const cap = dueAtOnDate(
      addBusinessDaysToDate(capAnchorDate, -dueCap.businessDaysBefore, holidays),
    );

    return cap < dueAt ? cap : dueAt;
  }

  return dueAt;
};

const createMemberPicker = ({
  caseTemplate,
  caseOwnerMemberId,
  opsCoordinatorMemberId,
  membersByRole,
  openWorkPackageCountByMember,
}: PlanCaseInput) => {
  const loadByMember = { ...openWorkPackageCountByMember };

  return (role: PlaybookRole | null, countsAsLoad: boolean): string | null => {
    if (!isDefined(role)) {
      return null;
    }

    if (role === caseTemplate.caseOwnerRole && isDefined(caseOwnerMemberId)) {
      if (countsAsLoad) {
        loadByMember[caseOwnerMemberId] =
          (loadByMember[caseOwnerMemberId] ?? 0) + 1;
      }

      return caseOwnerMemberId;
    }

    const candidates = membersByRole[role] ?? [];

    if (candidates.length === 0) {
      return opsCoordinatorMemberId ?? caseOwnerMemberId;
    }

    // Ties go to the first candidate, so the same state always plans the same way.
    const leastLoaded = candidates.reduce((best, candidate) =>
      (loadByMember[candidate] ?? 0) < (loadByMember[best] ?? 0)
        ? candidate
        : best,
    );

    if (countsAsLoad) {
      loadByMember[leastLoaded] = (loadByMember[leastLoaded] ?? 0) + 1;
    }

    return leastLoaded;
  };
};

export const planCaseWorkPackages = (
  input: PlanCaseInput,
): { workPackages: PlannedWorkPackage[]; milestones: PlannedMilestone[] } => {
  const { caseTemplate, openedAt, holidays, anchors } = input;
  const pickMember = createMemberPicker(input);
  const milestoneIndexes = caseTemplate.milestones.map((milestone) =>
    caseTemplate.workPackages.findIndex(
      ({ key }) => key === milestone.closedByWorkPackage,
    ),
  );

  let cursor = openedAt;

  const workPackages = caseTemplate.workPackages.map(
    (workPackageTemplate, index): PlannedWorkPackage => {
      const dueAt = computeWorkPackageDueAt({
        workPackageTemplate,
        start: cursor,
        anchors,
        holidays,
      });

      cursor = dueAt ?? cursor;

      const previous = index > 0 ? caseTemplate.workPackages[index - 1] : null;
      const milestonePosition = milestoneIndexes.findIndex(
        (milestoneIndex) => milestoneIndex >= index,
      );

      return {
        key: workPackageTemplate.key,
        playbookStep: `${caseTemplate.key}.${workPackageTemplate.key}`,
        name: workPackageTemplate.title,
        objective: workPackageTemplate.objective,
        expectedOutput: workPackageTemplate.expectedOutput,
        doneCriteria: workPackageTemplate.doneCriteria,
        status: isDefined(previous)
          ? WORK_PACKAGE_STATUS.PLANNED
          : WORK_PACKAGE_STATUS.OFFERED,
        ownerMemberId: pickMember(workPackageTemplate.ownerRole, true),
        reviewerMemberId: pickMember(workPackageTemplate.reviewerRole, false),
        dueAt: dueAt?.toISOString() ?? null,
        dueOffsetBusinessDays: workPackageTemplate.dueOffsetDays,
        dependsOnKey: previous?.key ?? null,
        offeredAt: isDefined(previous) ? null : openedAt.toISOString(),
        milestoneKey:
          milestonePosition >= 0
            ? (caseTemplate.milestones[milestonePosition]?.key ?? null)
            : null,
      };
    },
  );

  const milestones = caseTemplate.milestones.map(
    (milestone): PlannedMilestone => ({
      key: milestone.key,
      name: milestone.title,
      playbookStep: `${caseTemplate.key}.${milestone.key}`,
      dueAt:
        workPackages.find(({ key }) => key === milestone.closedByWorkPackage)
          ?.dueAt ?? null,
    }),
  );

  return { workPackages, milestones };
};
