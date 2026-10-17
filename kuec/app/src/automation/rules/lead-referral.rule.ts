import { isDefined } from 'twenty-sdk/utils';

import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

const THANK_ON_STATUSES: LeadStatus[] = [LEAD_STATUS.QUALIFIED, LEAD_STATUS.CONVERTED];

export type ReferralLead = {
  id: string;
  ownerId: string | null;
  referredById: string | null;
  referredByMemberId: string | null;
  referralCreditedAt: string | null;
};

export const hasReferrer = (lead: ReferralLead): boolean =>
  isDefined(lead.referredById) || isDefined(lead.referredByMemberId);

// L6. One thank-you per status, so Qualified and then Converted each get one
// and a cross-sell conversion of the same lead does not ask again.
export const planReferralThanks = ({
  lead,
  previousStatus,
  status,
}: {
  lead: ReferralLead;
  previousStatus: LeadStatus;
  status: LeadStatus;
}): { dedupeKey: string } | null =>
  previousStatus !== status && THANK_ON_STATUSES.includes(status) && hasReferrer(lead)
    ? { dedupeKey: `lead-referral-thanks:${lead.id}:${status}` }
    : null;

export type ReferralCreditPlan = {
  // Only the first signed opportunity stamps the lead: the dashboard counts
  // credited leads, one line per lead.
  changes: Record<string, unknown> | null;
  notePersonId: string | null;
  dedupeKey: string;
};

// The Note goes on the referrer's Person record. A colleague has no record of
// their own, so their credit is the Note on the lead and the dashboard line.
export const planReferralCredit = ({
  lead,
  opportunityId,
  now,
}: {
  lead: ReferralLead;
  opportunityId: string;
  now: Date;
}): ReferralCreditPlan | null => {
  if (!hasReferrer(lead)) {
    return null;
  }

  return {
    changes: isDefined(lead.referralCreditedAt)
      ? null
      : { referralCreditedAt: now.toISOString() },
    notePersonId: lead.referredById,
    dedupeKey: `lead-referral-credit:${lead.id}:${opportunityId}`,
  };
};
