import { createHash } from 'node:crypto';

// Generated once. Changing it changes every record id, and a refresh would then
// create duplicates instead of updating the records imported on day one.
const KUEC_IMPORT_NAMESPACE = 'fc6745e1-1344-4916-9ff7-c08080170fe8';

// RFC 9562 version 5: the same natural key always yields the same record id,
// which is what lets a later import update the records instead of adding new ones.
export const recordIdFromKey = (key: string): string => {
  const namespaceBytes = Buffer.from(KUEC_IMPORT_NAMESPACE.replaceAll('-', ''), 'hex');
  const bytes = createHash('sha1')
    .update(Buffer.concat([namespaceBytes, Buffer.from(key, 'utf8')]))
    .digest()
    .subarray(0, 16);

  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
