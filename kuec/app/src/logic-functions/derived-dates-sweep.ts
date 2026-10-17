import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type CompanyRecord,
  type EngagementRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import {
  computeEngagementLapsesAt,
  computeOutcomeDueAt,
  computeParkedLapsesAt,
  computeStaleFrom,
  isSameInstant,
} from 'src/automation/rules/age-thresholds.rule';
import { computeDefaultOwnerId } from 'src/automation/rules/default-owner.rule';

export const DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER = '894dafcf-1a8b-4b07-95c4-466648f32bf4';

// W8, W11 and default-opportunity-owner are the fast path; this repairs any
// record whose event was lost and backfills records that existed before the fields did.
// Only engagements still without an outcome are swept: nothing else reads
// outcomeDueAt, and the weekly hygiene run keeps that list short.
const ENGAGEMENTS_WITHOUT_OUTCOME_FILTER =
  'and(date[is]:NOT_NULL,or(outcome[is]:NULL,outcome[eq]:""))';

const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [opportunities, companies, ownerlessOpportunities, engagements] = await Promise.all([
    listRecords<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      'stageEnteredAt[is]:NOT_NULL',
    ),
    listRecords<CompanyRecord>(
      api.asApplication,
      OBJECT_NAMES.company,
      'lastEngagementAt[is]:NOT_NULL',
    ),
    listRecords<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      'ownerId[is]:NULL',
    ),
    listRecords<EngagementRecord>(
      api.asApplication,
      OBJECT_NAMES.engagement,
      ENGAGEMENTS_WITHOUT_OUTCOME_FILTER,
    ),
  ]);

  let repairedOpportunities = 0;
  let repairedCompanies = 0;
  let repairedEngagements = 0;
  let defaultedOwners = 0;

  for (const opportunity of opportunities) {
    const staleFrom = computeStaleFrom(opportunity.stageEnteredAt);
    const parkedLapsesAt = computeParkedLapsesAt(
      opportunity.stage,
      opportunity.stageEnteredAt,
    );

    if (
      !isSameInstant(opportunity.staleFrom, staleFrom) ||
      !isSameInstant(opportunity.parkedLapsesAt, parkedLapsesAt)
    ) {
      await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
        staleFrom,
        parkedLapsesAt,
      });
      repairedOpportunities++;
    }
  }

  for (const company of companies) {
    const engagementLapsesAt = computeEngagementLapsesAt(company.lastEngagementAt);

    if (!isSameInstant(company.engagementLapsesAt, engagementLapsesAt)) {
      await updateRecord(api.asApplication, OBJECT_NAMES.company, company.id, {
        engagementLapsesAt,
      });
      repairedCompanies++;
    }
  }

  for (const engagement of engagements) {
    const outcomeDueAt = computeOutcomeDueAt(engagement.date);

    if (!isSameInstant(engagement.outcomeDueAt, outcomeDueAt)) {
      await updateRecord(api.asApplication, OBJECT_NAMES.engagement, engagement.id, {
        outcomeDueAt,
      });
      repairedEngagements++;
    }
  }

  for (const opportunity of ownerlessOpportunities) {
    const ownerId = computeDefaultOwnerId(opportunity, now);

    if (isDefined(ownerId)) {
      await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
        ownerId,
      });
      defaultedOwners++;
    }
  }

  console.log(
    `derived dates: checked ${opportunities.length} opportunities, ${companies.length} companies and ${engagements.length} engagements without outcome, repaired ${repairedOpportunities}, ${repairedCompanies} and ${repairedEngagements}; gave ${defaultedOwners} of ${ownerlessOpportunities.length} ownerless opportunities to their creator`,
  );

  return { repairedOpportunities, repairedCompanies, repairedEngagements, defaultedOwners };
};

export default defineLogicFunction({
  universalIdentifier: DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'derived-dates-sweep',
  description:
    'Hourly: re-derives opportunity staleFrom and parkedLapsesAt, company engagementLapsesAt and, for engagements without an outcome, outcomeDueAt from their source dates, and gives an ownerless opportunity created in the UI in the last day to its creator',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 30, UTC (Asia/Dubai has the same minute), off the timer sweep's minute
    pattern: '30 * * * *',
  },
});
