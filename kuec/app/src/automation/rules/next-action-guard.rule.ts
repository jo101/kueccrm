import { isDefined } from 'twenty-sdk/utils';

import { CLOSED_OPPORTUNITY_STAGES } from 'src/constants/opportunity-stage';

export type NextActionGuardOpportunity = {
  id: string;
  stage: string;
  nextAction: string | null;
  nextActionDate: string | null;
  nextActionFlaggedOn: string | null;
};

// Dates compare as YYYY-MM-DD strings in Asia/Dubai.
export const needsNextActionFlag = (
  opportunity: NextActionGuardOpportunity,
  today: string,
): boolean => {
  if (CLOSED_OPPORTUNITY_STAGES.includes(opportunity.stage)) {
    return false;
  }

  if (opportunity.nextActionFlaggedOn === today) {
    return false;
  }

  return (
    (opportunity.nextAction ?? '').trim().length === 0 ||
    !isDefined(opportunity.nextActionDate) ||
    opportunity.nextActionDate < today
  );
};
