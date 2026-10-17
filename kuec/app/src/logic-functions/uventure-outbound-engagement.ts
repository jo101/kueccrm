import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { type EngagementRecord } from 'src/automation/records/record-types';
import { enqueueOutbound } from 'src/automation/uventure/outbound/enqueue-outbound';
import {
  outboundDeliveryId,
  UVENTURE_OUTBOUND_EVENT_TYPE,
} from 'src/automation/uventure/outbound/plan-outbound-event';
import { UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/uventure-outbound-job';

export const UVENTURE_OUTBOUND_ENGAGEMENT_UNIVERSAL_IDENTIFIER = '639b85a4-1171-437f-948a-fde768ecc089';

type EngagementWithCapability = EngagementRecord & {
  capabilityId: string | null;
  updatedAt: string;
};

// The fast path; uventure-sweep repairs a lost event from record state. The
// job sends only when the capability is a technology or a disclosure.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<EngagementWithCapability>>,
) => {
  const { before, after } = event.properties;

  if (!isDefined(after.capabilityId) || before.capabilityId === after.capabilityId) {
    return { skipped: 'no new capability on the engagement' };
  }

  const subject = {
    type: UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY,
    recordId: event.recordId,
  };
  const enqueued = await enqueueOutbound({
    jobUniversalIdentifier: UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER,
    subjects: [
      {
        ...subject,
        deliveryId: outboundDeliveryId({
          ...subject,
          recordId: `${event.recordId}-${after.capabilityId}`,
        }),
      },
    ],
    jobIdSuffix: String(Date.parse(after.updatedAt)),
  });

  return { enqueued };
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_OUTBOUND_ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  name: 'uventure-outbound-engagement',
  description:
    'An engagement that names a technology or invention disclosure as its capability is sent to uVENTURE (uventure-outbound-job)',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'engagement.updated',
    updatedFields: ['capabilityId'],
  },
});
