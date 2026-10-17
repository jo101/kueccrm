import { isDefined } from 'twenty-sdk/utils';

import {
  addBusinessDays,
  type HolidaySet,
} from 'src/automation/dates/business-days';
import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

export const CONTACT_NUDGE_AFTER_BUSINESS_DAYS = 3;
export const CONTACT_ED_AFTER_BUSINESS_DAYS = 7;

export type ContactSlaLevel = 1 | 2;

export type ContactSlaLead = {
  id: string;
  status: LeadStatus;
  statusEnteredAt: string | null;
  createdAt: string;
  contactNudgeSentAt: string | null;
  contactEdNotifiedAt: string | null;
};

export type ContactSlaEscalation = {
  level: ContactSlaLevel;
  anchorAt: string;
  fireAt: Date;
  dedupeKey: string;
  stampField: 'contactNudgeSentAt' | 'contactEdNotifiedAt';
};

const firedSince = (stamp: string | null, anchorAt: string): boolean =>
  isDefined(stamp) && Date.parse(stamp) > Date.parse(anchorAt);

// L2. The clock is the time the lead entered New. A level has fired for this
// clock when its stamp is later than the anchor, so a lead moved back to New
// starts a fresh clock and a repeat sweep sends nothing.
export const planContactSlaEscalations = ({
  lead,
  holidays,
  now,
}: {
  lead: ContactSlaLead;
  holidays: HolidaySet;
  now: Date;
}): ContactSlaEscalation[] => {
  if (lead.status !== LEAD_STATUS.NEW) {
    return [];
  }

  const anchorAt = lead.statusEnteredAt ?? lead.createdAt;
  const anchor = new Date(anchorAt);
  const levels = [
    {
      level: 1 as const,
      businessDays: CONTACT_NUDGE_AFTER_BUSINESS_DAYS,
      stamp: lead.contactNudgeSentAt,
      stampField: 'contactNudgeSentAt' as const,
    },
    {
      level: 2 as const,
      businessDays: CONTACT_ED_AFTER_BUSINESS_DAYS,
      stamp: lead.contactEdNotifiedAt,
      stampField: 'contactEdNotifiedAt' as const,
    },
  ];

  return levels
    .filter(({ stamp }) => !firedSince(stamp, anchorAt))
    .map(({ level, businessDays, stampField }) => ({
      level,
      anchorAt,
      fireAt: addBusinessDays(anchor, businessDays, holidays),
      dedupeKey: `lead-contact-${lead.id}-${anchor.getTime()}-l${level}`,
      stampField,
    }))
    .filter(({ fireAt }) => fireAt.getTime() <= now.getTime());
};
