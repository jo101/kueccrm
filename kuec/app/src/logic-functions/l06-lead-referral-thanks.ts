import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi } from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { type LeadRecord } from 'src/automation/records/record-types';
import { planReferralThanks } from 'src/automation/rules/lead-referral.rule';

export const L06_LEAD_REFERRAL_THANKS_UNIVERSAL_IDENTIFIER = 'c4749234-ea57-423d-a7ca-fece75c1cb5c';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>,
) => {
  const { before, after } = event.properties;
  const plan = planReferralThanks({
    lead: after,
    previousStatus: before.status,
    status: after.status,
  });

  if (plan === null) {
    return { skipped: 'not Qualified or Converted, or nobody referred the lead' };
  }

  const api = createTwentyApi();
  const target = leadTarget(event.recordId);
  const subject = after.name ?? '';
  const ownerId = after.ownerId ?? (await loadAutomationContext(api)).edMemberId;

  await createTaskOnce({
    api,
    assigneeId: ownerId,
    title: `Thank the referrer: ${subject}`,
    body: NOTIFICATION_MESSAGES.thankReferrer({ subject, link: recordLinkFor(target) }),
    target,
    dedupeKey: plan.dedupeKey,
    now: new Date(),
  });

  return { thanked: plan.dedupeKey };
};

export default defineLogicFunction({
  universalIdentifier: L06_LEAD_REFERRAL_THANKS_UNIVERSAL_IDENTIFIER,
  name: 'l06-lead-referral-thanks',
  description:
    'L6: a referred lead reaching Qualified or Converted gives its owner a Thank the referrer task, once per status',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['status'],
  },
});
