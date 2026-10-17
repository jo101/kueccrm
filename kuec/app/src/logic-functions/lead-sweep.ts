import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { convertLead } from 'src/automation/leads/convert-lead';
import { creditReferral } from 'src/automation/leads/credit-referral';
import { qualifyLead } from 'src/automation/leads/qualify-lead';
import { triageLead } from 'src/automation/leads/triage-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type EngagementRecord,
  type LeadRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import { isSameInstant } from 'src/automation/rules/age-thresholds.rule';
import { needsConversion } from 'src/automation/rules/lead-conversion.rule';
import { planQualification } from 'src/automation/rules/lead-qualification.rule';
import { hasReferrer } from 'src/automation/rules/lead-referral.rule';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { LEAD_STATUS } from 'src/objects/lead.object';

export const LEAD_SWEEP_UNIVERSAL_IDENTIFIER = '78d7cec1-b707-4544-a5fa-2265e64adfa4';

// A lead created in the UI is triaged by its first edit; the sweep leaves it
// that long before stepping in.
const TRIAGE_SWEEP_GRACE_MS = 10 * 60 * 1000;

const latestEngagementByLead = (engagements: EngagementRecord[]): Map<string, string> => {
  const latest = new Map<string, string>();

  for (const { leadId, date } of engagements) {
    if (!isDefined(leadId) || !isDefined(date)) {
      continue;
    }

    const current = latest.get(leadId);

    if (!isDefined(current) || Date.parse(date) > Date.parse(current)) {
      latest.set(leadId, date);
    }
  }

  return latest;
};

// L1, L4, L5, L6 and W11's lead stamp are the fast path; this repairs what a
// lost event left undone, from record state alone. A conversion is repaired
// only when the status change itself was stamped, so leads imported as
// Converted never get an opportunity they did not ask for.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [leads, engagements, signedFromLeads, context] = await Promise.all([
    listRecords<LeadRecord>(api.asApplication, OBJECT_NAMES.lead),
    listRecords<EngagementRecord>(
      api.asApplication,
      OBJECT_NAMES.engagement,
      'and(leadId[is]:NOT_NULL,date[is]:NOT_NULL)',
    ),
    listRecords<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      `and(leadId[is]:NOT_NULL,stage[eq]:${OPPORTUNITY_STAGE.SIGNED})`,
    ),
    loadAutomationContext(api),
  ]);
  const latestEngagements = latestEngagementByLead(engagements);
  const leadsById = new Map(leads.map((lead) => [lead.id, lead]));
  const repaired = { triaged: 0, scored: 0, engagements: 0, converted: 0, credited: 0 };

  for (const lead of leads) {
    if (
      !lead.playbookApplied &&
      lead.status === LEAD_STATUS.NEW &&
      now.getTime() - Date.parse(lead.createdAt) >= TRIAGE_SWEEP_GRACE_MS &&
      (await triageLead({ api, lead, context, now }))
    ) {
      repaired.triaged++;
    }

    const qualification = planQualification(lead);

    if (qualification.scoreChanged || qualification.qualify) {
      await qualifyLead({ api, lead, context, now });
      repaired.scored++;
    }

    const lastEngagementAt = latestEngagements.get(lead.id) ?? null;

    if (isDefined(lastEngagementAt) && !isSameInstant(lead.lastEngagementAt, lastEngagementAt)) {
      await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, { lastEngagementAt });
      repaired.engagements++;
    }

    if (
      isDefined(lead.statusEnteredAt) &&
      needsConversion(lead, lead.statusEnteredAt) &&
      isDefined(await convertLead({ api, lead, convertedSince: lead.statusEnteredAt, now }))
    ) {
      repaired.converted++;
    }
  }

  for (const opportunity of signedFromLeads) {
    const lead = isDefined(opportunity.leadId) ? leadsById.get(opportunity.leadId) : undefined;

    if (
      isDefined(lead) &&
      hasReferrer(lead) &&
      !isDefined(lead.referralCreditedAt) &&
      (await creditReferral({ api, lead, opportunity, now }))
    ) {
      repaired.credited++;
    }
  }

  console.log(
    `lead sweep: checked ${leads.length} leads and ${signedFromLeads.length} signed opportunities from leads; triaged ${repaired.triaged}, rescored ${repaired.scored}, restamped ${repaired.engagements} last engagements, converted ${repaired.converted}, credited ${repaired.credited} referrals`,
  );

  return repaired;
};

export default defineLogicFunction({
  universalIdentifier: LEAD_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'lead-sweep',
  description:
    'Hourly: triages New leads nobody triaged, re-derives qualification scores and last engagements, finishes conversions and referral credits a lost event left undone',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 45, UTC (Asia/Dubai has the same minute), off the other sweeps' minutes
    pattern: '45 * * * *',
  },
});
