import { isArray, isNonEmptyString, isObject, isString } from '@sniptt/guards';

import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';

// The three forms that land as leads (runbooks/19-leads.md section 6).
export const INTAKE_FORM = {
  WEBSITE: 'WEBSITE',
  GALA_QR: 'GALA_QR',
  WORKSHOP_SIGNUP: 'WORKSHOP_SIGNUP',
} as const;

export type IntakeForm = (typeof INTAKE_FORM)[keyof typeof INTAKE_FORM];

// Twenty's per-mutation maximum (MUTATION_MAXIMUM_AFFECTED_RECORDS).
export const MAX_SUBMISSIONS_PER_DELIVERY = 100;

const MAX_TEXT_LENGTH = 300;
export const MAX_NEED_LENGTH = 4000;
export const IDENTIFIER_PATTERN = /^[A-Za-z0-9_.-]{1,100}$/;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type IntakeSubmission = {
  submissionId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  jobTitle: string | null;
  companyName: string | null;
  companyWebsite: string | null;
  need: string | null;
  offeringInterest: string[];
  campaignId: string | null;
};

export type LeadIntakePayload = {
  deliveryId: string;
  form: IntakeForm;
  submissions: IntakeSubmission[];
};

export type ParsedLeadIntake =
  | { ok: true; payload: LeadIntakePayload }
  | { ok: false; status: 400 | 413; reason: string };

const OFFERING_VALUES: string[] = Object.values(OPPORTUNITY_OFFERING);
const FORM_VALUES: string[] = Object.values(INTAKE_FORM);

export const isValidDeliveryId = (deliveryId: string | null): deliveryId is string =>
  isString(deliveryId) && IDENTIFIER_PATTERN.test(deliveryId);

export const isIntakeForm = (value: unknown): value is IntakeForm =>
  isString(value) && FORM_VALUES.includes(value);

export const readText = (value: unknown, maxLength = MAX_TEXT_LENGTH): string | null =>
  isNonEmptyString(value) && value.trim().length > 0
    ? value.trim().slice(0, maxLength)
    : null;

export const parseSubmission = (value: unknown): IntakeSubmission | string => {
  if (!isObject(value) || isArray(value)) {
    return 'submission is not an object';
  }

  const record = value as Record<string, unknown>;
  const submissionId = record.submissionId;

  if (!isString(submissionId) || !IDENTIFIER_PATTERN.test(submissionId)) {
    return 'submissionId missing or not 1 to 100 letters, digits, dot, dash or underscore';
  }

  const submission: IntakeSubmission = {
    submissionId,
    firstName: readText(record.firstName),
    lastName: readText(record.lastName),
    email: readText(record.email),
    jobTitle: readText(record.jobTitle),
    companyName: readText(record.companyName),
    companyWebsite: readText(record.companyWebsite),
    need: readText(record.need, MAX_NEED_LENGTH),
    offeringInterest: isArray(record.offeringInterest)
      ? [...new Set(record.offeringInterest.filter(isString))].filter((offering) =>
          OFFERING_VALUES.includes(offering),
        )
      : [],
    campaignId:
      isString(record.campaignId) && UUID_PATTERN.test(record.campaignId)
        ? record.campaignId
        : null,
  };

  if (
    submission.email === null &&
    submission.firstName === null &&
    submission.lastName === null &&
    submission.companyName === null
  ) {
    return `submission ${submissionId} has no email, name or company`;
  }

  return submission;
};

// Shape only. Unknown offerings and a malformed campaign id are dropped rather
// than refused, so one stale form option does not lose the contact.
export const parseLeadIntakeBody = (
  rawBody: string,
  deliveryId: string,
): ParsedLeadIntake => {
  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, reason: 'body is not JSON' };
  }

  if (!isObject(body) || isArray(body)) {
    return { ok: false, status: 400, reason: 'body is not an object' };
  }

  const { form, submissions } = body as Record<string, unknown>;

  if (!isIntakeForm(form)) {
    return { ok: false, status: 400, reason: `form must be one of ${FORM_VALUES.join(', ')}` };
  }

  if (!isArray(submissions) || submissions.length === 0) {
    return { ok: false, status: 400, reason: 'submissions must be a non-empty array' };
  }

  if (submissions.length > MAX_SUBMISSIONS_PER_DELIVERY) {
    return {
      ok: false,
      status: 413,
      reason: `at most ${MAX_SUBMISSIONS_PER_DELIVERY} submissions per delivery`,
    };
  }

  const parsed: IntakeSubmission[] = [];

  for (const submission of submissions) {
    const result = parseSubmission(submission);

    if (isString(result)) {
      return { ok: false, status: 400, reason: result };
    }

    parsed.push(result);
  }

  return { ok: true, payload: { deliveryId, form, submissions: parsed } };
};
