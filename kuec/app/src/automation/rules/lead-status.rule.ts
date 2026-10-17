import { isDefined } from 'twenty-sdk/utils';

import { toDubaiDateString } from 'src/automation/dates/business-days';
import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

export const NURTURE_REVIEW_AFTER_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

export type StatusEntryLead = {
  status: LeadStatus;
  deadReason: string | null;
  nurtureReviewDate: string | null;
};

export type StatusEntryPlan = {
  changes: Record<string, unknown>;
  needsDeadReason: boolean;
};

// A Nurture lead without a review date would never come back, so it gets one;
// a Dead lead without a reason is asked for one, like a Lost opportunity (W8).
export const planLeadStatusEntry = ({
  lead,
  enteredAt,
}: {
  lead: StatusEntryLead;
  enteredAt: string;
}): StatusEntryPlan => {
  const changes: Record<string, unknown> = { statusEnteredAt: enteredAt };

  if (lead.status === LEAD_STATUS.NURTURE && !isDefined(lead.nurtureReviewDate)) {
    changes.nurtureReviewDate = toDubaiDateString(
      new Date(Date.parse(enteredAt) + NURTURE_REVIEW_AFTER_DAYS * DAY_MS),
    );
  }

  return {
    changes,
    needsDeadReason: lead.status === LEAD_STATUS.DEAD && !isDefined(lead.deadReason),
  };
};
