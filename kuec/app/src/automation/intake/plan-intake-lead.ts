import { isDefined } from 'twenty-sdk/utils';

import {
  INTAKE_FORM,
  type IntakeForm,
  type IntakeSubmission,
} from 'src/automation/intake/lead-intake-payload';
import { OPPORTUNITY_SOURCE } from 'src/fields/source-on-opportunity.field';
import {
  LEAD_SOURCE_SYSTEM,
  LEAD_STATUS,
  type LeadSourceSystem,
} from 'src/objects/lead.object';

type IntakeFormSettings = {
  source: (typeof OPPORTUNITY_SOURCE)[keyof typeof OPPORTUNITY_SOURCE];
  sourceSystem: LeadSourceSystem;
  externalIdPrefix: string;
};

export const INTAKE_FORM_SETTINGS: Record<IntakeForm, IntakeFormSettings> = {
  [INTAKE_FORM.WEBSITE]: {
    source: OPPORTUNITY_SOURCE.INBOUND,
    sourceSystem: LEAD_SOURCE_SYSTEM.WEBSITE_FORM,
    externalIdPrefix: 'web',
  },
  [INTAKE_FORM.GALA_QR]: {
    source: OPPORTUNITY_SOURCE.GALA_QR,
    sourceSystem: LEAD_SOURCE_SYSTEM.GALA_QR_FORM,
    externalIdPrefix: 'gala',
  },
  [INTAKE_FORM.WORKSHOP_SIGNUP]: {
    source: OPPORTUNITY_SOURCE.WORKSHOP,
    sourceSystem: LEAD_SOURCE_SYSTEM.WORKSHOP_SIGNUP_FORM,
    externalIdPrefix: 'workshop',
  },
};

// Matching rules of the day-one import (scripts/import/normalise.ts): a person
// is their email, a company its website domain, then its name.
export const normaliseEmail = (value: string | null): string | null => {
  const email = (value ?? '').trim().toLowerCase().replace(/^mailto:/, '');

  return /^[^\s@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(email) ? email : null;
};

export const normaliseDomain = (value: string | null): string | null => {
  const host = (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:]/, 1)[0]
    .replace(/\.$/, '');

  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null;
};

export type IntakeLeadPlan = {
  externalId: string;
  lead: Record<string, unknown>;
  person: {
    firstName: string;
    lastName: string;
    email: string | null;
    jobTitle: string | null;
  } | null;
  company: { name: string; domain: string | null } | null;
};

export const planIntakeLead = (
  form: IntakeForm,
  submission: IntakeSubmission,
): IntakeLeadPlan => {
  const settings = INTAKE_FORM_SETTINGS[form];
  const externalId = `${settings.externalIdPrefix}:${submission.submissionId}`;
  const email = normaliseEmail(submission.email);
  const personName = [submission.firstName, submission.lastName]
    .filter(isDefined)
    .join(' ');
  const hasPerson = personName.length > 0 || isDefined(email);
  const domain = normaliseDomain(submission.companyWebsite);
  const companyName = submission.companyName ?? domain;
  const leadName =
    [personName.length > 0 ? personName : email, companyName]
      .filter(isDefined)
      .join(', ') || externalId;

  return {
    externalId,
    lead: {
      name: leadName,
      status: LEAD_STATUS.NEW,
      source: settings.source,
      sourceSystem: settings.sourceSystem,
      externalId,
      need: submission.need,
      ...(submission.offeringInterest.length > 0
        ? { offeringInterest: submission.offeringInterest }
        : {}),
    },
    person: hasPerson
      ? {
          firstName: submission.firstName ?? '',
          lastName: submission.lastName ?? '',
          email,
          jobTitle: submission.jobTitle,
        }
      : null,
    company: isDefined(companyName) ? { name: companyName, domain } : null,
  };
};
