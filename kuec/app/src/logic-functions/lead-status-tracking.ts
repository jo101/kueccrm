import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { planLeadStatusEntry } from 'src/automation/rules/lead-status.rule';

export const LEAD_STATUS_TRACKING_UNIVERSAL_IDENTIFIER = 'd48247cd-59e6-4bd9-a75f-86354cc29840';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>,
) => {
  const { before, after } = event.properties;

  if (before.status === after.status) {
    return { skipped: 'status unchanged' };
  }

  const api = createTwentyApi();
  const plan = planLeadStatusEntry({ lead: after, enteredAt: after.updatedAt });

  await updateRecord(api.asApplication, OBJECT_NAMES.lead, event.recordId, plan.changes);

  if (!plan.needsDeadReason) {
    return plan.changes;
  }

  const target = leadTarget(event.recordId);
  const subject = after.name ?? '';

  await createTaskOnce({
    api,
    assigneeId: after.ownerId ?? (await loadAutomationContext(api)).edMemberId,
    title: `Record dead reason: ${subject}`,
    body: NOTIFICATION_MESSAGES.recordDeadReason({ subject, link: recordLinkFor(target) }),
    target,
    dedupeKey: `lead-dead-reason:${event.recordId}:${Date.parse(after.updatedAt)}`,
    now: new Date(),
  });

  return { ...plan.changes, deadReasonTask: true };
};

export default defineLogicFunction({
  universalIdentifier: LEAD_STATUS_TRACKING_UNIVERSAL_IDENTIFIER,
  name: 'lead-status-tracking',
  description:
    'Stamps statusEnteredAt on every lead status change (the L2 and L3 clocks); Nurture without a review date gets one 90 days out; Dead without a reason gives the owner a Record dead reason task',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['status'],
  },
});
