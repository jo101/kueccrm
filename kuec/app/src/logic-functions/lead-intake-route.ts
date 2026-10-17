import { defineLogicFunction } from 'twenty-sdk/define';
import {
  enqueueJobs,
  Response,
  type RoutePayload,
} from 'twenty-sdk/logic-function';

import {
  FORMS_SIGNING_SECRET_PREVIOUS_VARIABLE,
  FORMS_SIGNING_SECRET_VARIABLE,
} from 'src/application.config';
import {
  isValidDeliveryId,
  parseLeadIntakeBody,
} from 'src/automation/intake/lead-intake-payload';
import {
  DELIVERY_HEADER,
  readHeader,
  SIGNATURE_HEADER,
  TIMESTAMP_HEADER,
  verifySignature,
} from 'src/automation/intake/verify-signature';
import { LEAD_INTAKE_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/lead-intake-job';

export const LEAD_INTAKE_ROUTE_UNIVERSAL_IDENTIFIER = '4020409e-c867-480f-8bc9-d7234d8662ec';

export const LEAD_INTAKE_JOB_RETRY_LIMIT = 3;

// The signed server route of runbooks/16-integration-map.md section 2.4. It
// writes nothing: it checks the signature and the shape, and enqueues one job
// per delivery, so a resent delivery is a no-op.
const handler = async (event: RoutePayload) => {
  const rawBody = event.rawBody ?? '';
  const deliveryId = readHeader(event.headers, DELIVERY_HEADER);
  const check = verifySignature({
    headers: event.headers,
    rawBody,
    secrets: [
      process.env[FORMS_SIGNING_SECRET_VARIABLE],
      process.env[FORMS_SIGNING_SECRET_PREVIOUS_VARIABLE],
    ],
    now: new Date(),
  });

  if (!check.ok) {
    console.warn(`lead intake refused ${deliveryId ?? 'without a delivery id'}: ${check.reason}`);

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

  const parsed = parseLeadIntakeBody(rawBody, deliveryId);

  if (!parsed.ok) {
    console.warn(`lead intake ${deliveryId} rejected: ${parsed.reason}`);

    return new Response({ error: parsed.reason }, { status: parsed.status });
  }

  try {
    await enqueueJobs({
      logicFunctionUniversalIdentifier: LEAD_INTAKE_JOB_UNIVERSAL_IDENTIFIER,
      jobs: [{ jobId: `lead-intake-${deliveryId}`, payload: parsed.payload }],
      retryLimit: LEAD_INTAKE_JOB_RETRY_LIMIT,
    });
  } catch (error) {
    console.error(
      `lead intake ${deliveryId} not enqueued: ${error instanceof Error ? error.message : String(error)}`,
    );

    return new Response({ error: 'unavailable' }, { status: 503 });
  }

  console.log(`lead intake ${deliveryId} (${parsed.payload.form}) accepted ${parsed.payload.submissions.length} submissions`);

  return new Response(
    { deliveryId, accepted: parsed.payload.submissions.length },
    { status: 202 },
  );
};

export default defineLogicFunction({
  universalIdentifier: LEAD_INTAKE_ROUTE_UNIVERSAL_IDENTIFIER,
  name: 'lead-intake-route',
  description:
    'POST /s/integrations/forms/leads: verifies the HMAC signature of a website, gala QR or workshop sign-up delivery and enqueues lead-intake-job',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/integrations/forms/leads',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: [TIMESTAMP_HEADER, SIGNATURE_HEADER, DELIVERY_HEADER],
  },
});
