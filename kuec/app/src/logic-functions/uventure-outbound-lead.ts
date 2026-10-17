import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { type LeadRecord } from 'src/automation/records/record-types';
import { enqueueOutbound } from 'src/automation/uventure/outbound/enqueue-outbound';
import {
  outboundDeliveryId,
  UVENTURE_OUTBOUND_EVENT_TYPE,
} from 'src/automation/uventure/outbound/plan-outbound-event';
import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { LEAD_STATUS } from 'src/objects/lead.object';
import { UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/uventure-outbound-job';

export const UVENTURE_OUTBOUND_LEAD_UNIVERSAL_IDENTIFIER = '8a604006-d54f-422d-8a3c-fdeea819860a';

// The fast path; uventure-sweep repairs a lost event from record state.
const handler = async (event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>) => {
  const { before, after } = event.properties;

  if (
    after.status !== LEAD_STATUS.CONVERTED ||
    before.status === LEAD_STATUS.CONVERTED ||
    !(after.offeringInterest ?? []).includes(OPPORTUNITY_OFFERING.IP_LICENCE)
  ) {
    return { skipped: 'not a lead with IP licence interest reaching Converted' };
  }

  const subject = {
    type: UVENTURE_OUTBOUND_EVENT_TYPE.LEAD_CONVERTED_IP_LICENCE,
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
  universalIdentifier: UVENTURE_OUTBOUND_LEAD_UNIVERSAL_IDENTIFIER,
  name: 'uventure-outbound-lead',
  description:
    'A lead converted with Intellectual property licence among its offering interest is sent to uVENTURE (uventure-outbound-job)',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['status'],
  },
});
