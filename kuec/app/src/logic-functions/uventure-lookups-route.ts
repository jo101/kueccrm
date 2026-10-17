import { defineLogicFunction } from 'twenty-sdk/define';
import { Response, type RoutePayload } from 'twenty-sdk/logic-function';

import {
  UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE,
  UVENTURE_SIGNING_SECRET_VARIABLE,
} from 'src/application.config';
import {
  readHeader,
  SIGNATURE_HEADER,
  TIMESTAMP_HEADER,
  verifySignature,
} from 'src/automation/intake/verify-signature';
import lookupsJson from 'src/playbooks/lookups.json';

export const UVENTURE_LOOKUPS_ROUTE_UNIVERSAL_IDENTIFIER = '24783251-e52d-4c5c-bd96-882059355d7e';

// uVENTURE reads the taxonomy from the app Twenty runs, so both systems use the
// lookups.json of the deployed release (runbooks/21-uventure-readiness.md
// section 3). Signed like every route, over an empty body.
const handler = async (event: RoutePayload) => {
  const check = verifySignature({
    headers: event.headers,
    rawBody: '',
    secrets: [
      process.env[UVENTURE_SIGNING_SECRET_VARIABLE],
      process.env[UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE],
    ],
    now: new Date(),
  });

  if (!check.ok) {
    console.warn(`uventure lookups read refused: ${check.reason}`);

    return new Response(
      { error: check.reason === 'NOT_CONFIGURED' ? 'unavailable' : 'unauthorized' },
      { status: check.reason === 'NOT_CONFIGURED' ? 503 : 401 },
    );
  }

  const etag = `"${lookupsJson.version}"`;

  if (readHeader(event.headers, 'if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(lookupsJson, { status: 200, headers: { ETag: etag } });
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_LOOKUPS_ROUTE_UNIVERSAL_IDENTIFIER,
  name: 'uventure-lookups-route',
  description:
    'GET /s/integrations/uventure/lookups: returns the lookups.json this release ships, with its version as ETag, to a signed uVENTURE request',
  timeoutSeconds: 10,
  handler,
  httpRouteTriggerSettings: {
    path: '/integrations/uventure/lookups',
    httpMethod: 'GET',
    isAuthRequired: false,
    forwardedRequestHeaders: [TIMESTAMP_HEADER, SIGNATURE_HEADER, 'if-none-match'],
  },
});
