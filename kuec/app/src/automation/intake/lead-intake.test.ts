import { describe, expect, it } from 'vitest';

import {
  MAX_SUBMISSIONS_PER_DELIVERY,
  parseLeadIntakeBody,
} from 'src/automation/intake/lead-intake-payload';
import {
  normaliseDomain,
  planIntakeLead,
} from 'src/automation/intake/plan-intake-lead';
import {
  signDelivery,
  verifySignature,
} from 'src/automation/intake/verify-signature';

const SECRET = 'current-secret';
const PREVIOUS_SECRET = 'previous-secret';
const NOW = new Date('2026-10-17T06:00:00.000Z');
const TIMESTAMP = String(NOW.getTime() / 1000);
const BODY = JSON.stringify({
  form: 'GALA_QR',
  submissions: [{ submissionId: 'scan-0001', firstName: 'Mariam', lastName: 'Al Hosani', email: 'mariam@adnoc.ae' }],
});

const signedHeaders = (secret: string, rawBody = BODY, timestamp = TIMESTAMP) => ({
  'X-Kuec-Timestamp': timestamp,
  'x-kuec-signature': signDelivery({ secret, timestamp, rawBody }),
  'x-kuec-delivery': 'delivery-1',
});

describe('lead intake signature', () => {
  const check = (headers: Record<string, string | undefined>, rawBody = BODY, now = NOW) =>
    verifySignature({ headers, rawBody, secrets: [SECRET, PREVIOUS_SECRET], now });

  it('accepts a delivery signed with the current or the previous secret', () => {
    expect(check(signedHeaders(SECRET))).toEqual({ ok: true });
    expect(check(signedHeaders(PREVIOUS_SECRET))).toEqual({ ok: true });
  });

  it('refuses a wrong secret and a body changed by one byte', () => {
    expect(check(signedHeaders('someone-else'))).toEqual({ ok: false, reason: 'BAD_SIGNATURE' });
    expect(check(signedHeaders(SECRET), BODY.replace('0001', '0002'))).toEqual({
      ok: false,
      reason: 'BAD_SIGNATURE',
    });
  });

  it('refuses a timestamp more than 5 minutes away, either way', () => {
    expect(check(signedHeaders(SECRET), BODY, new Date(NOW.getTime() + 300_000))).toEqual({ ok: true });
    expect(check(signedHeaders(SECRET), BODY, new Date(NOW.getTime() + 301_000))).toEqual({
      ok: false,
      reason: 'STALE_TIMESTAMP',
    });
    expect(check(signedHeaders(SECRET), BODY, new Date(NOW.getTime() - 301_000))).toEqual({
      ok: false,
      reason: 'STALE_TIMESTAMP',
    });
    expect(check(signedHeaders(SECRET, BODY, 'yesterday'))).toEqual({ ok: false, reason: 'STALE_TIMESTAMP' });
  });

  it('refuses a missing header, and everything while no secret is set', () => {
    expect(check({ ...signedHeaders(SECRET), 'x-kuec-signature': undefined })).toEqual({
      ok: false,
      reason: 'MISSING_HEADER',
    });
    expect(
      verifySignature({ headers: signedHeaders(SECRET), rawBody: BODY, secrets: [undefined, ''], now: NOW }),
    ).toEqual({ ok: false, reason: 'NOT_CONFIGURED' });
  });
});

describe('lead intake body', () => {
  it('keeps known offerings and a well-formed campaign id, and drops the rest', () => {
    const parsed = parseLeadIntakeBody(
      JSON.stringify({
        form: 'WORKSHOP_SIGNUP',
        submissions: [
          {
            submissionId: 'reg-17',
            email: ' Omar@Example.com ',
            offeringInterest: ['LAB_TESTING', 'MAGIC', 'LAB_TESTING'],
            campaignId: '0f8c4a52-6d0e-4b8e-9d1c-3a7f2e5b9c10',
          },
          { submissionId: 'reg-18', companyName: 'Strata', campaignId: 'not-a-uuid' },
        ],
      }),
      'delivery-2',
    );

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      expect(parsed.payload.submissions[0]).toMatchObject({
        email: 'Omar@Example.com',
        offeringInterest: ['LAB_TESTING'],
        campaignId: '0f8c4a52-6d0e-4b8e-9d1c-3a7f2e5b9c10',
      });
      expect(parsed.payload.submissions[1].campaignId).toBeNull();
    }
  });

  it('refuses what cannot become a lead', () => {
    expect(parseLeadIntakeBody('not json', 'd')).toMatchObject({ ok: false, status: 400 });
    expect(parseLeadIntakeBody(JSON.stringify({ form: 'FAX', submissions: [] }), 'd')).toMatchObject({
      ok: false,
      status: 400,
    });
    expect(
      parseLeadIntakeBody(JSON.stringify({ form: 'WEBSITE', submissions: [{ submissionId: 'x 1' }] }), 'd'),
    ).toMatchObject({ ok: false, status: 400 });
    expect(
      parseLeadIntakeBody(JSON.stringify({ form: 'WEBSITE', submissions: [{ submissionId: 'web-1' }] }), 'd'),
    ).toMatchObject({ ok: false, status: 400, reason: 'submission web-1 has no email, name or company' });
    expect(
      parseLeadIntakeBody(
        JSON.stringify({
          form: 'WEBSITE',
          submissions: Array.from({ length: MAX_SUBMISSIONS_PER_DELIVERY + 1 }, (_, index) => ({
            submissionId: `web-${index}`,
            email: `person${index}@example.com`,
          })),
        }),
        'd',
      ),
    ).toMatchObject({ ok: false, status: 413 });
  });
});

describe('lead intake mapping', () => {
  const submission = {
    submissionId: 'scan-0001',
    firstName: 'Mariam',
    lastName: 'Al Hosani',
    email: 'Mariam@ADNOC.ae',
    jobTitle: 'Head of R&D',
    companyName: 'ADNOC',
    companyWebsite: 'https://www.adnoc.ae/en',
    need: 'Membrane testing for produced water',
    offeringInterest: ['LAB_TESTING'],
    campaignId: null,
  };

  it('sets the source and the external id from the form, so no contact is retyped', () => {
    expect(planIntakeLead('GALA_QR', submission)).toEqual({
      externalId: 'gala:scan-0001',
      lead: {
        name: 'Mariam Al Hosani, ADNOC',
        status: 'NEW',
        source: 'GALA_QR',
        sourceSystem: 'GALA_QR_FORM',
        externalId: 'gala:scan-0001',
        need: 'Membrane testing for produced water',
        offeringInterest: ['LAB_TESTING'],
      },
      person: {
        firstName: 'Mariam',
        lastName: 'Al Hosani',
        email: 'mariam@adnoc.ae',
        jobTitle: 'Head of R&D',
      },
      company: { name: 'ADNOC', domain: 'adnoc.ae' },
    });
    expect(planIntakeLead('WORKSHOP_SIGNUP', submission).lead).toMatchObject({
      source: 'WORKSHOP',
      externalId: 'workshop:scan-0001',
    });
    expect(planIntakeLead('WEBSITE', submission).lead).toMatchObject({
      source: 'INBOUND',
      sourceSystem: 'WEBSITE_FORM',
    });
  });

  it('names the lead from what the form had', () => {
    const bare = { ...submission, firstName: null, lastName: null, companyName: null, companyWebsite: null };

    expect(planIntakeLead('WEBSITE', bare).lead.name).toBe('mariam@adnoc.ae');
    expect(planIntakeLead('WEBSITE', bare).company).toBeNull();
    expect(
      planIntakeLead('WEBSITE', { ...bare, email: null, companyWebsite: 'strata.ae' }),
    ).toMatchObject({ person: null, company: { name: 'strata.ae', domain: 'strata.ae' } });
  });

  it('reduces a website to its domain', () => {
    expect(normaliseDomain('HTTPS://www.Example.co.ae/contact?x=1')).toBe('example.co.ae');
    expect(normaliseDomain('not a domain')).toBeNull();
  });
});
