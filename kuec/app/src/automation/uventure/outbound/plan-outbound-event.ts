import { isDefined } from 'twenty-sdk/utils';

import { buildRecordLink } from 'src/automation/notifications/compose-notification-message';
import { uventureIdOf } from 'src/automation/uventure/plan-uventure-records';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { CAPABILITY_KIND } from 'src/objects/capability.object';
import { LEAD_STATUS } from 'src/objects/lead.object';

// The three Twenty to uVENTURE contracts (runbooks/21-uventure-readiness.md section 4.3).
export const UVENTURE_OUTBOUND_EVENT_TYPE = {
  LICENCE_OPPORTUNITY_SIGNED: 'crm.licence_opportunity.signed',
  LEAD_CONVERTED_IP_LICENCE: 'crm.lead.converted_ip_licence',
  ENGAGEMENT_ON_TECHNOLOGY: 'crm.engagement.technology_referenced',
} as const;

export type UventureOutboundEventType =
  (typeof UVENTURE_OUTBOUND_EVENT_TYPE)[keyof typeof UVENTURE_OUTBOUND_EVENT_TYPE];

export type OutboundSubject = { type: UventureOutboundEventType; recordId: string };

export type OutboundEvent = {
  deliveryId: string;
  body: {
    eventId: string;
    type: UventureOutboundEventType;
    occurredAt: string;
    data: Record<string, unknown>;
  };
};

type CompanyRef = { name: string | null; domain: string | null } | null;

type CapabilityRef = {
  id: string;
  externalId: string | null;
  kind: string | null;
  url: string | null;
} | null;

export type OutboundRelated = {
  crmBaseUrl: string;
  company: CompanyRef;
  ownerEmail: string | null;
  capability: CapabilityRef;
};

type LinksValue = { primaryLinkUrl: string | null } | null;

export type OutboundOpportunity = {
  id: string;
  name: string | null;
  stage: string;
  playbookType: string | null;
  stageEnteredAt: string | null;
  amount: { amountMicros: number | null; currencyCode: string | null } | null;
  uventureRecord: LinksValue;
  updatedAt: string;
};

export type OutboundLead = {
  id: string;
  name: string | null;
  status: string;
  offeringInterest: string[] | null;
  convertedOpportunityId: string | null;
  uventureRecord: LinksValue;
  updatedAt: string;
};

export type OutboundEngagement = {
  id: string;
  name: string | null;
  kind: string | null;
  date: string | null;
  outcome: string | null;
  updatedAt: string;
};

// Technologies and disclosures are what uVENTURE tracks interest in; a lab
// or equipment engagement stays in Twenty.
const TECHNOLOGY_KINDS: string[] = [
  CAPABILITY_KIND.TECHNOLOGY,
  CAPABILITY_KIND.INVENTION_DISCLOSURE,
];

const technologyOf = (capability: CapabilityRef) => {
  const uventureId = uventureIdOf(capability?.externalId ?? null);

  return isDefined(uventureId)
    ? { uventureId, uventureUrl: capability?.url ?? null }
    : null;
};

const companyOf = (company: CompanyRef) =>
  isDefined(company) ? { name: company.name, domain: company.domain } : null;

const build = (
  deliveryId: string,
  type: UventureOutboundEventType,
  occurredAt: string,
  data: Record<string, unknown>,
): OutboundEvent => ({
  deliveryId,
  body: { eventId: deliveryId, type, occurredAt, data },
});

const DELIVERY_PREFIX: Record<UventureOutboundEventType, string> = {
  [UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED]: 'crm-licence-signed',
  [UVENTURE_OUTBOUND_EVENT_TYPE.LEAD_CONVERTED_IP_LICENCE]: 'crm-lead-converted',
  [UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY]: 'crm-engagement',
};

// The delivery id is fixed per record, so a resend, a retry or the daily
// repair all carry the same id and uVENTURE stores the event once.
export const outboundDeliveryId = ({ type, recordId }: OutboundSubject): string =>
  `${DELIVERY_PREFIX[type]}-${recordId}`;

export const planLicenceSigned = ({
  opportunity,
  related,
}: {
  opportunity: OutboundOpportunity;
  related: OutboundRelated;
}): OutboundEvent | null => {
  if (
    opportunity.stage !== OPPORTUNITY_STAGE.SIGNED ||
    opportunity.playbookType !== OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING
  ) {
    return null;
  }

  const type = UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED;
  const amount = opportunity.amount;

  return build(outboundDeliveryId({ type, recordId: opportunity.id }), type, opportunity.updatedAt, {
    crmOpportunityId: opportunity.id,
    crmUrl: buildRecordLink(related.crmBaseUrl, 'opportunity', opportunity.id),
    name: opportunity.name,
    signedAt: opportunity.stageEnteredAt,
    technology: technologyOf(related.capability),
    uventureRecordUrl: opportunity.uventureRecord?.primaryLinkUrl ?? null,
    licensee: companyOf(related.company),
    ownerEmail: related.ownerEmail,
    value:
      isDefined(amount?.amountMicros) && isDefined(amount?.currencyCode)
        ? { amount: amount.amountMicros / 1_000_000, currency: amount.currencyCode }
        : null,
  });
};

export const planLeadConverted = ({
  lead,
  related,
}: {
  lead: OutboundLead;
  related: OutboundRelated;
}): OutboundEvent | null => {
  if (
    lead.status !== LEAD_STATUS.CONVERTED ||
    !(lead.offeringInterest ?? []).includes(OPPORTUNITY_OFFERING.IP_LICENCE)
  ) {
    return null;
  }

  const type = UVENTURE_OUTBOUND_EVENT_TYPE.LEAD_CONVERTED_IP_LICENCE;

  return build(outboundDeliveryId({ type, recordId: lead.id }), type, lead.updatedAt, {
    crmLeadId: lead.id,
    crmOpportunityId: lead.convertedOpportunityId,
    crmUrl: buildRecordLink(related.crmBaseUrl, 'lead', lead.id),
    name: lead.name,
    offeringInterest: lead.offeringInterest,
    uventureRecordUrl: lead.uventureRecord?.primaryLinkUrl ?? null,
    company: companyOf(related.company),
    ownerEmail: related.ownerEmail,
  });
};

export const planEngagementOnTechnology = ({
  engagement,
  related,
}: {
  engagement: OutboundEngagement;
  related: OutboundRelated;
}): OutboundEvent | null => {
  const technology = technologyOf(related.capability);

  if (!isDefined(technology) || !TECHNOLOGY_KINDS.includes(related.capability?.kind ?? '')) {
    return null;
  }

  const type = UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY;

  // One event per engagement and technology: a different technology is a new fact.
  return build(
    outboundDeliveryId({ type, recordId: `${engagement.id}-${related.capability?.id}` }),
    type,
    engagement.updatedAt,
    {
      crmEngagementId: engagement.id,
      crmUrl: buildRecordLink(related.crmBaseUrl, 'engagement', engagement.id),
      name: engagement.name,
      kind: engagement.kind,
      date: engagement.date,
      outcome: engagement.outcome,
      technology,
      company: companyOf(related.company),
      ownerEmail: related.ownerEmail,
    },
  );
};
