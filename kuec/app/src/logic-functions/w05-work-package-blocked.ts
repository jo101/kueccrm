import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi } from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  postToTeamsOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

export const W05_WORK_PACKAGE_BLOCKED_UNIVERSAL_IDENTIFIER = '5b32de22-9f38-4f60-86d8-f10a0680ff02';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<WorkPackageRecord>>,
) => {
  const { before, after } = event.properties;

  if (
    after.status !== WORK_PACKAGE_STATUS.BLOCKED ||
    before.status === WORK_PACKAGE_STATUS.BLOCKED
  ) {
    return { skipped: 'not a transition to Blocked' };
  }

  const api = createTwentyApi();
  const now = new Date();
  const context = await loadAutomationContext(api);
  const target = {
    objectNameSingular: OBJECT_NAMES.workPackage.singular,
    recordId: event.recordId,
  };
  const reason = (after.blockedReason ?? '').trim() || null;
  const message = NOTIFICATION_MESSAGES.blocked({
    subject: after.name ?? '',
    reason,
    link: recordLinkFor(target),
  });
  // Every block is a new decision for the ED, so the key is this transition.
  const dedupeKey = `blocked:${event.recordId}:${Date.parse(after.updatedAt)}`;

  await notifyMembers({
    api,
    memberIds: [context.edMemberId],
    message,
    taskTitle: `Decision needed: ${after.name ?? ''}`,
    target,
    dedupeKey,
    now,
  });
  await postToTeamsOnce({ dedupeKey, line: message });

  return { notified: context.edMemberId, reason };
};

export default defineLogicFunction({
  universalIdentifier: W05_WORK_PACKAGE_BLOCKED_UNIVERSAL_IDENTIFIER,
  name: 'w05-work-package-blocked',
  description:
    'W5: a blocked work package notifies the ED with the reason and creates a Decision needed task',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'workPackage.updated',
    updatedFields: ['status'],
  },
});
