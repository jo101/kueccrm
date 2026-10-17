import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import {
  createTaskOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import {
  computeParkedLapsesAt,
  computeStaleFrom,
} from 'src/automation/rules/age-thresholds.rule';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';

export const W08_OPPORTUNITY_STAGE_TRACKING_UNIVERSAL_IDENTIFIER = 'f2004638-3cea-4d6e-bc61-25984a3f476a';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const { before, after } = event.properties;

  if (before.stage === after.stage) {
    return { skipped: 'stage unchanged' };
  }

  const api = createTwentyApi();
  const now = new Date();

  await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, event.recordId, {
    stageEnteredAt: after.updatedAt,
    staleFrom: computeStaleFrom(after.updatedAt),
    parkedLapsesAt: computeParkedLapsesAt(after.stage, after.updatedAt),
  });

  if (
    after.stage !== OPPORTUNITY_STAGE.LOST ||
    (after.lostReason ?? '').trim().length > 0
  ) {
    return { stageEnteredAt: after.updatedAt };
  }

  const target = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: event.recordId,
  };
  const context = await loadAutomationContext(api);

  await createTaskOnce({
    api,
    assigneeId: after.ownerId ?? context.edMemberId,
    title: `Record lost reason: ${after.name ?? ''}`,
    body: `Record why this opportunity was lost. ${recordLinkFor(target)}`,
    target,
    dedupeKey: `lost-reason:${event.recordId}:${Date.parse(after.updatedAt)}`,
    now,
  });

  return { stageEnteredAt: after.updatedAt, lostReasonTask: true };
};

export default defineLogicFunction({
  universalIdentifier: W08_OPPORTUNITY_STAGE_TRACKING_UNIVERSAL_IDENTIFIER,
  name: 'w08-opportunity-stage-tracking',
  description:
    'W8: stamps stageEnteredAt, staleFrom and parkedLapsesAt on every stage change; Lost without a reason creates a Record lost reason task for the owner',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['stage'],
  },
});
