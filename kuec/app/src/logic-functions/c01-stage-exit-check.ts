import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi } from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import { notifyMembers, recordLinkFor } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import {
  type ExitCheckOpportunity,
  isForwardMove,
  stageExitGaps,
} from 'src/automation/rules/stage-exit.rule';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const C01_STAGE_EXIT_CHECK_UNIVERSAL_IDENTIFIER = '3f38bf13-7bdf-4e11-925a-e05c58e52567';

type StageExitOpportunity = OpportunityRecord & ExitCheckOpportunity;

// C1 (CRM pack): Twenty cannot refuse a stage move, so a forward move with
// exit criteria missing tells the owner what to fill. The open-pipeline view
// "Pipeline pack: exit criteria missing" keeps the rest visible.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<StageExitOpportunity>>,
) => {
  if (!isPackEnabled(PACK.CRM)) {
    return packStandDown(PACK.CRM);
  }

  const { before, after } = event.properties;

  if (!isForwardMove(before.stage, after.stage)) {
    return { skipped: 'not a forward stage move' };
  }

  const gaps = stageExitGaps(after, after.stage);

  if (gaps.length === 0) {
    return { gaps };
  }

  const api = createTwentyApi();
  const ownerId = isDefined(after.ownerId)
    ? after.ownerId
    : (await loadAutomationContext(api)).edMemberId;
  const target = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: event.recordId,
  };

  await notifyMembers({
    api,
    memberIds: [ownerId],
    message: NOTIFICATION_MESSAGES.stageExitGaps({
      subject: after.name ?? '',
      link: recordLinkFor(target),
      reason: gaps.join(', '),
    }),
    taskTitle: `Exit criteria: ${after.name ?? ''}`,
    target,
    dedupeKey: `stage-exit:${event.recordId}:${after.stage}:${Date.parse(after.updatedAt)}`,
    now: new Date(),
  });

  return { gaps };
};

export default defineLogicFunction({
  universalIdentifier: C01_STAGE_EXIT_CHECK_UNIVERSAL_IDENTIFIER,
  name: 'c01-stage-exit-check',
  description:
    'C1, CRM pack: an opportunity moved forward with exit criteria of an earlier stage missing gets a Task for its owner naming them',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['stage'],
  },
});
