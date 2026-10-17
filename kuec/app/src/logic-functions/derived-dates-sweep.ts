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
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import {
  computeEngagementLapsesAt,
  computeStaleFrom,
  isSameInstant,
} from 'src/automation/rules/age-thresholds.rule';
import { computeDefaultOwnerId } from 'src/automation/rules/default-owner.rule';

export const DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER = '894dafcf-1a8b-4b07-95c4-466648f32bf4';

// W8, W11 and default-opportunity-owner are the fast path; this repairs any
// record whose event was lost and backfills records that existed before the fields did.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [opportunities, companies, ownerlessOpportunities] = await Promise.all([
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
  ]);

  let repairedOpportunities = 0;
  let repairedCompanies = 0;
  let defaultedOwners = 0;

  for (const opportunity of opportunities) {
    const staleFrom = computeStaleFrom(opportunity.stageEnteredAt);

    if (!isSameInstant(opportunity.staleFrom, staleFrom)) {
      await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
        staleFrom,
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
    `derived dates: checked ${opportunities.length} opportunities and ${companies.length} companies, repaired ${repairedOpportunities} and ${repairedCompanies}; gave ${defaultedOwners} of ${ownerlessOpportunities.length} ownerless opportunities to their creator`,
  );

  return { repairedOpportunities, repairedCompanies, defaultedOwners };
};

export default defineLogicFunction({
  universalIdentifier: DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'derived-dates-sweep',
  description:
    'Hourly: re-derives opportunity staleFrom and company engagementLapsesAt from stageEnteredAt and lastEngagementAt, and gives an ownerless opportunity created in the UI in the last day to its creator',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 30, UTC (Asia/Dubai has the same minute), off the timer sweep's minute
    pattern: '30 * * * *',
  },
});
