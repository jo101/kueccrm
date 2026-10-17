import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import {
  createTwentyApi,
  getRecord,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  computeEngagementLapsesAt,
  computeOutcomeDueAt,
  isSameInstant,
} from 'src/automation/rules/age-thresholds.rule';
import {
  type CompanyRecord,
  type EngagementRecord,
  type LeadRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';

export const W11_ENGAGEMENT_STAMP_UNIVERSAL_IDENTIFIER = '00b99a5c-a248-40d3-91da-70915723cd5e';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<EngagementRecord>>,
) => {
  const api = createTwentyApi();
  const engagement = await getRecord<EngagementRecord>(
    api.asApplication,
    OBJECT_NAMES.engagement,
    event.recordId,
  );

  if (!isDefined(engagement)) {
    return { skipped: 'engagement gone' };
  }

  const result: Record<string, string> = {};
  const outcomeDueAt = computeOutcomeDueAt(engagement.date);

  if (!isSameInstant(engagement.outcomeDueAt, outcomeDueAt)) {
    await updateRecord(api.asApplication, OBJECT_NAMES.engagement, engagement.id, {
      outcomeDueAt,
    });
    result.outcomeDueAt = outcomeDueAt ?? 'cleared';
  }

  if (isDefined(engagement.date) && isDefined(engagement.companyId)) {
    const company = await getRecord<CompanyRecord>(
      api.asApplication,
      OBJECT_NAMES.company,
      engagement.companyId,
    );

    // Back-dating an older engagement must not move "last engagement" backwards.
    if (
      isDefined(company) &&
      (!isDefined(company.lastEngagementAt) ||
        Date.parse(company.lastEngagementAt) < Date.parse(engagement.date))
    ) {
      await updateRecord(api.asApplication, OBJECT_NAMES.company, company.id, {
        lastEngagementAt: engagement.date,
        engagementLapsesAt: computeEngagementLapsesAt(engagement.date),
      });
      result.lastEngagementAt = engagement.date;
    }
  }

  if (isDefined(engagement.date) && isDefined(engagement.leadId)) {
    const lead = await getRecord<LeadRecord>(
      api.asApplication,
      OBJECT_NAMES.lead,
      engagement.leadId,
    );

    // The lead's quiet clock (L3) restarts on contact, never moves backwards.
    if (
      isDefined(lead) &&
      (!isDefined(lead.lastEngagementAt) ||
        Date.parse(lead.lastEngagementAt) < Date.parse(engagement.date))
    ) {
      await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, {
        lastEngagementAt: engagement.date,
      });
      result.leadLastEngagementAt = engagement.date;
    }
  }

  const nextStep = (engagement.nextStep ?? '').trim();

  if (nextStep.length > 0 && isDefined(engagement.opportunityId)) {
    const opportunity = await getRecord<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      engagement.opportunityId,
    );

    if (isDefined(opportunity) && opportunity.nextAction !== nextStep) {
      await updateRecord(api.asPerson, OBJECT_NAMES.opportunity, opportunity.id, {
        nextAction: nextStep,
      });
      result.nextAction = nextStep;
    }
  }

  return result;
};

export default defineLogicFunction({
  universalIdentifier: W11_ENGAGEMENT_STAMP_UNIVERSAL_IDENTIFIER,
  name: 'w11-engagement-stamp',
  description:
    "W11: an engagement's date sets its outcomeDueAt and becomes the company's and the lead's last engagement; its next step becomes the linked opportunity's next action",
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'engagement.updated',
    updatedFields: ['date', 'nextStep', 'leadId'],
  },
});
