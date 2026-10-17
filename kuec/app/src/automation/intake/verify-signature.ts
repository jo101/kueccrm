import { createHmac, timingSafeEqual } from 'node:crypto';

import { isNonEmptyString } from '@sniptt/guards';

export const TIMESTAMP_HEADER = 'x-kuec-timestamp';
export const SIGNATURE_HEADER = 'x-kuec-signature';
export const DELIVERY_HEADER = 'x-kuec-delivery';
export const SIGNATURE_TOLERANCE_SECONDS = 300;

const SIGNATURE_VERSION = 'v1';

export type SignatureCheck =
  | { ok: true }
  | {
      ok: false;
      reason: 'NOT_CONFIGURED' | 'MISSING_HEADER' | 'STALE_TIMESTAMP' | 'BAD_SIGNATURE';
    };

export const readHeader = (
  headers: Record<string, string | undefined>,
  name: string,
): string | null => {
  const value = Object.entries(headers).find(([key]) => key.toLowerCase() === name)?.[1];

  return isNonEmptyString(value) ? value.trim() : null;
};

// runbooks/16-integration-map.md section 2.4: HMAC-SHA256 over the timestamp,
// a dot and the raw body, never over a re-serialised body.
export const signDelivery = ({
  secret,
  timestamp,
  rawBody,
}: {
  secret: string;
  timestamp: string;
  rawBody: string;
}): string =>
  `${SIGNATURE_VERSION}=${createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')}`;

const isSameSignature = (expected: string, received: string): boolean => {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

// Checked against the current secret, then the previous one, so a rotation
// does not drop a delivery signed a moment before.
export const verifySignature = ({
  headers,
  rawBody,
  secrets,
  now,
}: {
  headers: Record<string, string | undefined>;
  rawBody: string;
  secrets: (string | null | undefined)[];
  now: Date;
}): SignatureCheck => {
  const configuredSecrets = secrets.filter(isNonEmptyString);

  if (configuredSecrets.length === 0) {
    return { ok: false, reason: 'NOT_CONFIGURED' };
  }

  const timestamp = readHeader(headers, TIMESTAMP_HEADER);
  const signature = readHeader(headers, SIGNATURE_HEADER);

  if (timestamp === null || signature === null) {
    return { ok: false, reason: 'MISSING_HEADER' };
  }

  const timestampSeconds = /^\d{1,12}$/.test(timestamp) ? Number(timestamp) : Number.NaN;

  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(now.getTime() / 1000 - timestampSeconds) > SIGNATURE_TOLERANCE_SECONDS
  ) {
    return { ok: false, reason: 'STALE_TIMESTAMP' };
  }

  return configuredSecrets.some((secret) =>
    isSameSignature(signDelivery({ secret, timestamp, rawBody }), signature),
  )
    ? { ok: true }
    : { ok: false, reason: 'BAD_SIGNATURE' };
};
