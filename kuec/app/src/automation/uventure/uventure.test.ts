import { describe, expect, it } from 'vitest';

import {
  DELIVERY_HEADER,
  SIGNATURE_HEADER,
  signDelivery,
  TIMESTAMP_HEADER,
  verifySignature,
} from 'src/automation/intake/verify-signature';
import {
  outboundDeliveryId,
  planEngagementOnTechnology,
  planLeadConverted,
  planLicenceSigned,
  UVENTURE_OUTBOUND_EVENT_TYPE,
  type OutboundRelated,
} from 'src/automation/uventure/outbound/plan-outbound-event';
import {
  isStaleEvent,
  planCapabilityUpsert,
  planChallengeLead,
  planContractUpsert,
  stopsAnOffer,
  uventureIdOf,
} from 'src/automation/uventure/plan-uventure-records';
import {
  type AgreementData,
  type CapabilityData,
  MAX_EVENTS_PER_DELIVERY,
  parseUventureDelivery,
  UVENTURE_EVENT_TYPE,
} from 'src/automation/uventure/uventure-payload';
import { isFeedSilent } from 'src/automation/uventure/uventure-run-ledger';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_SOURCE } from 'src/fields/source-on-opportunity.field';
import { CAPABILITY_KIND, CAPABILITY_STATUS } from 'src/objects/capability.object';
import { CONTRACT_STATUS } from 'src/objects/contract.object';
import { LEAD_SOURCE_SYSTEM, LEAD_STATUS } from 'src/objects/lead.object';

const NOW = new Date('2026-10-18T05:00:00.000Z');
const OPPORTUNITY_ID = '6f3c3a0e-0000-4000-8000-000000000001';
const SECRET = 'uventure-test-secret';

const event = (type: string, data: Record<string, unknown>, eventId = 'evt-1') => ({
  eventId,
  type,
  occurredAt: '2026-10-18T01:00:00+04:00',
  data,
});

const TECHNOLOGY = {
  id: 'TECH-0042',
  title: 'Low-cost desalination membrane',
  url: 'https://uventure.kuec.example/technologies/TECH-0042',
};

const parse = (body: unknown) => parseUventureDelivery(JSON.stringify(body), 'delivery-1');

describe('uVENTURE route: signature (runbooks/16-integration-map.md section 2.4)', () => {
  const rawBody = JSON.stringify({ events: [event(UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED, TECHNOLOGY)] });
  const timestamp = String(Math.floor(NOW.getTime() / 1000));
  const headers = (overrides: Record<string, string> = {}) => ({
    [TIMESTAMP_HEADER]: timestamp,
    [SIGNATURE_HEADER]: signDelivery({ secret: SECRET, timestamp, rawBody }),
    [DELIVERY_HEADER]: 'delivery-1',
    ...overrides,
  });

  it('accepts the current secret, then the previous one, and refuses anything else', () => {
    expect(verifySignature({ headers: headers(), rawBody, secrets: [SECRET, null], now: NOW })).toEqual({ ok: true });
    expect(verifySignature({ headers: headers(), rawBody, secrets: ['rotated', SECRET], now: NOW })).toEqual({ ok: true });
    expect(verifySignature({ headers: headers(), rawBody, secrets: ['other'], now: NOW })).toEqual({
      ok: false,
      reason: 'BAD_SIGNATURE',
    });
    expect(verifySignature({ headers: headers(), rawBody: `${rawBody} `, secrets: [SECRET], now: NOW })).toEqual({
      ok: false,
      reason: 'BAD_SIGNATURE',
    });
    expect(
      verifySignature({ headers: headers(), rawBody, secrets: [SECRET], now: new Date(NOW.getTime() + 301_000) }),
    ).toEqual({ ok: false, reason: 'STALE_TIMESTAMP' });
    expect(verifySignature({ headers: headers(), rawBody, secrets: [undefined, ''], now: NOW })).toEqual({
      ok: false,
      reason: 'NOT_CONFIGURED',
    });
  });
});

describe('uVENTURE route: delivery shape', () => {
  it('accepts every event type the contract names', () => {
    const parsed = parse({
      events: [
        event(UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED, TECHNOLOGY, 'e1'),
        event(UVENTURE_EVENT_TYPE.DISCLOSURE_CREATED, { ...TECHNOLOGY, id: 'DISC-7' }, 'e2'),
        event(
          UVENTURE_EVENT_TYPE.LISTING_CHANGED,
          { ...TECHNOLOGY, id: 'EQ-3', kind: 'EQUIPMENT', status: 'UNAVAILABLE' },
          'e3',
        ),
        event(
          UVENTURE_EVENT_TYPE.CHALLENGE_SUBMITTED,
          {
            id: 'CH-9',
            url: 'https://uventure.kuec.example/challenges/CH-9',
            title: 'Corrosion monitoring for offshore pipes',
            programme: 'CHALLENGE_SPRINT',
            company: { name: 'Gulf Pipelines', website: 'gulfpipelines.example' },
            contact: { firstName: 'Mariam', lastName: 'Al Ali', email: 'mariam@gulfpipelines.example' },
          },
          'e4',
        ),
        event(
          UVENTURE_EVENT_TYPE.AGREEMENT_SIGNED,
          {
            id: 'AGR-1',
            url: 'https://uventure.kuec.example/agreements/AGR-1',
            agreementType: 'LICENCE',
            title: 'Membrane licence, Gulf Water',
            signedOn: '2026-10-15',
            value: { amount: 250000, currency: 'AED' },
            counterparty: { name: 'Gulf Water', website: 'https://gulfwater.example' },
            technologyId: 'TECH-0042',
            crmOpportunityId: OPPORTUNITY_ID,
          },
          'e5',
        ),
        event(
          UVENTURE_EVENT_TYPE.SIGNUP_SUBMITTED,
          { form: 'GALA_QR', submission: { submissionId: 'S-1', email: 'guest@example.com' } },
          'e6',
        ),
      ],
    });

    expect(parsed.ok).toBe(true);

    if (!parsed.ok) {
      return;
    }

    expect(parsed.payload.events.map(({ type }) => type)).toEqual(Object.values(UVENTURE_EVENT_TYPE).filter(
      (type) => type !== UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED,
    ));
    expect(parsed.payload.events[1]).toMatchObject({
      capability: { kind: CAPABILITY_KIND.INVENTION_DISCLOSURE },
    });
    expect(parsed.payload.events[4]).toMatchObject({
      agreement: { value: { amountMicros: 250_000_000_000, currencyCode: 'AED' } },
    });
  });

  it('refuses the whole delivery for one bad event, so nothing is half-applied', () => {
    const cases: [unknown, number, RegExp][] = [
      [{ events: [event(UVENTURE_EVENT_TYPE.TECHNOLOGY_CREATED, { ...TECHNOLOGY, url: 'http://insecure.example' })] }, 400, /https URL/],
      [{ events: [event(UVENTURE_EVENT_TYPE.LISTING_CHANGED, { ...TECHNOLOGY, kind: 'LAB' })] }, 400, /status is required/],
      [{ events: [event('technology.deleted', TECHNOLOGY)] }, 400, /type must be one of/],
      [{ events: [event(UVENTURE_EVENT_TYPE.CHALLENGE_SUBMITTED, { ...TECHNOLOGY, programme: 'HACKATHON' })] }, 400, /programme/],
      [{ events: [] }, 400, /non-empty/],
      [{ run: { runId: 'r1', page: 3, pageCount: 2 }, events: [] }, 400, /page <= pageCount/],
      [
        { events: Array.from({ length: MAX_EVENTS_PER_DELIVERY + 1 }, (_, index) => event(UVENTURE_EVENT_TYPE.TECHNOLOGY_UPDATED, TECHNOLOGY, `e${index}`)) },
        413,
        /at most 100/,
      ],
    ];

    for (const [body, status, reason] of cases) {
      const parsed = parse(body);

      expect(parsed.ok).toBe(false);
      expect(parsed.ok ? null : parsed.status).toBe(status);
      expect(parsed.ok ? '' : parsed.reason).toMatch(reason);
    }
  });

  it('accepts an empty last page of a nightly run', () => {
    expect(parse({ run: { runId: '2026-10-18', page: 3, pageCount: 3 }, events: [] })).toMatchObject({
      ok: true,
      payload: { run: { runId: '2026-10-18', page: 3, pageCount: 3 }, events: [] },
    });
  });
});

describe('Capability pointer upsert', () => {
  const capability: CapabilityData = {
    id: 'EQ-3',
    kind: CAPABILITY_KIND.EQUIPMENT,
    title: 'Scanning electron microscope',
    url: 'https://uventure.kuec.example/equipment/EQ-3',
    status: CAPABILITY_STATUS.AVAILABLE,
    otherDetails: null,
  };
  const existing = {
    id: 'cap-1',
    name: capability.title,
    kind: capability.kind,
    status: CAPABILITY_STATUS.AVAILABLE,
    uventureRecord: { primaryLinkUrl: capability.url },
    otherDetails: null,
  };

  it('creates a pointer keyed on the uVENTURE id, owned by uVENTURE', () => {
    expect(planCapabilityUpsert({ capability, existing: null, now: NOW })).toMatchObject({
      action: 'create',
      values: {
        externalId: 'uventure:EQ-3',
        sourceSystem: 'UVENTURE',
        name: capability.title,
        status: CAPABILITY_STATUS.AVAILABLE,
        lastSeenInUventureAt: NOW.toISOString(),
      },
    });
  });

  it('only moves Last seen when nothing changed', () => {
    expect(planCapabilityUpsert({ capability, existing, now: NOW })).toEqual({
      action: 'touch',
      recordId: 'cap-1',
      values: {
        lastSeenInUventureAt: NOW.toISOString(),
        staleFrom: '2026-10-25T05:00:00.000Z',
      },
      statusChange: null,
    });
  });

  it('records a status change and tells case owners only when the offer stops', () => {
    const plan = planCapabilityUpsert({
      capability: { ...capability, status: CAPABILITY_STATUS.UNAVAILABLE },
      existing,
      now: NOW,
    });

    expect(plan).toMatchObject({
      action: 'update',
      values: { status: CAPABILITY_STATUS.UNAVAILABLE, statusChangedAt: NOW.toISOString() },
    });
    expect(stopsAnOffer(plan.statusChange)).toBe(true);
    expect(
      stopsAnOffer(
        planCapabilityUpsert({ capability: { ...capability, status: CAPABILITY_STATUS.LIMITED }, existing, now: NOW })
          .statusChange,
      ),
    ).toBe(false);
  });

  it('leaves the status alone when the event does not carry one', () => {
    expect(
      planCapabilityUpsert({ capability: { ...capability, status: null, title: 'SEM, renamed' }, existing, now: NOW }),
    ).toMatchObject({ action: 'update', values: { name: 'SEM, renamed' }, statusChange: null });
  });

  it('skips an event older than the last one applied', () => {
    expect(isStaleEvent('2026-10-18T00:00:00.000Z', '2026-10-18T01:00:00.000Z')).toBe(true);
    expect(isStaleEvent('2026-10-18T01:00:00.000Z', '2026-10-18T01:00:00.000Z')).toBe(false);
    expect(isStaleEvent('2026-10-18T01:00:00.000Z', null)).toBe(false);
  });
});

describe('Contract from a signed uVENTURE agreement', () => {
  const agreement: AgreementData = {
    id: 'AGR-1',
    url: 'https://uventure.kuec.example/agreements/AGR-1',
    agreementType: 'LICENCE',
    title: 'Membrane licence, Gulf Water',
    signedOn: '2026-10-15',
    expiresOn: '2031-10-14',
    value: { amountMicros: 250_000_000_000, currencyCode: 'AED' },
    counterpartyName: 'Gulf Water',
    counterpartyWebsite: 'gulfwater.example',
    technologyId: 'TECH-0042',
    crmOpportunityId: OPPORTUNITY_ID,
  };
  const links = {
    opportunity: { id: OPPORTUNITY_ID, ownerId: 'member-bd', companyId: 'company-gw' },
    counterpartyId: 'company-gw',
    capabilityId: 'cap-tech-42',
  };

  it('creates a Signed contract linked to its case, owner and technology', () => {
    expect(planContractUpsert({ agreement, existing: null, placeholder: null, links })).toMatchObject({
      action: 'create',
      recordId: null,
      needsLinking: false,
      values: {
        externalId: 'uventure:AGR-1',
        sourceSystem: 'UVENTURE',
        kind: 'LICENCE',
        status: CONTRACT_STATUS.SIGNED,
        signedOn: '2026-10-15',
        opportunityId: OPPORTUNITY_ID,
        ownerId: 'member-bd',
        capabilityId: 'cap-tech-42',
      },
    });
  });

  it('adopts the contract W7 made for the same case instead of adding a second', () => {
    const placeholder = {
      id: 'contract-w7',
      kind: 'LICENCE',
      externalId: null,
      opportunityId: OPPORTUNITY_ID,
      counterpartyId: 'company-gw',
      capabilityId: null,
      ownerId: 'member-bd',
    };

    expect(planContractUpsert({ agreement, existing: null, placeholder, links })).toMatchObject({
      action: 'adopt',
      recordId: 'contract-w7',
      values: { externalId: 'uventure:AGR-1', capabilityId: 'cap-tech-42' },
    });
  });

  it('keeps a person-set counterparty and asks for linking when no case matched', () => {
    const existing = {
      id: 'contract-1',
      kind: 'LICENCE',
      externalId: 'uventure:AGR-1',
      opportunityId: null,
      counterpartyId: 'company-corrected',
      capabilityId: null,
      ownerId: null,
    };
    const plan = planContractUpsert({
      agreement: { ...agreement, crmOpportunityId: null },
      existing,
      placeholder: null,
      links: { opportunity: null, counterpartyId: 'company-gw', capabilityId: null },
    });

    expect(plan.action).toBe('update');
    expect(plan.values).not.toHaveProperty('counterpartyId');
    expect(plan.needsLinking).toBe(true);
  });
});

describe('Lead from a uVENTURE challenge', () => {
  it('takes its source from the programme and carries the challenge link', () => {
    const plan = planChallengeLead({
      id: 'CH-9',
      url: 'https://uventure.kuec.example/challenges/CH-9',
      title: 'Corrosion monitoring for offshore pipes',
      description: 'Sensors that survive 10 years subsea.',
      programme: 'TECHNICAL_COMMITTEE',
      companyName: null,
      companyWebsite: 'https://www.gulfpipelines.example/',
      contact: { firstName: 'Mariam', lastName: 'Al Ali', email: 'Mariam@GulfPipelines.example', jobTitle: null },
      offeringInterest: [],
    });

    expect(plan).toMatchObject({
      externalId: 'uventure:CH-9',
      lead: {
        status: LEAD_STATUS.NEW,
        source: OPPORTUNITY_SOURCE.TECHNICAL_COMMITTEE,
        sourceSystem: LEAD_SOURCE_SYSTEM.UVENTURE,
        uventureRecord: { primaryLinkUrl: 'https://uventure.kuec.example/challenges/CH-9' },
      },
      person: { email: 'mariam@gulfpipelines.example' },
      company: { name: 'gulfpipelines.example', domain: 'gulfpipelines.example' },
    });
  });
});

describe('Twenty to uVENTURE events', () => {
  const related: OutboundRelated = {
    crmBaseUrl: 'https://crm.uventure.kuec.example',
    company: { name: 'Gulf Water', domain: 'gulfwater.example' },
    ownerEmail: 'officer@kuec.example',
    capability: {
      id: '6f3c3a0e-0000-4000-8000-0000000000aa',
      externalId: 'uventure:TECH-0042',
      kind: CAPABILITY_KIND.TECHNOLOGY,
      url: TECHNOLOGY.url,
    },
  };
  const opportunity = {
    id: OPPORTUNITY_ID,
    name: 'Membrane licence',
    stage: OPPORTUNITY_STAGE.SIGNED,
    playbookType: 'TECHNOLOGY_LICENSING',
    stageEnteredAt: '2026-10-15T08:00:00.000Z',
    amount: { amountMicros: 250_000_000_000, currencyCode: 'AED' },
    uventureRecord: { primaryLinkUrl: TECHNOLOGY.url },
    updatedAt: '2026-10-15T08:00:00.000Z',
  };

  it('sends a signed Licence opportunity with its technology, and nothing else', () => {
    expect(planLicenceSigned({ opportunity, related })).toMatchObject({
      deliveryId: `crm-licence-signed-${OPPORTUNITY_ID}`,
      body: {
        type: UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED,
        data: {
          crmOpportunityId: OPPORTUNITY_ID,
          crmUrl: `https://crm.uventure.kuec.example/object/opportunity/${OPPORTUNITY_ID}`,
          technology: { uventureId: 'TECH-0042' },
          value: { amount: 250000, currency: 'AED' },
        },
      },
    });
    expect(planLicenceSigned({ opportunity: { ...opportunity, stage: OPPORTUNITY_STAGE.PROPOSAL }, related })).toBeNull();
    expect(planLicenceSigned({ opportunity: { ...opportunity, playbookType: 'TECHNICAL_SERVICE' }, related })).toBeNull();
  });

  it('sends a converted lead only when IP licence is among its interests', () => {
    const lead = {
      id: 'lead-1',
      name: 'Gulf Water',
      status: LEAD_STATUS.CONVERTED,
      offeringInterest: ['LAB_TESTING', 'IP_LICENCE'],
      convertedOpportunityId: OPPORTUNITY_ID,
      uventureRecord: null,
      updatedAt: '2026-10-16T08:00:00.000Z',
    };

    expect(planLeadConverted({ lead, related })?.body.data).toMatchObject({ crmOpportunityId: OPPORTUNITY_ID });
    expect(planLeadConverted({ lead: { ...lead, offeringInterest: ['LAB_TESTING'] }, related })).toBeNull();
    expect(planLeadConverted({ lead: { ...lead, status: LEAD_STATUS.QUALIFIED }, related })).toBeNull();
  });

  it('sends an engagement on a technology or disclosure, not on a lab', () => {
    const engagement = {
      id: 'eng-1',
      name: 'Demo at Gulf Water',
      kind: 'DISCOVERY_MEETING',
      date: '2026-10-16T06:00:00.000Z',
      outcome: null,
      updatedAt: '2026-10-16T08:00:00.000Z',
    };

    expect(planEngagementOnTechnology({ engagement, related })?.deliveryId).toBe(
      `crm-engagement-eng-1-${related.capability?.id}`,
    );
    expect(
      planEngagementOnTechnology({
        engagement,
        related: { ...related, capability: { ...related.capability!, kind: CAPABILITY_KIND.LAB } },
      }),
    ).toBeNull();
  });

  it('keeps every delivery id inside the 100-character limit of the routes', () => {
    const longest = outboundDeliveryId({
      type: UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY,
      recordId: `${OPPORTUNITY_ID}-${OPPORTUNITY_ID}`,
    });

    expect(longest.length).toBeLessThanOrEqual(100);
    expect(uventureIdOf('uventure:TECH-0042')).toBe('TECH-0042');
    expect(uventureIdOf('registry:CN-1')).toBeNull();
  });
});

describe('uVENTURE snapshot watchdog', () => {
  it('raises after 26 hours without a complete nightly run, or when none ever arrived', () => {
    expect(isFeedSilent(null, NOW)).toBe(true);
    expect(isFeedSilent({ runId: 'r', completedAt: '2026-10-17T02:30:00.000Z' }, NOW)).toBe(true);
    expect(isFeedSilent({ runId: 'r', completedAt: '2026-10-17T21:05:00.000Z' }, NOW)).toBe(false);
  });
});
