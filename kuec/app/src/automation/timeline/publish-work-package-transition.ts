import {
  createTimelineActivity,
  kv,
} from 'twenty-sdk/logic-function';
import {
  isDefined,
} from 'twenty-sdk/utils';
import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

import { type WorkPackageRecord } from 'src/automation/records/record-types';
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
}: {
  workPackage: Pick<
    WorkPackageRecord,
    'id' | 'name' | 'opportunityId' | 'projectId'
  >;
  transition: WorkPackageTransition;
  happenedAt: string;
  properties?: Record<string, unknown>;
}): Promise<void> => {
  const timelineActivityTypeUniversalIdentifier =
    TIMELINE_TYPE_BY_TRANSITION[transition];
  const keyBase = `timeline:${workPackage.id}:${transition}:${Date.parse(happenedAt)}`;

  await publishOnce(`${keyBase}:work-package`, () =>
    createTimelineActivity({
      timelineActivityTypeUniversalIdentifier,
      targetObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      targetRecordId: workPackage.id,
      happensAt: happenedAt,
      properties,
    }),
  );

  const caseTarget = isDefined(workPackage.opportunityId)
    ? {
        targetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
        targetRecordId: workPackage.opportunityId,
      }
    : isDefined(workPackage.projectId)
      ? {
          targetObjectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
          targetRecordId: workPackage.projectId,
        }
      : null;

  if (!isDefined(caseTarget)) {
    return;
  }

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
