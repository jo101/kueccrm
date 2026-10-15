import { defineLogicFunction } from 'twenty-sdk/define';

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

export const DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER = '894dafcf-1a8b-4b07-95c4-466648f32bf4';

// W8 and W11 set these dates on the fast path; this repairs any record whose
// event was lost and backfills records that existed before the fields did.
const handler = async () => {
  const api = createTwentyApi();
  const [opportunities, companies] = await Promise.all([
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
  ]);

  let repairedOpportunities = 0;
  let repairedCompanies = 0;

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

  console.log(
    `derived dates: checked ${opportunities.length} opportunities and ${companies.length} companies, repaired ${repairedOpportunities} and ${repairedCompanies}`,
  );

  return { repairedOpportunities, repairedCompanies };
};

export default defineLogicFunction({
  universalIdentifier: DERIVED_DATES_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'derived-dates-sweep',
  description:
    'Hourly: re-derives opportunity staleFrom and company engagementLapsesAt from stageEnteredAt and lastEngagementAt',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 30, UTC (Asia/Dubai has the same minute), off the timer sweep's minute
    pattern: '30 * * * *',
  },
});
