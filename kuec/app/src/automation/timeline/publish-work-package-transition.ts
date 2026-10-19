import {
  createTimelineActivity,
  kv,
} from 'twenty-sdk/logic-function';
import {
  isDefined,
} from 'twenty-sdk/utils';

import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/standard-objects';
import { PROJECT_UNIVERSAL_IDENTIFIER } from 'src/objects/project.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from 'src/objects/work-package.object';
import { WORK_PACKAGE_ACCEPTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-accepted.timeline-activity-type';
import { WORK_PACKAGE_BLOCKED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-blocked.timeline-activity-type';
import { WORK_PACKAGE_DECLINED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-declined.timeline-activity-type';
import { WORK_PACKAGE_DONE_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-done.timeline-activity-type';
import { WORK_PACKAGE_OFFERED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-offered.timeline-activity-type';
import { WORK_PACKAGE_REASSIGNED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-reassigned.timeline-activity-type';
import { WORK_PACKAGE_SUBMITTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER } from 'src/timeline-activity-types/work-package-submitted.timeline-activity-type';

export const WORK_PACKAGE_TRANSITION = {
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  SUBMITTED: 'SUBMITTED',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED',
  REASSIGNED: 'REASSIGNED',
} as const;

export type WorkPackageTransition =
  (typeof WORK_PACKAGE_TRANSITION)[keyof typeof WORK_PACKAGE_TRANSITION];

const TIMELINE_TYPE_BY_TRANSITION: Record<WorkPackageTransition, string> = {
  OFFERED: WORK_PACKAGE_OFFERED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  ACCEPTED: WORK_PACKAGE_ACCEPTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  DECLINED: WORK_PACKAGE_DECLINED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  SUBMITTED: WORK_PACKAGE_SUBMITTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  DONE: WORK_PACKAGE_DONE_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  BLOCKED: WORK_PACKAGE_BLOCKED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  REASSIGNED: WORK_PACKAGE_REASSIGNED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
};

export const isWorkPackageTransition = (
  value: string,
): value is WorkPackageTransition =>
  Object.values<string>(WORK_PACKAGE_TRANSITION).includes(value);

type TransitionWorkPackage = Pick<
  WorkPackageRecord,
  'id' | 'name' | 'opportunityId' | 'projectId'
>;

export type WorkPackageTransitionInput = {
  workPackage: TransitionWorkPackage;
  transition: WorkPackageTransition;
  happenedAt: string;
  properties?: Record<string, unknown>;
};

export type CaseTimelineTarget = {
  targetObjectUniversalIdentifier: string;
  targetRecordId: string;
};

export const caseTimelineTargetFor = (
  workPackage: Pick<TransitionWorkPackage, 'opportunityId' | 'projectId'>,
): CaseTimelineTarget | null => {
  if (isDefined(workPackage.opportunityId)) {
    return {
      targetObjectUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
      targetRecordId: workPackage.opportunityId,
    };
  }

  if (isDefined(workPackage.projectId)) {
    return {
      targetObjectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
      targetRecordId: workPackage.projectId,
    };
  }

  return null;
};

// A stubbed SDK constant passes isDefined but serialises as null, and the API
// then answers only "UUID! not to be null" (B5). Name the bad input instead.
const assertIdentifiers = (identifiers: Record<string, unknown>): void => {
  for (const [name, value] of Object.entries(identifiers)) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(
        `timeline row: ${name} must be a non-empty string, got ${typeof value}`,
      );
    }
  }
};

const publishOnce = async (
  key: string,
  publish: () => Promise<unknown>,
): Promise<void> => {
  if (isDefined(await kv.get<string>(key))) {
    return;
  }

  await publish();
  await kv.set(key, 'PUBLISHED');
};

// One row on the work package and one on its case (opportunity or project),
// linked back to the work package, so the case timeline is the audit trail.
export const publishWorkPackageTransition = async ({
  workPackage,
  transition,
  happenedAt,
  properties,
}: WorkPackageTransitionInput): Promise<void> => {
  const timelineActivityTypeUniversalIdentifier =
    TIMELINE_TYPE_BY_TRANSITION[transition];
  const keyBase = `timeline:${workPackage.id}:${transition}:${Date.parse(happenedAt)}`;

  assertIdentifiers({
    timelineActivityTypeUniversalIdentifier,
    workPackageObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    workPackageId: workPackage.id,
  });

  await publishOnce(`${keyBase}:work-package`, () =>
    createTimelineActivity({
      timelineActivityTypeUniversalIdentifier,
      targetObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      targetRecordId: workPackage.id,
      happensAt: happenedAt,
      properties,
    }),
  );

  const caseTarget = caseTimelineTargetFor(workPackage);

  if (!isDefined(caseTarget)) {
    return;
  }

  assertIdentifiers(caseTarget);

  await publishOnce(`${keyBase}:case`, () =>
    createTimelineActivity({
      timelineActivityTypeUniversalIdentifier,
      ...caseTarget,
      happensAt: happenedAt,
      linkedObjectMetadataUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      linkedRecordId: workPackage.id,
      properties,
    }),
  );
};

export type TimelinePublishFailure = {
  workPackageId: string;
  transition: WorkPackageTransition;
  message: string;
};

// The timeline is the audit trail, not the notification. Callers notify and
// stamp first, then publish here; a failed row is logged where the function
// logs show it and returned, so the caller can fail the run visibly.
export const publishWorkPackageTransitions = async (
  inputs: WorkPackageTransitionInput[],
): Promise<TimelinePublishFailure[]> => {
  const failures: TimelinePublishFailure[] = [];

  for (const input of inputs) {
    try {
      await publishWorkPackageTransition(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error(
        `timeline ${input.transition} for work package ${input.workPackage.id} failed: ${message}`,
      );
      failures.push({
        workPackageId: input.workPackage.id,
        transition: input.transition,
        message,
      });
    }
  }

  return failures;
};

export const describeTimelineFailures = (
  failures: TimelinePublishFailure[],
): string =>
  failures
    .map(
      ({ workPackageId, transition, message }) =>
        `${transition} ${workPackageId}: ${message}`,
    )
    .join('; ');
