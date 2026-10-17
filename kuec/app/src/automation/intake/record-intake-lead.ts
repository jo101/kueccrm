import { isDefined } from 'twenty-sdk/utils';

import { type AutomationContext } from 'src/automation/api/load-automation-context';
import {
  createRecord,
  listRecords,
  type TwentyApi,
  updateRecord,
} from 'src/automation/api/twenty-api';
import {
  type IntakeForm,
  type IntakeSubmission,
} from 'src/automation/intake/lead-intake-payload';
import {
  type IntakeLeadPlan,
  normaliseDomain,
  normaliseEmail,
  planIntakeLead,
} from 'src/automation/intake/plan-intake-lead';
import { triageLead } from 'src/automation/leads/triage-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type CompanyIdentityRecord,
  type LeadRecord,
  type PersonRecord,
  type ProjectRecord,
} from 'src/automation/records/record-types';
import { PROJECT_TYPE } from 'src/objects/project.object';

const CAMPAIGN_PROJECT_TYPES: string[] = [PROJECT_TYPE.GTM_CAMPAIGN, PROJECT_TYPE.WORKSHOP];

// Characters with a meaning in a REST filter become the one-character
// wildcard; the match is then confirmed exactly in code.
const toIlikePattern = (text: string): string => text.replace(/["\\%_,()]/g, '_');

const findCompany = async (
  api: TwentyApi,
  company: NonNullable<IntakeLeadPlan['company']>,
): Promise<string | null> => {
  if (isDefined(company.domain)) {
    const byDomain = await listRecords<CompanyIdentityRecord>(
      api.asApplication,
      OBJECT_NAMES.company,
      `domainName.primaryLinkUrl[ilike]:"%${company.domain}%"`,
    );
    const match = byDomain.find(
      ({ domainName }) => normaliseDomain(domainName?.primaryLinkUrl ?? null) === company.domain,
    );

    if (isDefined(match)) {
      return match.id;
    }
  }

  const byName = await listRecords<CompanyIdentityRecord>(
    api.asApplication,
    OBJECT_NAMES.company,
    `name[ilike]:"${toIlikePattern(company.name)}"`,
  );

  return (
    byName.find(({ name }) => name?.trim().toLowerCase() === company.name.toLowerCase())?.id ??
    null
  );
};

export const findOrCreateCompany = async (
  api: TwentyApi,
  company: IntakeLeadPlan['company'],
): Promise<string | null> => {
  if (!isDefined(company)) {
    return null;
  }

  const existingId = await findCompany(api, company);

  if (isDefined(existingId)) {
    return existingId;
  }

  const created = await createRecord<CompanyIdentityRecord>(api.asApplication, OBJECT_NAMES.company, {
    name: company.name,
    ...(isDefined(company.domain)
      ? { domainName: { primaryLinkUrl: `https://${company.domain}` } }
      : {}),
  });

  return created.id;
};

// An existing person is linked, never overwritten: a human edit outranks a
// form (runbooks/16-integration-map.md section 2.3). Only an empty company is filled.
const findOrCreatePerson = async (
  api: TwentyApi,
  person: IntakeLeadPlan['person'],
  companyId: string | null,
): Promise<string | null> => {
  if (!isDefined(person)) {
    return null;
  }

  if (isDefined(person.email)) {
    const matches = await listRecords<PersonRecord>(
      api.asApplication,
      OBJECT_NAMES.person,
      `emails.primaryEmail[ilike]:"${toIlikePattern(person.email)}"`,
    );
    const match = matches.find(
      ({ emails }) => normaliseEmail(emails?.primaryEmail ?? null) === person.email,
    );

    if (isDefined(match)) {
      if (!isDefined(match.companyId) && isDefined(companyId)) {
        await updateRecord(api.asApplication, OBJECT_NAMES.person, match.id, { companyId });
      }

      return match.id;
    }
  }

  const created = await createRecord<PersonRecord>(api.asApplication, OBJECT_NAMES.person, {
    name: { firstName: person.firstName, lastName: person.lastName },
    ...(isDefined(person.email) ? { emails: { primaryEmail: person.email } } : {}),
    ...(isDefined(person.jobTitle) ? { jobTitle: person.jobTitle } : {}),
    companyId,
  });

  return created.id;
};

const findCampaign = async (
  api: TwentyApi,
  campaignId: string | null,
): Promise<string | null> => {
  if (!isDefined(campaignId)) {
    return null;
  }

  const [project] = await listRecords<ProjectRecord>(
    api.asApplication,
    OBJECT_NAMES.project,
    `id[eq]:"${campaignId}"`,
  );

  if (!isDefined(project) || !CAMPAIGN_PROJECT_TYPES.includes(project.playbookType ?? '')) {
    console.warn(`lead intake: campaign ${campaignId} is not a GTM campaign or workshop project, left empty`);

    return null;
  }

  return project.id;
};

export type IntakeOutcome = { leadId: string; created: boolean };

// Keyed on externalId: a submission that already has a lead is left as it is,
// so a resent delivery or a retried job creates nothing twice.
export const recordPlannedLead = async ({
  api,
  plan,
  campaignId,
  context,
  now,
}: {
  api: TwentyApi;
  plan: IntakeLeadPlan;
  campaignId: string | null;
  context: AutomationContext;
  now: Date;
}): Promise<IntakeOutcome> => {
  const [existing] = await listRecords<LeadRecord>(
    api.asApplication,
    OBJECT_NAMES.lead,
    `externalId[eq]:"${plan.externalId}"`,
  );

  if (isDefined(existing)) {
    if (!existing.playbookApplied) {
      await triageLead({ api, lead: existing, context, now });
    }

    return { leadId: existing.id, created: false };
  }

  const companyId = await findOrCreateCompany(api, plan.company);
  const personId = await findOrCreatePerson(api, plan.person, companyId);
  const lead = await createRecord<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, {
    ...plan.lead,
    companyId,
    personId,
    campaignId: await findCampaign(api, campaignId),
  });

  // Created by the app, so no update event fires L1: triage it here.
  await triageLead({ api, lead, context, now });

  return { leadId: lead.id, created: true };
};

export const recordIntakeLead = async ({
  api,
  form,
  submission,
  context,
  now,
}: {
  api: TwentyApi;
  form: IntakeForm;
  submission: IntakeSubmission;
  context: AutomationContext;
  now: Date;
}): Promise<IntakeOutcome> =>
  recordPlannedLead({
    api,
    plan: planIntakeLead(form, submission),
    campaignId: submission.campaignId,
    context,
    now,
  });
