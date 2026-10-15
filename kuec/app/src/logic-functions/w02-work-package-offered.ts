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
  updateRecord,
} from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { scheduleWorkPackageTimers } from 'src/automation/timers/schedule-work-package-timers';
import { TIMER_KIND } from 'src/automation/timers/work-package-timers';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

export const W02_WORK_PACKAGE_OFFERED_UNIVERSAL_IDENTIFIER = 'a7da13e1-cbc2-4fa9-8634-2a56faa7f9f9';

// W6 stamps offeredAt just before it flips the status; a stamp that recent belongs to this offer.
const RECENT_OFFER_MS = 5 * 60 * 1000;

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<WorkPackageRecord>>,
) => {
  const { before, after } = event.properties;

  if (
    after.status !== WORK_PACKAGE_STATUS.OFFERED ||
    before.status === WORK_PACKAGE_STATUS.OFFERED
  ) {
    return { skipped: 'not a transition to Offered' };
  }

  const api = createTwentyApi();
  const now = new Date();

  const isRecentOffer =
    isDefined(after.offeredAt) &&
    now.getTime() - Date.parse(after.offeredAt) < RECENT_OFFER_MS;

  if (!isRecentOffer) {
    await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, event.recordId, {
      offeredAt: now.toISOString(),
    });
  }

  const [workPackage, context] = await Promise.all([
    getRecord<WorkPackageRecord>(
      api.asApplication,
      OBJECT_NAMES.workPackage,
      event.recordId,
    ),
    loadAutomationContext(api),
  ]);

  if (!isDefined(workPackage) || workPackage.status !== WORK_PACKAGE_STATUS.OFFERED) {
    return { skipped: 'no longer offered' };
  }

  const jobIds = await scheduleWorkPackageTimers({
    workPackage,
    kinds: [TIMER_KIND.ACCEPT],
    holidays: context.holidays,
    now,
  });

  const target = {
    objectNameSingular: OBJECT_NAMES.workPackage.singular,
    recordId: workPackage.id,
  };

  await notifyMembers({
    api,
    memberIds: [workPackage.ownerId],
    message: NOTIFICATION_MESSAGES.workPackageOffered({
      subject: workPackage.name ?? '',
      link: recordLinkFor(target),
    }),
    taskTitle: `Accept or decline: ${workPackage.name ?? ''}`,
    target,
    dedupeKey: `offered:${workPackage.id}:${Date.parse(workPackage.offeredAt ?? now.toISOString())}`,
    now,
  });

  return { jobIds };
};

export default defineLogicFunction({
  universalIdentifier: W02_WORK_PACKAGE_OFFERED_UNIVERSAL_IDENTIFIER,
  name: 'w02-work-package-offered',
  description:
    'W2: when a work package is offered, stamps offeredAt and starts the 2- and 5-business-day acceptance timer',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'workPackage.updated',
    updatedFields: ['status'],
  },
});
