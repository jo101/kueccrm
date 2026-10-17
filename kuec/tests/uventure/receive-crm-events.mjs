// A stand-in for uVENTURE's endpoint on staging: verifies the signature of each
// event Twenty sends and prints it (runbooks/21-uventure-readiness.md section 4.5).
//
//   UVENTURE_OUTBOUND_SIGNING_SECRET=... PORT=8787 node kuec/tests/uventure/receive-crm-events.mjs
//
// Point the staging app variable UVENTURE_WEBHOOK_URL at http(s)://<this host>:<port>/integrations/crm/events.
// RESPOND_WITH=500 makes it fail, to watch the retries; RESPOND_WITH=400 to see a permanent failure.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const secret = process.env.UVENTURE_OUTBOUND_SIGNING_SECRET;
const port = Number(process.env.PORT ?? 8787);
const respondWith = Number(process.env.RESPOND_WITH ?? 202);
const seen = new Set();

if (!secret) {
  console.error('set UVENTURE_OUTBOUND_SIGNING_SECRET');
  process.exit(2);
}

const isValid = (timestamp, rawBody, signature) => {
  const expected = Buffer.from(`v1=${createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')}`);
  const received = Buffer.from(signature ?? '');
  const fresh = Math.abs(Date.now() / 1000 - Number(timestamp)) <= 300;

  return fresh && expected.length === received.length && timingSafeEqual(expected, received);
};

createServer((request, response) => {
  let rawBody = '';

  request.on('data', (chunk) => (rawBody += chunk));
  request.on('end', () => {
    const delivery = request.headers['x-kuec-delivery'];
    const valid = isValid(request.headers['x-kuec-timestamp'], rawBody, request.headers['x-kuec-signature']);

    if (!valid) {
      console.log(`401 ${delivery}: bad or stale signature`);
      response.writeHead(401).end();

      return;
    }

    const duplicate = seen.has(delivery);

    seen.add(delivery);
    console.log(`${respondWith} ${delivery}${duplicate ? ' (duplicate)' : ''}: ${rawBody}`);
    response.writeHead(respondWith, { 'content-type': 'application/json' }).end('{}');
  });
}).listen(port, () => console.log(`listening on ${port}`));
