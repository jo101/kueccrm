// Signs a fixture and posts it to the uVENTURE route of a Twenty instance, as
// uVENTURE would (runbooks/21-uventure-readiness.md section 4.5). Staging only.
//
//   UVENTURE_SIGNING_SECRET=... node kuec/tests/uventure/send-delivery.mjs \
//     https://crm-staging.uventure.kuec.example fixtures/u1-technology-created.json [--stale] [--bad-signature]
//
// The secret comes from the secrets manager (twenty/staging/UVENTURE_SIGNING_SECRET);
// never type it into a file. Placeholders in the fixture: {{now}} (ISO time),
// {{run}} (env RUN_ID, the same for every page of one snapshot), {{opportunityId}}
// (env OPPORTUNITY_ID). A fixture with "method": "GET" is signed over an empty body.
import { createHmac, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [baseUrl, fixturePath, ...flags] = process.argv.slice(2);
const secret = process.env.UVENTURE_SIGNING_SECRET;

if (!baseUrl || !fixturePath || !secret) {
  console.error('usage: UVENTURE_SIGNING_SECRET=... node send-delivery.mjs <crm-base-url> <fixture.json> [--stale] [--bad-signature]');
  process.exit(2);
}

const runId = process.env.RUN_ID ?? `staging-${Date.now()}`;
const rawBody = readFileSync(resolve(fixturePath), 'utf8')
  .replaceAll('{{now}}', new Date().toISOString())
  .replaceAll('{{run}}', runId)
  .replaceAll('{{opportunityId}}', process.env.OPPORTUNITY_ID ?? '00000000-0000-4000-8000-000000000000');
const body = JSON.parse(rawBody);
const path = body.path ?? '/s/integrations/uventure/events';
const method = body.method ?? 'POST';
const payload = method === 'GET' ? '' : JSON.stringify(body.delivery);
const timestamp = String(Math.floor(Date.now() / 1000) - (flags.includes('--stale') ? 600 : 0));
const signature = `v1=${createHmac('sha256', flags.includes('--bad-signature') ? `${secret}x` : secret)
  .update(`${timestamp}.${payload}`)
  .digest('hex')}`;
const deliveryId = process.env.DELIVERY_ID ?? `staging-${randomUUID()}`;

const response = await fetch(`${baseUrl.replace(/\/+$/, '')}${path}`, {
  method,
  headers: {
    'content-type': 'application/json',
    'x-kuec-timestamp': timestamp,
    'x-kuec-signature': signature,
    'x-kuec-delivery': deliveryId,
  },
  ...(method === 'GET' ? {} : { body: payload }),
});
const text = await response.text();

console.log(`${response.status} ${deliveryId} ${method === 'GET' ? `${text.length} bytes, ETag ${response.headers.get('etag')}` : text}`);
process.exit(response.ok ? 0 : 1);
