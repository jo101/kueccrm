import { isDefined } from 'twenty-sdk/utils';

import {
  normaliseDomain,
  normaliseEmail,
  type IntakeLeadPlan,
} from 'src/automation/intake/plan-intake-lead';
import {
  type AgreementData,
  CHALLENGE_PROGRAMME_SOURCE,
  type CapabilityData,
  type ChallengeData,
} from 'src/automation/uventure/uventure-payload';
import {
  CAPABILITY_SOURCE_SYSTEM,
  CAPABILITY_STATUS,
  type CapabilityStatus,
} from 'src/objects/capability.object';
import {
  CONTRACT_SOURCE_SYSTEM,
  CONTRACT_STATUS,
} from 'src/objects/contract.object';
import { LEAD_SOURCE_SYSTEM, LEAD_STATUS } from 'src/objects/lead.object';

export const UVENTURE_LINK_LABEL = 'uVENTURE';

// One prefix for every record the feed owns, so ids from two systems never
// collide in a unique column (runbooks/16-integration-map.md section 2.2).
export const uventureExternalId = (uventureId: string): string => `uventure:${uventureId}`;

export const uventureIdOf = (externalId: string | null): string | null =>
  externalId?.startsWith('uventure:') === true ? externalId.slice('uventure:'.length) : null;

const toLinks = (url: string) => ({
  primaryLinkUrl: url,
  primaryLinkLabel: UVENTURE_LINK_LABEL,
});

// Events apply in the order they happened in uVENTURE: a late retry of an older
// event never overwrites a newer one. Equal times apply again, harmlessly.
export const isStaleEvent = (occurredAt: string, lastAppliedAt: string | null): boolean =>
  isDefined(lastAppliedAt) && Date.parse(occurredAt) < Date.parse(lastAppliedAt);

// A pointer uVENTURE has not listed for this long shows in "Not seen in
// uVENTURE for 7 days" for the case owners to check.
export const STALE_AFTER_DAYS = 7;

export type CapabilityState = {
  id: string;
  name: string | null;
  kind: string | null;
  status: CapabilityStatus | null;
  uventureRecord: { primaryLinkUrl: string | null } | null;
  otherDetails: string | null;
};

export type CapabilityPlan =
  | { action: 'create'; values: Record<string, unknown>; statusChange: null }
  | {
      action: 'update' | 'touch';
      recordId: string;
      values: Record<string, unknown>;
      statusChange: { from: CapabilityStatus | null; to: CapabilityStatus } | null;
    };

// Every event proves the record still exists in uVENTURE, so each one moves
// Last seen; only the fields the event carries are compared and written.
export const planCapabilityUpsert = ({
  capability,
  existing,
  now,
}: {
  capability: CapabilityData;
  existing: CapabilityState | null;
  now: Date;
}): CapabilityPlan => {
  const seen = {
    lastSeenInUventureAt: now.toISOString(),
    staleFrom: new Date(now.getTime() + STALE_AFTER_DAYS * 86_400_000).toISOString(),
  };
  const owned: Record<string, unknown> = {
    name: capability.title,
    kind: capability.kind,
    uventureRecord: toLinks(capability.url),
    ...(isDefined(capability.otherDetails) ? { otherDetails: capability.otherDetails } : {}),
  };

  if (!isDefined(existing)) {
    return {
      action: 'create',
      values: {
        ...owned,
        ...(isDefined(capability.status)
          ? { status: capability.status, statusChangedAt: now.toISOString() }
          : {}),
        externalId: uventureExternalId(capability.id),
        sourceSystem: CAPABILITY_SOURCE_SYSTEM.UVENTURE,
        ...seen,
      },
      statusChange: null,
    };
  }

  const changed: Record<string, unknown> = {};

  if (existing.name !== capability.title) {
    changed.name = capability.title;
  }

  if (existing.kind !== capability.kind) {
    changed.kind = capability.kind;
  }

  if (existing.uventureRecord?.primaryLinkUrl !== capability.url) {
    changed.uventureRecord = owned.uventureRecord;
  }

  if (isDefined(capability.otherDetails) && existing.otherDetails !== capability.otherDetails) {
    changed.otherDetails = capability.otherDetails;
  }

  const statusChange =
    isDefined(capability.status) && existing.status !== capability.status
      ? { from: existing.status, to: capability.status }
      : null;

  if (isDefined(statusChange)) {
    changed.status = statusChange.to;
    changed.statusChangedAt = now.toISOString();
  }

  return {
    action: Object.keys(changed).length > 0 ? 'update' : 'touch',
    recordId: existing.id,
    values: { ...changed, ...seen },
    statusChange,
  };
};

const STATUSES_THAT_STOP_AN_OFFER: CapabilityStatus[] = [
  CAPABILITY_STATUS.UNAVAILABLE,
  CAPABILITY_STATUS.WITHDRAWN,
];

// Case owners hear when what they are selling stops being on offer, not on
// every listing change.
export const stopsAnOffer = (statusChange: CapabilityPlan['statusChange']): boolean =>
  isDefined(statusChange) && STATUSES_THAT_STOP_AN_OFFER.includes(statusChange.to);

export type ContractState = {
  id: string;
  kind: string | null;
  externalId: string | null;
  opportunityId: string | null;
  counterpartyId: string | null;
  capabilityId: string | null;
  ownerId: string | null;
};

export type ContractLinks = {
  opportunity: { id: string; ownerId: string | null; companyId: string | null } | null;
  counterpartyId: string | null;
  capabilityId: string | null;
};

export type ContractPlan = {
  action: 'create' | 'update' | 'adopt';
  recordId: string | null;
  values: Record<string, unknown>;
  // Nobody owns it or no case matched: the ops coordinator links it by hand.
  needsLinking: boolean;
};

// uVENTURE owns what was signed: kind, status, dates, value and the link. The
// links to the case, the counterparty and the technology are matched and set
// only where empty, so a person's correction stands.
export const planContractUpsert = ({
  agreement,
  existing,
  placeholder,
  links,
}: {
  agreement: AgreementData;
  existing: ContractState | null;
  placeholder: ContractState | null;
  links: ContractLinks;
}): ContractPlan => {
  const owned: Record<string, unknown> = {
    name: agreement.title,
    kind: agreement.agreementType,
    status: CONTRACT_STATUS.SIGNED,
    signedOn: agreement.signedOn,
    expiresOn: agreement.expiresOn,
    uventureRecord: toLinks(agreement.url),
    externalId: uventureExternalId(agreement.id),
    sourceSystem: CONTRACT_SOURCE_SYSTEM.UVENTURE,
    ...(isDefined(agreement.value) ? { value: agreement.value } : {}),
  };
  const target = existing ?? placeholder;
  const fillIfEmpty = (field: keyof ContractState, value: string | null | undefined) =>
    isDefined(value) && !isDefined(target?.[field]) ? { [field]: value } : {};
  const matched = {
    ...fillIfEmpty('opportunityId', links.opportunity?.id),
    ...fillIfEmpty('counterpartyId', links.counterpartyId ?? links.opportunity?.companyId),
    ...fillIfEmpty('capabilityId', links.capabilityId),
    ...fillIfEmpty('ownerId', links.opportunity?.ownerId),
  };
  const values = { ...owned, ...matched };
  const merged = { ...target, ...matched };

  return {
    action: isDefined(existing) ? 'update' : isDefined(placeholder) ? 'adopt' : 'create',
    recordId: target?.id ?? null,
    values,
    needsLinking: !isDefined(merged.opportunityId) || !isDefined(merged.ownerId),
  };
};

// A challenge becomes a lead like a form submission does, with the programme
// as its source and the challenge's page as its uVENTURE record.
export const planChallengeLead = (challenge: ChallengeData): IntakeLeadPlan => {
  const externalId = uventureExternalId(challenge.id);
  const email = normaliseEmail(challenge.contact?.email ?? null);
  const personName = [challenge.contact?.firstName, challenge.contact?.lastName]
    .filter(isDefined)
    .join(' ');
  const domain = normaliseDomain(challenge.companyWebsite);
  const companyName = challenge.companyName ?? domain;

  return {
    externalId,
    lead: {
      name: [challenge.title, companyName].filter(isDefined).join(', '),
      status: LEAD_STATUS.NEW,
      source: CHALLENGE_PROGRAMME_SOURCE[challenge.programme],
      sourceSystem: LEAD_SOURCE_SYSTEM.UVENTURE,
      externalId,
      need: [challenge.title, challenge.description].filter(isDefined).join('\n\n'),
      uventureRecord: toLinks(challenge.url),
      ...(challenge.offeringInterest.length > 0
        ? { offeringInterest: challenge.offeringInterest }
        : {}),
    },
    person:
      personName.length > 0 || isDefined(email)
        ? {
            firstName: challenge.contact?.firstName ?? '',
            lastName: challenge.contact?.lastName ?? '',
            email,
            jobTitle: challenge.contact?.jobTitle ?? null,
          }
        : null,
    company: isDefined(companyName) ? { name: companyName, domain } : null,
  };
};
