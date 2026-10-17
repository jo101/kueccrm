import { isArray, isNonEmptyString, isNumber, isObject, isString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import {
  IDENTIFIER_PATTERN,
  type IntakeForm,
  type IntakeSubmission,
  isIntakeForm,
  MAX_NEED_LENGTH,
  parseSubmission,
  readText,
  UUID_PATTERN,
} from 'src/automation/intake/lead-intake-payload';
import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { OPPORTUNITY_SOURCE } from 'src/fields/source-on-opportunity.field';
import {
  CAPABILITY_KIND,
  CAPABILITY_STATUS,
  type CapabilityKind,
  type CapabilityStatus,
} from 'src/objects/capability.object';
import { CONTRACT_KIND } from 'src/objects/contract.object';

// The business events uVENTURE sends (runbooks/21-uventure-readiness.md section 4.2).
export const UVENTURE_EVENT_TYPE = {
  TECHNOLOGY_CREATED: 'technology.created',
  TECHNOLOGY_UPDATED: 'technology.updated',
  DISCLOSURE_CREATED: 'disclosure.created',
  LISTING_CHANGED: 'listing.changed',
  CHALLENGE_SUBMITTED: 'challenge.submitted',
  AGREEMENT_SIGNED: 'agreement.signed',
  SIGNUP_SUBMITTED: 'signup.submitted',
} as const;

export type UventureEventType = (typeof UVENTURE_EVENT_TYPE)[keyof typeof UVENTURE_EVENT_TYPE];

export const CAPABILITY_EVENT_TYPES: string[] = [
  UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED,
  UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED,
  UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED,
  UVENTURE_EVENT_TYPE.LISTING_CHANGED,
];

// Twenty's per-mutation maximum (MUTATION_MAXIMUM_AFFECTED_RECORDS).
export const MAX_EVENTS_PER_DELIVERY = 100;

export const CHALLENGE_PROGRAMME_SOURCE = {
  CHALLENGE_SPRINT: OPPORTUNITY_SOURCE.CHALLENGE_SPRINT,
  TECHNICAL_COMMITTEE: OPPORTUNITY_SOURCE.TECHNICAL_COMMITTEE,
} as const;

export type ChallengeProgramme = keyof typeof CHALLENGE_PROGRAMME_SOURCE;

export type CapabilityData = {
  id: string;
  kind: CapabilityKind;
  title: string;
  url: string;
  status: CapabilityStatus | null;
  otherDetails: string | null;
};

export type ChallengeData = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  programme: ChallengeProgramme;
  companyName: string | null;
  companyWebsite: string | null;
  contact: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    jobTitle: string | null;
  } | null;
  offeringInterest: string[];
};

export type AgreementData = {
  id: string;
  url: string;
  agreementType: (typeof CONTRACT_KIND)[keyof typeof CONTRACT_KIND];
  title: string;
  signedOn: string;
  expiresOn: string | null;
  value: { amountMicros: number; currencyCode: string } | null;
  counterpartyName: string | null;
  counterpartyWebsite: string | null;
  technologyId: string | null;
  crmOpportunityId: string | null;
};

export type SignupData = { form: IntakeForm; submission: IntakeSubmission };

type EventBase = { eventId: string; occurredAt: string };

export type UventureEvent =
  | (EventBase & {
      type:
        | typeof UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED
        | typeof UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED
        | typeof UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED
        | typeof UVENTURE_EVENT_TYPE.LISTING_CHANGED;
      capability: CapabilityData;
    })
  | (EventBase & { type: typeof UVENTURE_EVENT_TYPE.CHALLENGE_SUBMITTED; challenge: ChallengeData })
  | (EventBase & { type: typeof UVENTURE_EVENT_TYPE.AGREEMENT_SIGNED; agreement: AgreementData })
  | (EventBase & { type: typeof UVENTURE_EVENT_TYPE.SIGNUP_SUBMITTED; signup: SignupData });

// The nightly snapshot and replay come as numbered pages of one run.
export type UventureRun = { runId: string; page: number; pageCount: number };

export type UventureDelivery = {
  deliveryId: string;
  run: UventureRun | null;
  events: UventureEvent[];
};

export type ParsedUventureDelivery =
  | { ok: true; payload: UventureDelivery }
  | { ok: false; status: 400 | 413; reason: string };

const EVENT_TYPE_VALUES: string[] = Object.values(UVENTURE_EVENT_TYPE);
const CAPABILITY_KIND_VALUES: string[] = Object.values(CAPABILITY_KIND);
const CAPABILITY_STATUS_VALUES: string[] = Object.values(CAPABILITY_STATUS);
const CONTRACT_KIND_VALUES: string[] = Object.values(CONTRACT_KIND);
const OFFERING_VALUES: string[] = Object.values(OPPORTUNITY_OFFERING);
const PROGRAMME_VALUES: string[] = Object.keys(CHALLENGE_PROGRAMME_SOURCE);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const MAX_PAGE_COUNT = 1000;

const isHttpsUrl = (value: unknown): value is string => {
  if (!isString(value)) {
    return false;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const isIdentifier = (value: unknown): value is string =>
  isString(value) && IDENTIFIER_PATTERN.test(value);

const asRecord = (value: unknown): Record<string, unknown> | null =>
  isObject(value) && !isArray(value) ? (value as Record<string, unknown>) : null;

const forcedKindByType: Partial<Record<string, CapabilityKind>> = {
  [UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED]: CAPABILITY_KIND.TECHNOLOGY,
  [UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED]: CAPABILITY_KIND.TECHNOLOGY,
  [UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED]: CAPABILITY_KIND.INVENTION_DISCLOSURE,
};

const parseCapability = (type: string, data: Record<string, unknown>): CapabilityData | string => {
  if (!isIdentifier(data.id)) {
    return 'data.id missing or not 1 to 100 letters, digits, dot, dash or underscore';
  }

  const kind = forcedKindByType[type] ?? data.kind;

  if (!isString(kind) || !CAPABILITY_KIND_VALUES.includes(kind)) {
    return `data.kind must be one of ${CAPABILITY_KIND_VALUES.join(', ')}`;
  }

  const title = readText(data.title);

  if (title === null) {
    return 'data.title missing';
  }

  if (!isHttpsUrl(data.url)) {
    return 'data.url must be an https URL';
  }

  if (isDefined(data.status) && (!isString(data.status) || !CAPABILITY_STATUS_VALUES.includes(data.status))) {
    return `data.status must be one of ${CAPABILITY_STATUS_VALUES.join(', ')}`;
  }

  if (type === UVENTURE_EVENT_TYPE.LISTING_CHANGED && !isDefined(data.status)) {
    return 'data.status is required on listing.changed';
  }

  return {
    id: data.id,
    kind: kind as CapabilityKind,
    title,
    url: data.url,
    status: isString(data.status) ? (data.status as CapabilityStatus) : null,
    otherDetails: readText(data.otherDetails),
  };
};

const parseChallenge = (data: Record<string, unknown>): ChallengeData | string => {
  if (!isIdentifier(data.id)) {
    return 'data.id missing or not 1 to 100 letters, digits, dot, dash or underscore';
  }

  if (!isHttpsUrl(data.url)) {
    return 'data.url must be an https URL';
  }

  const title = readText(data.title);

  if (title === null) {
    return 'data.title missing';
  }

  if (!isString(data.programme) || !PROGRAMME_VALUES.includes(data.programme)) {
    return `data.programme must be one of ${PROGRAMME_VALUES.join(', ')}`;
  }

  const company = asRecord(data.company);
  const contact = asRecord(data.contact);

  return {
    id: data.id,
    url: data.url,
    title,
    description: readText(data.description, MAX_NEED_LENGTH),
    programme: data.programme as ChallengeProgramme,
    companyName: readText(company?.name),
    companyWebsite: readText(company?.website),
    contact: isDefined(contact)
      ? {
          firstName: readText(contact.firstName),
          lastName: readText(contact.lastName),
          email: readText(contact.email),
          jobTitle: readText(contact.jobTitle),
        }
      : null,
    offeringInterest: isArray(data.offeringInterest)
      ? [...new Set(data.offeringInterest.filter(isString))].filter((offering) =>
          OFFERING_VALUES.includes(offering),
        )
      : [],
  };
};

const parseAgreement = (data: Record<string, unknown>): AgreementData | string => {
  if (!isIdentifier(data.id)) {
    return 'data.id missing or not 1 to 100 letters, digits, dot, dash or underscore';
  }

  if (!isHttpsUrl(data.url)) {
    return 'data.url must be an https URL';
  }

  if (!isString(data.agreementType) || !CONTRACT_KIND_VALUES.includes(data.agreementType)) {
    return `data.agreementType must be one of ${CONTRACT_KIND_VALUES.join(', ')}`;
  }

  const title = readText(data.title);

  if (title === null) {
    return 'data.title missing';
  }

  if (!isString(data.signedOn) || !DATE_PATTERN.test(data.signedOn)) {
    return 'data.signedOn must be a date, YYYY-MM-DD';
  }

  if (isDefined(data.expiresOn) && (!isString(data.expiresOn) || !DATE_PATTERN.test(data.expiresOn))) {
    return 'data.expiresOn must be a date, YYYY-MM-DD';
  }

  const value = asRecord(data.value);

  if (
    isDefined(value) &&
    (!isNumber(value.amount) || value.amount < 0 || !isString(value.currency) || !CURRENCY_PATTERN.test(value.currency))
  ) {
    return 'data.value must be { amount, currency } with a positive amount and a three-letter currency';
  }

  const counterparty = asRecord(data.counterparty);

  return {
    id: data.id,
    url: data.url,
    agreementType: data.agreementType as AgreementData['agreementType'],
    title,
    signedOn: data.signedOn,
    expiresOn: isString(data.expiresOn) ? data.expiresOn : null,
    value: isDefined(value)
      ? {
          amountMicros: Math.round((value.amount as number) * 1_000_000),
          currencyCode: value.currency as string,
        }
      : null,
    counterpartyName: readText(counterparty?.name),
    counterpartyWebsite: readText(counterparty?.website),
    technologyId: isIdentifier(data.technologyId) ? data.technologyId : null,
    crmOpportunityId:
      isString(data.crmOpportunityId) && UUID_PATTERN.test(data.crmOpportunityId)
        ? data.crmOpportunityId
        : null,
  };
};

const parseSignup = (data: Record<string, unknown>): SignupData | string => {
  if (!isIntakeForm(data.form)) {
    return 'data.form must be WEBSITE, GALA_QR or WORKSHOP_SIGNUP';
  }

  const submission = parseSubmission(data.submission);

  return isString(submission) ? submission : { form: data.form, submission };
};

const parseEvent = (value: unknown): UventureEvent | string => {
  const event = asRecord(value);

  if (!isDefined(event)) {
    return 'event is not an object';
  }

  if (!isIdentifier(event.eventId)) {
    return 'eventId missing or not 1 to 100 letters, digits, dot, dash or underscore';
  }

  const where = `event ${event.eventId}`;

  if (!isString(event.type) || !EVENT_TYPE_VALUES.includes(event.type)) {
    return `${where}: type must be one of ${EVENT_TYPE_VALUES.join(', ')}`;
  }

  if (!isNonEmptyString(event.occurredAt) || Number.isNaN(Date.parse(event.occurredAt))) {
    return `${where}: occurredAt must be an ISO 8601 date and time`;
  }

  const data = asRecord(event.data);

  if (!isDefined(data)) {
    return `${where}: data is not an object`;
  }

  const base = {
    eventId: event.eventId,
    occurredAt: new Date(event.occurredAt).toISOString(),
  };
  const type = event.type as UventureEventType;

  switch (type) {
    case UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED:
    case UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED:
    case UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED:
    case UVENTURE_EVENT_TYPE.LISTING_CHANGED: {
      const capability = parseCapability(type, data);

      return isString(capability) ? `${where}: ${capability}` : { ...base, type, capability };
    }
    case UVENTURE_EVENT_TYPE.CHALLENGE_SUBMITTED: {
      const challenge = parseChallenge(data);

      return isString(challenge) ? `${where}: ${challenge}` : { ...base, type, challenge };
    }
    case UVENTURE_EVENT_TYPE.AGREEMENT_SIGNED: {
      const agreement = parseAgreement(data);

      return isString(agreement) ? `${where}: ${agreement}` : { ...base, type, agreement };
    }
    case UVENTURE_EVENT_TYPE.SIGNUP_SUBMITTED: {
      const signup = parseSignup(data);

      return isString(signup) ? `${where}: ${signup}` : { ...base, type, signup };
    }
  }
};

const parseRun = (value: unknown): UventureRun | null | string => {
  if (!isDefined(value)) {
    return null;
  }

  const run = asRecord(value);

  if (
    !isDefined(run) ||
    !isIdentifier(run.runId) ||
    !Number.isInteger(run.page) ||
    !Number.isInteger(run.pageCount) ||
    (run.page as number) < 1 ||
    (run.pageCount as number) > MAX_PAGE_COUNT ||
    (run.page as number) > (run.pageCount as number)
  ) {
    return `run must be { runId, page, pageCount } with 1 <= page <= pageCount <= ${MAX_PAGE_COUNT}`;
  }

  return { runId: run.runId, page: run.page as number, pageCount: run.pageCount as number };
};

// Shape only, whole delivery or nothing: a sender that gets a 400 fixes its
// payload and resends, so no event is half-applied.
export const parseUventureDelivery = (
  rawBody: string,
  deliveryId: string,
): ParsedUventureDelivery => {
  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, reason: 'body is not JSON' };
  }

  const record = asRecord(body);

  if (!isDefined(record)) {
    return { ok: false, status: 400, reason: 'body is not an object' };
  }

  const run = parseRun(record.run);

  if (isString(run)) {
    return { ok: false, status: 400, reason: run };
  }

  const { events } = record;

  if (!isArray(events) || (events.length === 0 && !isDefined(run))) {
    return { ok: false, status: 400, reason: 'events must be a non-empty array' };
  }

  if (events.length > MAX_EVENTS_PER_DELIVERY) {
    return { ok: false, status: 413, reason: `at most ${MAX_EVENTS_PER_DELIVERY} events per delivery` };
  }

  const parsed: UventureEvent[] = [];

  for (const event of events) {
    const result = parseEvent(event);

    if (isString(result)) {
      return { ok: false, status: 400, reason: result };
    }

    parsed.push(result);
  }

  return { ok: true, payload: { deliveryId, run, events: parsed } };
};
