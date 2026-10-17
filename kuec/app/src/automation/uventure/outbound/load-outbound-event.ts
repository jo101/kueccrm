import { isDefined } from 'twenty-sdk/utils';

import { CRM_BASE_URL_VARIABLE } from 'src/application.config';
import { getRecord, type TwentyApi } from 'src/automation/api/twenty-api';
import { normaliseDomain } from 'src/automation/intake/plan-intake-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type CapabilityRecord,
  type CompanyIdentityRecord,
  type WorkspaceMemberRecord,
} from 'src/automation/records/record-types';
import {
  type OutboundEngagement,
  type OutboundEvent,
  type OutboundLead,
  type OutboundOpportunity,
  type OutboundRelated,
  type OutboundSubject,
  planEngagementOnTechnology,
  planLeadConverted,
  planLicenceSigned,
  UVENTURE_OUTBOUND_EVENT_TYPE,
} from 'src/automation/uventure/outbound/plan-outbound-event';

type RelatedIds = {
  companyId: string | null;
  ownerId: string | null;
  capabilityId?: string | null;
};

const loadRelated = async (api: TwentyApi, ids: RelatedIds): Promise<OutboundRelated> => {
  const [company, owner, capability] = await Promise.all([
    isDefined(ids.companyId)
      ? getRecord<CompanyIdentityRecord>(api.asApplication, OBJECT_NAMES.company, ids.companyId)
      : null,
    isDefined(ids.ownerId)
      ? getRecord<WorkspaceMemberRecord>(api.asApplication, OBJECT_NAMES.workspaceMember, ids.ownerId)
      : null,
    isDefined(ids.capabilityId)
      ? getRecord<CapabilityRecord>(api.asApplication, OBJECT_NAMES.capability, ids.capabilityId)
      : null,
  ]);

  return {
    crmBaseUrl: process.env[CRM_BASE_URL_VARIABLE] ?? '',
    company: isDefined(company)
      ? { name: company.name, domain: normaliseDomain(company.domainName?.primaryLinkUrl ?? null) }
      : null,
    ownerEmail: owner?.userEmail ?? null,
    capability: isDefined(capability)
      ? {
          id: capability.id,
          externalId: capability.externalId,
          kind: capability.kind,
          url: capability.uventureRecord?.primaryLinkUrl ?? null,
        }
      : null,
  };
};

// The event that started the send is only a hint: the record is read again
// and the event is built from what it says now (null: nothing to send).
export const loadOutboundEvent = async (
  api: TwentyApi,
  { type, recordId }: OutboundSubject,
): Promise<OutboundEvent | null> => {
  switch (type) {
    case UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED: {
      const opportunity = await getRecord<OutboundOpportunity & RelatedIds>(
        api.asApplication,
        OBJECT_NAMES.opportunity,
        recordId,
      );

      return isDefined(opportunity)
        ? planLicenceSigned({ opportunity, related: await loadRelated(api, opportunity) })
        : null;
    }
    case UVENTURE_OUTBOUND_EVENT_TYPE.LEAD_CONVERTED_IP_LICENCE: {
      const lead = await getRecord<OutboundLead & RelatedIds>(api.asApplication, OBJECT_NAMES.lead, recordId);

      return isDefined(lead) ? planLeadConverted({ lead, related: await loadRelated(api, lead) }) : null;
    }
    case UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY: {
      const engagement = await getRecord<OutboundEngagement & RelatedIds>(
        api.asApplication,
        OBJECT_NAMES.engagement,
        recordId,
      );

      return isDefined(engagement)
        ? planEngagementOnTechnology({ engagement, related: await loadRelated(api, engagement) })
        : null;
    }
  }
};
