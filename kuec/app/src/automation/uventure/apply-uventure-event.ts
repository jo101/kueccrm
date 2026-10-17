import { kv } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { type AutomationContext } from 'src/automation/api/load-automation-context';
import {
  createRecord,
  getRecord,
  listRecords,
  type TwentyApi,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { normaliseDomain } from 'src/automation/intake/plan-intake-lead';
import {
  findOrCreateCompany,
  recordIntakeLead,
  recordPlannedLead,
} from 'src/automation/intake/record-intake-lead';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import { notifyMembers, recordLinkFor } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type CapabilityRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import {
  type ContractState,
  isStaleEvent,
  planCapabilityUpsert,
  planChallengeLead,
  planContractUpsert,
  stopsAnOffer,
  uventureExternalId,
} from 'src/automation/uventure/plan-uventure-records';
import {
  type AgreementData,
  type CapabilityData,
  UVENTURE_EVENT_TYPE,
  type UventureEvent,
} from 'src/automation/uventure/uventure-payload';
import { CLOSED_OPPORTUNITY_STAGES } from 'src/constants/opportunity-stage';

export type UventureEventOutcome =
  | 'created'
  | 'updated'
  | 'unchanged'
  | 'stale';

// The time of the newest event applied to each record, so an older event that
// arrives late (a retry, a replay) is skipped (runbooks/21-uventure-readiness.md
// section 4.4).
const appliedKey = (objectName: string, externalId: string): string =>
  `uventure:applied:${objectName}:${externalId}`;

const isStale = async (objectName: string, externalId: string, occurredAt: string) =>
  isStaleEvent(occurredAt, await kv.get<string>(appliedKey(objectName, externalId)));

const markApplied = async (objectName: string, externalId: string, occurredAt: string) => {
  const key = appliedKey(objectName, externalId);
  const previous = await kv.get<string>(key);

  if (!isStaleEvent(occurredAt, previous)) {
    await kv.set(key, occurredAt);
  }
};

const findByExternalId = async <TRecord>(
  api: TwentyApi,
  objectName: keyof typeof OBJECT_NAMES,
  externalId: string,
): Promise<TRecord | null> => {
  const [record] = await listRecords<TRecord>(
    api.asApplication,
    OBJECT_NAMES[objectName],
    `externalId[eq]:"${externalId}"`,
  );

  return record ?? null;
};

const notifyCaseOwners = async ({
  api,
  capabilityId,
  dedupeKey,
  now,
}: {
  api: TwentyApi;
  capabilityId: string;
  dedupeKey: string;
  now: Date;
}): Promise<void> => {
  const openCases = (
    await listRecords<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      `capabilityId[eq]:"${capabilityId}"`,
    )
  ).filter(({ stage }) => !CLOSED_OPPORTUNITY_STAGES.includes(stage));

  for (const opportunity of openCases) {
    const target = {
      objectNameSingular: OBJECT_NAMES.opportunity.singular,
      recordId: opportunity.id,
    };

    await notifyMembers({
      api,
      memberIds: [opportunity.ownerId],
      message: NOTIFICATION_MESSAGES.capabilityNoLongerOffered({
        subject: opportunity.name ?? '',
        link: recordLinkFor(target),
      }),
      taskTitle: `Check: ${opportunity.name ?? ''}`,
      target,
      dedupeKey: `${dedupeKey}:${opportunity.id}`,
      now,
    });
  }
};

const applyCapability = async ({
  api,
  capability,
  occurredAt,
  now,
}: {
  api: TwentyApi;
  capability: CapabilityData;
  occurredAt: string;
  now: Date;
}): Promise<UventureEventOutcome> => {
  const externalId = uventureExternalId(capability.id);

  if (await isStale('capability', externalId, occurredAt)) {
    return 'stale';
  }

  const existing = await findByExternalId<CapabilityRecord>(api, 'capability', externalId);
  const plan = planCapabilityUpsert({ capability, existing, now });
  let recordId: string;

  if (plan.action === 'create') {
    recordId = (await createRecord<CapabilityRecord>(api.asApplication, OBJECT_NAMES.capability, plan.values)).id;
  } else {
    recordId = plan.recordId;
    await updateRecord(api.asApplication, OBJECT_NAMES.capability, recordId, plan.values);
  }

  if (stopsAnOffer(plan.statusChange)) {
    await notifyCaseOwners({
      api,
      capabilityId: recordId,
      dedupeKey: `uventure-status:${externalId}:${plan.statusChange?.to}:${occurredAt}`,
      now,
    });
  }

  await markApplied('capability', externalId, occurredAt);

  return plan.action === 'create' ? 'created' : plan.action === 'update' ? 'updated' : 'unchanged';
};

const applyAgreement = async ({
  api,
  agreement,
  occurredAt,
  context,
  now,
}: {
  api: TwentyApi;
  agreement: AgreementData;
  occurredAt: string;
  context: AutomationContext;
  now: Date;
}): Promise<UventureEventOutcome> => {
  const externalId = uventureExternalId(agreement.id);

  if (await isStale('contract', externalId, occurredAt)) {
    return 'stale';
  }

  const existing = await findByExternalId<ContractState>(api, 'contract', externalId);
  const opportunity = isDefined(agreement.crmOpportunityId)
    ? await getRecord<OpportunityRecord>(api.asApplication, OBJECT_NAMES.opportunity, agreement.crmOpportunityId)
    : null;
  // W7 creates a contract of the same kind when the case is signed in Twenty;
  // uVENTURE adopts it rather than adding a second one.
  const [placeholder] = isDefined(existing) || !isDefined(opportunity)
    ? []
    : (
        await listRecords<ContractState>(
          api.asApplication,
          OBJECT_NAMES.contract,
          `and(opportunityId[eq]:"${opportunity.id}",kind[eq]:${agreement.agreementType})`,
        )
      ).filter((contract) => !isDefined(contract.externalId));
  const capability = isDefined(agreement.technologyId)
    ? await findByExternalId<CapabilityRecord>(api, 'capability', uventureExternalId(agreement.technologyId))
    : null;
  const counterpartyName = agreement.counterpartyName ?? normaliseDomain(agreement.counterpartyWebsite);
  const counterpartyId = isDefined(counterpartyName)
    ? await findOrCreateCompany(api, {
        name: counterpartyName,
        domain: normaliseDomain(agreement.counterpartyWebsite),
      })
    : null;
  const plan = planContractUpsert({
    agreement,
    existing: existing ?? null,
    placeholder: placeholder ?? null,
    links: {
      opportunity: isDefined(opportunity)
        ? { id: opportunity.id, ownerId: opportunity.ownerId, companyId: opportunity.companyId }
        : null,
      counterpartyId,
      capabilityId: capability?.id ?? null,
    },
  });
  const contractId = isDefined(plan.recordId)
    ? plan.recordId
    : (await createRecord<ContractState>(api.asApplication, OBJECT_NAMES.contract, plan.values)).id;

  if (isDefined(plan.recordId)) {
    await updateRecord(api.asApplication, OBJECT_NAMES.contract, contractId, plan.values);
  }

  if (plan.needsLinking) {
    const target = { objectNameSingular: OBJECT_NAMES.contract.singular, recordId: contractId };

    await notifyMembers({
      api,
      memberIds: [context.opsCoordinatorMemberId ?? context.edMemberId],
      message: NOTIFICATION_MESSAGES.uventureContractToLink({
        subject: agreement.title,
        link: recordLinkFor(target),
      }),
      taskTitle: `Link contract: ${agreement.title}`,
      target,
      dedupeKey: `uventure-contract-link:${externalId}`,
      now,
    });
  }

  await markApplied('contract', externalId, occurredAt);

  return plan.action === 'create' ? 'created' : 'updated';
};

// One event, idempotent: every write is keyed on the uVENTURE id, so a retried
// or replayed event changes nothing it already changed.
export const applyUventureEvent = async ({
  api,
  event,
  context,
  now,
}: {
  api: TwentyApi;
  event: UventureEvent;
  context: AutomationContext;
  now: Date;
}): Promise<UventureEventOutcome> => {
  switch (event.type) {
    case UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED:
    case UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED:
    case UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED:
    case UVENTURE_EVENT_TYPE.LISTING_CHANGED:
      return applyCapability({ api, capability: event.capability, occurredAt: event.occurredAt, now });
    case UVENTURE_EVENT_TYPE.AGREEMENT_SIGNED:
      return applyAgreement({ api, agreement: event.agreement, occurredAt: event.occurredAt, context, now });
    case UVENTURE_EVENT_TYPE.CHALLENGE_SUBMITTED: {
      const outcome = await recordPlannedLead({
        api,
        plan: planChallengeLead(event.challenge),
        campaignId: null,
        context,
        now,
      });

      return outcome.created ? 'created' : 'unchanged';
    }
    case UVENTURE_EVENT_TYPE.SIGNUP_SUBMITTED: {
      const outcome = await recordIntakeLead({
        api,
        form: event.signup.form,
        submission: event.signup.submission,
        context,
        now,
      });

      return outcome.created ? 'created' : 'unchanged';
    }
  }
};
