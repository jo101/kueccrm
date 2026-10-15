import { defineLogicFunction } from 'twenty-sdk/define';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import { needsNextActionFlag } from 'src/automation/rules/next-action-guard.rule';

export const W04_NEXT_ACTION_GUARD_UNIVERSAL_IDENTIFIER = '5a424423-b0fa-4b2a-82c4-a6d5517cd55c';

const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const today = toDubaiDateString(now);
  const [opportunities, context] = await Promise.all([
    // Closed stages are filtered by the rule: a REST filter on stage values
    // that are not configured yet would be rejected.
    listRecords<OpportunityRecord>(api.asApplication, OBJECT_NAMES.opportunity),
    loadAutomationContext(api),
  ]);
  const flagged: string[] = [];

  for (const opportunity of opportunities) {
    if (!needsNextActionFlag(opportunity, today)) {
      continue;
    }

    const target = {
      objectNameSingular: OBJECT_NAMES.opportunity.singular,
      recordId: opportunity.id,
    };

    await notifyMembers({
      api,
      memberIds: [opportunity.ownerId ?? context.edMemberId],
      message: NOTIFICATION_MESSAGES.setNextAction({
        subject: opportunity.name ?? '',
        link: recordLinkFor(target),
      }),
      taskTitle: `Set next action: ${opportunity.name ?? ''}`,
      target,
      dedupeKey: `next-action:${opportunity.id}:${today}`,
      now,
    });
    await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
      nextActionFlaggedOn: today,
    });
    flagged.push(opportunity.id);
  }

  console.log(`w04 flagged ${flagged.length} of ${opportunities.length} open opportunities`);

  return { flagged };
};

export default defineLogicFunction({
  universalIdentifier: W04_NEXT_ACTION_GUARD_UNIVERSAL_IDENTIFIER,
  name: 'w04-next-action-guard',
  description:
    'W4 daily: open opportunities with no next action or a past next-action date get a Set next action task for the owner, once a day',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // 08:00 Asia/Dubai
    pattern: '0 4 * * *',
  },
});
