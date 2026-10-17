import { defineLogicFunction } from 'twenty-sdk/define';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  listRecords,
  quoteFilterValues,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { planAutoDead } from 'src/automation/rules/lead-auto-dead.rule';
import { LEAD_STATUS } from 'src/objects/lead.object';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const L03_LEAD_AUTO_DEAD_UNIVERSAL_IDENTIFIER = '160fd77f-9ace-4395-b234-c6aa4d07e813';

// The task goes out before the status changes: a run that stops in between is
// finished the next day under the same key, while a lead already Dead would
// never be picked up again.
const handler = async () => {
  if (!isPackEnabled(PACK.CRM)) {
    return packStandDown(PACK.CRM);
  }

  const api = createTwentyApi();
  const now = new Date();
  const [leads, context] = await Promise.all([
    listRecords<LeadRecord>(
      api.asApplication,
      OBJECT_NAMES.lead,
      `status[in]:${quoteFilterValues([LEAD_STATUS.CONTACTED, LEAD_STATUS.ENGAGED])}`,
    ),
    loadAutomationContext(api),
  ]);
  const closed: string[] = [];

  for (const lead of leads) {
    const plan = planAutoDead(lead, now);

    if (plan === null) {
      continue;
    }

    const target = leadTarget(lead.id);
    const subject = lead.name ?? '';

    await createTaskOnce({
      api,
      assigneeId: lead.ownerId ?? context.edMemberId,
      title: `Confirm or revive: ${subject}`,
      body: NOTIFICATION_MESSAGES.leadAutoDead({ subject, link: recordLinkFor(target) }),
      target,
      dedupeKey: plan.dedupeKey,
      now,
      dueAt: plan.reviveTaskDueAt,
    });
    await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, plan.changes);
    closed.push(lead.id);
  }

  console.log(`l03 checked ${leads.length} Contacted or Engaged leads, closed ${closed.length} for no response`);

  return { closed };
};

export default defineLogicFunction({
  universalIdentifier: L03_LEAD_AUTO_DEAD_UNIVERSAL_IDENTIFIER,
  name: 'l03-lead-auto-dead',
  description:
    'L3 daily: a Contacted or Engaged lead with no status change and no engagement for 30 days goes Dead (No response), with a task to the owner to confirm or revive within 5 days',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // 08:10 Asia/Dubai, after the 08:00 next-action guard
    pattern: '10 4 * * *',
  },
});
