import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  companyDomainFromEmail,
  normaliseCompanyName,
  normaliseDomain,
  parseDate,
  parseMoney,
  parsePhone,
  splitFullName,
} from './normalise.ts';
import { decisionRoleFromTitle } from './value-mapper.ts';

describe('normaliseCompanyName', () => {
  it('drops legal suffixes, punctuation and a leading "the"', () => {
    assert.equal(normaliseCompanyName('Desert Pipes L.L.C.'), 'desert pipes');
    assert.equal(normaliseCompanyName('The Gulf Drilling Co. PJSC'), 'gulf drilling');
    assert.equal(normaliseCompanyName('Falcon Aero FZ-LLC'), 'falcon aero');
    assert.equal(normaliseCompanyName('Smith & Sons Ltd'), 'smith and sons');
  });

  it('keeps a name that is only a suffix word', () => {
    assert.equal(normaliseCompanyName('Company'), 'company');
  });
});

describe('domains', () => {
  it('reduces a website to its host', () => {
    assert.equal(normaliseDomain('https://www.Example.ae/about?x=1'), 'example.ae');
    assert.equal(normaliseDomain('example.co.uk'), 'example.co.uk');
    assert.equal(normaliseDomain('not a site'), null);
  });

  it('ignores public and ISP mail domains', () => {
    assert.equal(companyDomainFromEmail('someone@gmail.com'), null);
    assert.equal(companyDomainFromEmail('someone@emirates.net.ae'), null);
    assert.equal(companyDomainFromEmail('someone@adnoc.ae'), 'adnoc.ae');
  });
});

describe('parseDate', () => {
  it('reads UAE day-first dates', () => {
    assert.equal(parseDate('05/11/2026'), '2026-11-05');
    assert.equal(parseDate('5.11.26'), '2026-11-05');
  });

  it('swaps a US-formatted date whose second part cannot be a month', () => {
    assert.equal(parseDate('11/25/2026'), '2026-11-25');
  });

  it('reads ISO, month names and Excel serial numbers', () => {
    assert.equal(parseDate('2026-10-20'), '2026-10-20');
    assert.equal(parseDate('2026-10-20T09:00:00Z'), '2026-10-20');
    assert.equal(parseDate('16-Oct-2026'), '2026-10-16');
    assert.equal(parseDate('October 16, 2026'), '2026-10-16');
    assert.equal(parseDate('46311'), '2026-10-16');
  });

  it('rejects impossible dates and text', () => {
    assert.equal(parseDate('31/02/2026'), null);
    assert.equal(parseDate('next week'), null);
  });
});

describe('parseMoney', () => {
  it('reads amounts with separators, suffixes and currency codes', () => {
    assert.deepEqual(parseMoney('AED 1,200,000'), { amount: 1_200_000, currencyCode: 'AED' });
    assert.deepEqual(parseMoney('250k'), { amount: 250_000, currencyCode: null });
    assert.deepEqual(parseMoney('1.5M USD'), { amount: 1_500_000, currencyCode: 'USD' });
    assert.equal(parseMoney('TBC'), null);
  });
});

describe('parsePhone', () => {
  it('splits UAE numbers into +971 and the national number', () => {
    assert.deepEqual(parsePhone('050 123 4567'), { number: '501234567', callingCode: '+971' });
    assert.deepEqual(parsePhone('00971 2 555 0000'), { number: '25550000', callingCode: '+971' });
    assert.deepEqual(parsePhone('+971-50-1234567'), { number: '501234567', callingCode: '+971' });
  });

  it('keeps other international numbers whole', () => {
    assert.deepEqual(parsePhone('+44 20 7946 0000'), { number: '+442079460000', callingCode: '' });
  });
});

describe('splitFullName', () => {
  it('drops titles and keeps the family name whole', () => {
    assert.deepEqual(splitFullName('Dr. Mohammed bin Rashid Al Maktoum'), {
      firstName: 'Mohammed',
      lastName: 'bin Rashid Al Maktoum',
    });
    assert.deepEqual(splitFullName('Eng. Sara'), { firstName: 'Sara', lastName: '' });
  });
});

describe('decisionRoleFromTitle', () => {
  it('reads the role from common titles', () => {
    assert.equal(decisionRoleFromTitle('Chief Executive Officer'), 'DECISION_MAKER');
    assert.equal(decisionRoleFromTitle('VP Operations'), 'DECISION_MAKER');
    assert.equal(decisionRoleFromTitle('CFO'), 'BUDGET_HOLDER');
    assert.equal(decisionRoleFromTitle('R&D Manager'), 'TECHNICAL_EVALUATOR');
    assert.equal(decisionRoleFromTitle('Senior Process Engineer'), 'TECHNICAL_EVALUATOR');
    assert.equal(decisionRoleFromTitle('Business Development Manager'), 'INFLUENCER');
    assert.equal(decisionRoleFromTitle('Maintenance Technician'), 'END_USER');
    assert.equal(decisionRoleFromTitle('Executive Assistant to the CEO'), 'GATEKEEPER');
    assert.equal(decisionRoleFromTitle('Procurement Officer'), 'GATEKEEPER');
  });

  it('leaves titles that say nothing about the role empty', () => {
    assert.equal(decisionRoleFromTitle('Student'), null);
    assert.equal(decisionRoleFromTitle(''), null);
  });
});
