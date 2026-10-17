import { isDefined } from 'twenty-sdk/utils';

import {
  createRecord,
  listRecords,
  type TwentyApi,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type LeadRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import { computeStaleFrom } from 'src/automation/rules/age-thresholds.rule';
import {
  buildConvertedOpportunity,
  needsConversion,
} from 'src/automation/rules/lead-conversion.rule';

// L5. convertedSince is the moment the lead became Converted. The opportunity
// is created as the person who converted it, so it is theirs in the history;
// the links back and the stamps are the app's. A retried run finds the
// opportunity an earlier attempt created for this conversion and reuses it.
export const convertLead = async ({
  api,
  lead,
  convertedSince,
  now,
}: {
  api: TwentyApi;
  lead: LeadRecord;
  convertedSince: string;
  now: Date;
}): Promise<string | null> => {
  if (!needsConversion(lead, convertedSince)) {
    return null;
  }

  const { create, playbookType } = buildConvertedOpportunity(lead);
  const [earlierAttempt] = await listRecords<OpportunityRecord>(
    api.asApplication,
    OBJECT_NAMES.opportunity,
    `and(leadId[eq]:"${lead.id}",createdAt[gte]:"${convertedSince}")`,
  );
  const opportunity =
    earlierAttempt ??
    (await createRecord<OpportunityRecord>(api.asPerson, OBJECT_NAMES.opportunity, create));

  // W8 never sees a created record's stage, so the app stamps it for the
  // In Qualify over 30 days list.
  await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
    stageEnteredAt: opportunity.createdAt,
    staleFrom: computeStaleFrom(opportunity.createdAt),
  });

  // A second update, so W1 starts the playbook for a Licence or Technical service type.
  if (isDefined(playbookType) && opportunity.playbookType !== playbookType) {
    await updateRecord(api.asPerson, OBJECT_NAMES.opportunity, opportunity.id, {
      playbookType,
    });
  }

  await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, {
    convertedOpportunityId: opportunity.id,
    lastConvertedAt: now.toISOString(),
  });

  console.log(`l05 converted ${lead.id} into ${opportunity.id}${isDefined(earlierAttempt) ? ' (found from an earlier attempt)' : ''}`);

  return opportunity.id;
};
