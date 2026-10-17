import { defineLogicFunction } from 'twenty-sdk/define';
import {
  enqueueJobs,
  Response,
  type RoutePayload,
} from 'twenty-sdk/logic-function';

import {
  UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE,
  UVENTURE_SIGNING_SECRET_VARIABLE,
} from 'src/application.config';
import { isValidDeliveryId } from 'src/automation/intake/lead-intake-payload';
import {
  DELIVERY_HEADER,
  readHeader,
  SIGNATURE_HEADER,
  TIMESTAMP_HEADER,
  verifySignature,
} from 'src/automation/intake/verify-signature';
import { parseUventureDelivery } from 'src/automation/uventure/uventure-payload';
import { UVENTURE_EVENT_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/uventure-event-job';

export const UVENTURE_ROUTE_UNIVERSAL_IDENTIFIER = '410a86bc-6651-455d-a138-32866acaf1fa';

export const UVENTURE_EVENT_JOB_RETRY_LIMIT = 3;

// The signed server route of runbooks/16-integration-map.md section 2.4 for
// every uVENTURE to Twenty contract (runbooks/21-uventure-readiness.md section 4).
// It writes nothing: it checks the signature and the shape and enqueues one job
// per delivery, so a resent delivery is a no-op.
const handler = async (event: RoutePayload) => {
  const rawBody = event.rawBody ?? '';
  const deliveryId = readHeader(event.headers, DELIVERY_HEADER);
  const check = verifySignature({
    headers: event.headers,
    rawBody,
    secrets: [
      process.env[UVENTURE_SIGNING_SECRET_VARIABLE],
      process.env[UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE],
    ],
    now: new Date(),
  });

  if (!check.ok) {
    console.warn(`uventure delivery refused ${deliveryId ?? 'without a delivery id'}: ${check.reason}`);

    // An unset secret is our fault, so the sender keeps retrying.
    return new Response(
      { error: check.reason === 'NOT_CONFIGURED' ? 'unavailable' : 'unauthorized' },
      { status: check.reason === 'NOT_CONFIGURED' ? 503 : 401 },
    );
  }

  if (!isValidDeliveryId(deliveryId)) {
    return new Response(
      { error: `${DELIVERY_HEADER} must be 1 to 100 letters, digits, dot, dash or underscore` },
      { status: 400 },
    );
  }

  const parsed = parseUventureDelivery(rawBody, deliveryId);

  if (!parsed.ok) {
    console.warn(`uventure delivery ${deliveryId} rejected: ${parsed.reason}`);

    return new Response({ error: parsed.reason }, { status: parsed.status });
  }

  try {
    await enqueueJobs({
      logicFunctionUniversalIdentifier: UVENTURE_EVENT_JOB_UNIVERSAL_IDENTIFIER,
      jobs: [{ jobId: `uventure-${deliveryId}`, payload: parsed.payload }],
      retryLimit: UVENTURE_EVENT_JOB_RETRY_LIMIT,
    });
  } catch (error) {
    console.error(
      `uventure delivery ${deliveryId} not enqueued: ${error instanceof Error ? error.message : String(error)}`,
    );

    return new Response({ error: 'unavailable' }, { status: 503 });
  }

  console.log(`uventure delivery ${deliveryId} accepted ${parsed.payload.events.length} events`);

  return new Response(
    { deliveryId, accepted: parsed.payload.events.length },
    { status: 202 },
  );
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_ROUTE_UNIVERSAL_IDENTIFIER,
  name: 'uventure-route',
  description:
    'POST /s/integrations/uventure/events: verifies the HMAC signature of a uVENTURE delivery (technologies, disclosures, listings, challenges, agreements, sign-ups) and enqueues uventure-event-job',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/integrations/uventure/events',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: [TIMESTAMP_HEADER, SIGNATURE_HEADER, DELIVERY_HEADER],
  },
});
