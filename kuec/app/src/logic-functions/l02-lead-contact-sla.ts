import { defineLogicFunction } from 'twenty-sdk/define';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { planContactSlaEscalations } from 'src/automation/rules/lead-contact-sla.rule';
import { LEAD_STATUS } from 'src/objects/lead.object';

export const L02_LEAD_CONTACT_SLA_UNIVERSAL_IDENTIFIER = 'a7c363ee-ef10-44be-842a-166b14ef1b3f';

// Hourly from lead state alone: the clock is Status entered at, so there is no
// timer job to lose and the sweep is the only path.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [leads, context] = await Promise.all([
    listRecords<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, `status[eq]:${LEAD_STATUS.NEW}`),
    loadAutomationContext(api),
  ]);
  const fired: string[] = [];

  for (const lead of leads) {
    for (const escalation of planContactSlaEscalations({
      lead,
      holidays: context.holidays,
      now,
    })) {
      const target = leadTarget(lead.id);
      const subject = lead.name ?? '';
      const link = recordLinkFor(target);
      const isOwnerNudge = escalation.level === 1;

      await notifyMembers({
        api,
        memberIds: isOwnerNudge
          ? [lead.ownerId ?? context.opsCoordinatorMemberId ?? context.edMemberId]
          : [context.edMemberId],
        message: isOwnerNudge
          ? NOTIFICATION_MESSAGES.leadContactNudge({ subject, link })
          : NOTIFICATION_MESSAGES.leadContactEd({ subject, link }),
        taskTitle: `${isOwnerNudge ? 'Contact this lead' : 'Lead not contacted in 7 business days'}: ${subject}`,
        target,
        dedupeKey: escalation.dedupeKey,
        now,
      });
      await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, {
        [escalation.stampField]: now.toISOString(),
      });
      fired.push(escalation.dedupeKey);
    }
  }

  console.log(`l02 checked ${leads.length} New leads, fired ${fired.length}`);

  return { fired };
};

export default defineLogicFunction({
  universalIdentifier: L02_LEAD_CONTACT_SLA_UNIVERSAL_IDENTIFIER,
  name: 'l02-lead-contact-sla',
  description:
    'L2 hourly: a lead still New 3 business days after it entered New nudges its owner; after 7 the ED is told; each once per clock',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 15, UTC (Asia/Dubai has the same minute), off the other sweeps' minutes
    pattern: '15 * * * *',
  },
});
