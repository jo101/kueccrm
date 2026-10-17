import { isDefined } from 'twenty-sdk/utils';

import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

export const QUALIFICATION_CHECK_FIELD_NAMES = [
  'needIdentified',
  'decisionMakerReached',
  'capabilityMatched',
  'fundingPathIdentified',
  'timingKnown',
] as const;

export type QualificationChecks = Record<
  (typeof QUALIFICATION_CHECK_FIELD_NAMES)[number],
  boolean | null
>;

export const QUALIFIED_AT_SCORE = 4;

// A dead or converted lead is a person's decision; ticking checks on it later
// updates the score only.
const QUALIFIABLE_STATUSES: LeadStatus[] = [
  LEAD_STATUS.NEW,
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.ENGAGED,
  LEAD_STATUS.NURTURE,
];

export type CurrencyAmount = {
  amountMicros: number | string | null;
  currencyCode: string | null;
} | null;

export type QualificationLead = QualificationChecks & {
  status: LeadStatus;
  qualificationScore: number | null;
  offeringInterest: string[] | null;
  estimatedValue: CurrencyAmount;
};

export const computeQualificationScore = (checks: QualificationChecks): number =>
  QUALIFICATION_CHECK_FIELD_NAMES.filter((name) => checks[name] === true).length;

export const toAmount = (value: CurrencyAmount): number | null => {
  if (!isDefined(value) || !isDefined(value.amountMicros)) {
    return null;
  }

  const micros = Number(value.amountMicros);

  return Number.isFinite(micros) ? micros / 1_000_000 : null;
};

// Licence-grade: the ED hears about every qualified lead that wants an IP
// licence, and about any whose estimate passes the threshold the ED set.
export const isLicenceGradeLead = (
  lead: Pick<QualificationLead, 'offeringInterest' | 'estimatedValue'>,
  edValueThreshold: number | null,
): boolean => {
  if ((lead.offeringInterest ?? []).includes(OPPORTUNITY_OFFERING.IP_LICENCE)) {
    return true;
  }

  const amount = toAmount(lead.estimatedValue);

  return isDefined(edValueThreshold) && isDefined(amount) && amount > edValueThreshold;
};

export type QualificationPlan = {
  score: number;
  scoreChanged: boolean;
  qualify: boolean;
};

export const planQualification = (lead: QualificationLead): QualificationPlan => {
  const score = computeQualificationScore(lead);

  return {
    score,
    scoreChanged: lead.qualificationScore !== score,
    qualify:
      score >= QUALIFIED_AT_SCORE && QUALIFIABLE_STATUSES.includes(lead.status),
  };
};
