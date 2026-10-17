import { describe, expect, it } from 'vitest';

import {
  buildRecordLink,
  countWords,
} from 'src/automation/notifications/compose-notification-message';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';

const LINK = buildRecordLink(
  'https://crm.uventure.kuec.example/',
  'workPackage',
  '6f3c3a0e-0000-4000-8000-000000000001',
);
const LONG_SUBJECT =
  'Technical assessment of the very long named thermal storage technology for the district cooling partner shortlist';

describe('notification messages', () => {
  it('builds record links without a double slash', () => {
    expect(LINK).toBe(
      'https://crm.uventure.kuec.example/object/workPackage/6f3c3a0e-0000-4000-8000-000000000001',
    );
  });

  it.each(Object.entries(NOTIFICATION_MESSAGES))(
    '%s stays under 20 words and ends with the link',
    (_name, buildMessage) => {
      const message = buildMessage({
        subject: LONG_SUBJECT,
        link: LINK,
        reason: 'Waiting for the researcher to confirm the patent family and the remaining development budget before we continue',
      });

      expect(countWords(message)).toBeLessThan(20);
      expect(message.endsWith(LINK)).toBe(true);
    },
  );

  it('keeps short subjects and reasons whole', () => {
    expect(
      NOTIFICATION_MESSAGES.blocked({
        subject: 'Term sheet',
        reason: 'Legal review pending',
        link: LINK,
      }),
    ).toBe(`Blocked, decision needed: Term sheet. Reason: Legal review pending. ${LINK}`);
  });
});
