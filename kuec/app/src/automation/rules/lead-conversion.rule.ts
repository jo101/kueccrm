import { isDefined } from 'twenty-sdk/utils';

import { type CurrencyAmount } from 'src/automation/rules/lead-qualification.rule';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { OPPORTUNITY_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

type OpportunityTypeValue = (typeof OPPORTUNITY_TYPE)[keyof typeof OPPORTUNITY_TYPE];
type OfferingValue = (typeof OPPORTUNITY_OFFERING)[keyof typeof OPPORTUNITY_OFFERING];

// Listed in the Offering list's order: with several offerings the first one
// here decides the type, so an IP licence interest always makes a Licence case.
export const OPPORTUNITY_TYPE_BY_OFFERING: [OfferingValue, OpportunityTypeValue][] = [
  [OPPORTUNITY_OFFERING.IP_LICENCE, OPPORTUNITY_TYPE.TECHNOLOGY_LICENSING],
  [OPPORTUNITY_OFFERING.TECHNICAL_SERVICE, OPPORTUNITY_TYPE.RFQ_TECHNICAL_SERVICE],
  [OPPORTUNITY_OFFERING.LAB_TESTING, OPPORTUNITY_TYPE.LAB_TESTING],
  [OPPORTUNITY_OFFERING.EQUIPMENT_ACCESS, OPPORTUNITY_TYPE.EQUIPMENT_OR_FACILITY_ACCESS],
  [OPPORTUNITY_OFFERING.RESEARCH_COLLABORATION, OPPORTUNITY_TYPE.RESEARCH_COLLABORATION],
  [OPPORTUNITY_OFFERING.STARTUP_PRODUCT, OPPORTUNITY_TYPE.PLATFORM_OR_PRODUCT_DELIVERY],
  [OPPORTUNITY_OFFERING.SUBSIDIARY_SERVICE, OPPORTUNITY_TYPE.PLATFORM_OR_PRODUCT_DELIVERY],
  [OPPORTUNITY_OFFERING.SPONSORED_CHAIR, OPPORTUNITY_TYPE.SPONSORED_CHAIR],
  [OPPORTUNITY_OFFERING.LEASING, OPPORTUNITY_TYPE.LEASING],
  [OPPORTUNITY_OFFERING.TRAINING, OPPORTUNITY_TYPE.TRAINING_OR_BOOTCAMP],
  [OPPORTUNITY_OFFERING.ADVISORY, OPPORTUNITY_TYPE.CONSULTING_OR_ADVISORY],
  [OPPORTUNITY_OFFERING.OTHER, OPPORTUNITY_TYPE.OTHER],
];

export const pickOpportunityType = (
  offeringInterest: string[] | null,
): OpportunityTypeValue | null =>
  OPPORTUNITY_TYPE_BY_OFFERING.find(([offering]) =>
    (offeringInterest ?? []).includes(offering),
  )?.[1] ?? null;

export type ConvertibleLead = {
  id: string;
  name: string | null;
  status: LeadStatus;
  source: string | null;
  need: string | null;
  offeringInterest: string[] | null;
  department: string | null;
  estimatedValue: CurrencyAmount;
  nextAction: string | null;
  nextActionDate: string | null;
  otherDetails: string | null;
  ownerId: string | null;
  companyId: string | null;
  personId: string | null;
  convertedOpportunityId: string | null;
  statusEnteredAt: string | null;
  lastConvertedAt: string | null;
};

// Each move into Converted is one conversion. It is done once the lead's
// latest conversion stamp is at or after the moment the lead became Converted,
// which is what lets the same lead convert again for cross-sell.
export const needsConversion = (
  lead: ConvertibleLead,
  convertedSince: string | null,
): boolean => {
  if (lead.status !== LEAD_STATUS.CONVERTED) {
    return false;
  }

  if (!isDefined(lead.convertedOpportunityId) || !isDefined(lead.lastConvertedAt)) {
    return true;
  }

  return (
    isDefined(convertedSince) &&
    Date.parse(lead.lastConvertedAt) < Date.parse(convertedSince)
  );
};

const nonEmpty = (text: string | null): string | null =>
  isDefined(text) && text.trim().length > 0 ? text : null;

// Stage Qualify is the NEW value relabelled (config/dashboards/opportunity-stages.md).
// The type is set by a second update after creation so W1 starts the playbook:
// W1 never reacts to a record created with its type (runbooks/04-automation.md).
export const buildConvertedOpportunity = (
  lead: ConvertibleLead,
): { create: Record<string, unknown>; playbookType: OpportunityTypeValue | null } => {
  const create: Record<string, unknown> = {
    name: nonEmpty(lead.name) ?? 'Converted lead',
    stage: OPPORTUNITY_STAGE.NEW,
    leadId: lead.id,
    ownerId: lead.ownerId,
    companyId: lead.companyId,
    pointOfContactId: lead.personId,
    description: nonEmpty(lead.need),
    nextAction: nonEmpty(lead.nextAction),
    nextActionDate: lead.nextActionDate,
  };

  if (isDefined(lead.source)) {
    create.source = lead.source;
  }

  if (isDefined(lead.department)) {
    create.department = lead.department;
  }

  if ((lead.offeringInterest ?? []).length > 0) {
    create.offering = lead.offeringInterest;
  }

  if (isDefined(lead.estimatedValue?.amountMicros)) {
    create.amount = {
      amountMicros: lead.estimatedValue.amountMicros,
      currencyCode: lead.estimatedValue.currencyCode ?? 'AED',
    };
  }

  if (isDefined(nonEmpty(lead.otherDetails))) {
    create.otherDetails = lead.otherDetails;
  }

  return { create, playbookType: pickOpportunityType(lead.offeringInterest) };
};
