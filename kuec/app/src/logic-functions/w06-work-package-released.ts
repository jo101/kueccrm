import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  getRecord,
  listRecords,
  updateRecord,
  type TwentyApi,
} from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import {
  computeWorkPackageDueAt,
  type DueAnchors,
} from 'src/automation/playbooks/plan-case-work-packages';
import { findWorkPackageTemplate } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type OpportunityRecord,
  type ProjectRecord,
  type WorkPackageRecord,
} from 'src/automation/records/record-types';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

export const W06_WORK_PACKAGE_RELEASED_UNIVERSAL_IDENTIFIER = '68990f78-4e01-4e16-b499-501cb8cedb3e';

const loadCaseAnchors = async (
  api: TwentyApi,
  workPackage: WorkPackageRecord,
): Promise<DueAnchors> => {
  if (isDefined(workPackage.opportunityId)) {
    const opportunity = await getRecord<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      workPackage.opportunityId,
    );

    return isDefined(opportunity?.clientDeadline)
      ? { CLIENT_DEADLINE: opportunity.clientDeadline.slice(0, 10) }
      : {};
  }

  if (isDefined(workPackage.projectId)) {
    const project = await getRecord<ProjectRecord>(
      api.asApplication,
      OBJECT_NAMES.project,
      workPackage.projectId,
    );

    return isDefined(project?.eventDate)
      ? { EVENT_DATE: project.eventDate.slice(0, 10) }
      : {};
  }

  return {};
};

const releaseDependents = async (
  api: TwentyApi,
  completed: WorkPackageRecord,
  now: Date,
) => {
  const dependents = await listRecords<WorkPackageRecord>(
    api.asApplication,
    OBJECT_NAMES.workPackage,
    `and(dependsOnId[eq]:"${completed.id}",status[eq]:${WORK_PACKAGE_STATUS.PLANNED})`,
  );

  if (dependents.length === 0) {
    return [];
  }

  const [context, anchors] = await Promise.all([
    loadAutomationContext(api),
    loadCaseAnchors(api, completed),
  ]);

  for (const dependent of dependents) {
    const template = isDefined(dependent.playbookStep)
      ? findWorkPackageTemplate(dependent.playbookStep)
      : null;
    // Later steps count from the day the previous step is done, so the
    // planned estimate is replaced now.
    const dueAt = isDefined(template)
      ? computeWorkPackageDueAt({
          workPackageTemplate: template,
          start: now,
          anchors,
          holidays: context.holidays,
        })
      : null;

    await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, dependent.id, {
      offeredAt: now.toISOString(),
    });
    // The status change triggers W2, which notifies the new owner and starts
    // the acceptance timer; notifying here as well would race it. Written as
    // the app because the person who finished the predecessor may not be
    // allowed to set due dates.
    await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, dependent.id, {
      status: WORK_PACKAGE_STATUS.OFFERED,
      ...(isDefined(dueAt) ? { dueAt: dueAt.toISOString() } : {}),
    });
  }

  return dependents.map(({ id }) => id);
};

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<WorkPackageRecord>>,
) => {
  const { before, after } = event.properties;

  if (before.status === after.status) {
    return { skipped: 'no status transition' };
  }

  const api = createTwentyApi();
  const now = new Date();

  if (after.status === WORK_PACKAGE_STATUS.DONE) {
    await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, event.recordId, {
      completedAt: now.toISOString(),
    });

    return { released: await releaseDependents(api, after, now) };
  }

  if (after.status === WORK_PACKAGE_STATUS.SUBMITTED) {
    const target = {
      objectNameSingular: OBJECT_NAMES.workPackage.singular,
      recordId: event.recordId,
    };

    await notifyMembers({
      api,
      memberIds: [after.reviewerId],
      message: NOTIFICATION_MESSAGES.submittedForReview({
        subject: after.name ?? '',
        link: recordLinkFor(target),
      }),
      taskTitle: `Review: ${after.name ?? ''}`,
      target,
      dedupeKey: `submitted:${event.recordId}:${Date.parse(after.updatedAt)}`,
      now,
    });

    return { reviewerNotified: after.reviewerId };
  }

  return { skipped: `no release rule for ${after.status}` };
};

export default defineLogicFunction({
  universalIdentifier: W06_WORK_PACKAGE_RELEASED_UNIVERSAL_IDENTIFIER,
  name: 'w06-work-package-released',
  description:
    'W6: Done stamps completedAt and offers the planned work packages that depend on it; Submitted notifies the reviewer',
  timeoutSeconds: 120,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'workPackage.updated',
    updatedFields: ['status'],
  },
});
