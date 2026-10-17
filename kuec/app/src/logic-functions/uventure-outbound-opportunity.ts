import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { type OpportunityRecord } from 'src/automation/records/record-types';
import { enqueueOutbound } from 'src/automation/uventure/outbound/enqueue-outbound';
import {
  outboundDeliveryId,
  UVENTURE_OUTBOUND_EVENT_TYPE,
} from 'src/automation/uventure/outbound/plan-outbound-event';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/uventure-outbound-job';

export const UVENTURE_OUTBOUND_OPPORTUNITY_UNIVERSAL_IDENTIFIER = 'd8a37826-7e06-45ad-b40f-d924e71d0430';

// The fast path; uventure-sweep repairs a lost event from record state.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const { before, after } = event.properties;

  if (
    after.stage !== OPPORTUNITY_STAGE.SIGNED ||
    before.stage === OPPORTUNITY_STAGE.SIGNED ||
    after.playbookType !== OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING
  ) {
    return { skipped: 'not a licence opportunity reaching Signed' };
  }

  const subject = {
    type: UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED,
    recordId: event.recordId,
  };
  const enqueued = await enqueueOutbound({
    jobUniversalIdentifier: UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER,
    subjects: [{ ...subject, deliveryId: outboundDeliveryId(subject) }],
    jobIdSuffix: String(Date.parse(after.updatedAt)),
  });

  return { enqueued };
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_OUTBOUND_OPPORTUNITY_UNIVERSAL_IDENTIFIER,
  name: 'uventure-outbound-opportunity',
  description:
    'A Licence opportunity reaching Signed is sent to uVENTURE (uventure-outbound-job), so the licence can be recorded against the technology',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['stage'],
  },
});
