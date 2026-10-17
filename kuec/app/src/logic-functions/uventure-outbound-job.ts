import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi } from 'src/automation/api/twenty-api';
import { loadOutboundEvent } from 'src/automation/uventure/outbound/load-outbound-event';
import { type OutboundSubject } from 'src/automation/uventure/outbound/plan-outbound-event';
import {
  readOutboundResult,
  sendToUventure,
} from 'src/automation/uventure/outbound/send-to-uventure';

export const UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER = '11b9d4ec-0471-498b-8925-bd57c8382163';

// Reads the record again, builds the event from its current state and sends it
// signed to uVENTURE once. Retried 3 times on 429, 5xx and network errors.
const handler = async (subject: OutboundSubject) => {
  const event = await loadOutboundEvent(createTwentyApi(), subject);

  if (!isDefined(event)) {
    return { skipped: `${subject.type} ${subject.recordId}: nothing to send` };
  }

  if ((await readOutboundResult(event.deliveryId)) === 'SENT') {
    return { skipped: `${event.deliveryId} already sent` };
  }

  const result = await sendToUventure(event);

  console.log(`uventure send ${event.deliveryId}: ${result}`);

  return { deliveryId: event.deliveryId, result };
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER,
  name: 'uventure-outbound-job',
  description:
    'Sends one signed event to uVENTURE: a signed licence opportunity, a lead converted with IP licence interest, or an engagement on a technology; built from the record as it is now',
  timeoutSeconds: 60,
  handler,
});
