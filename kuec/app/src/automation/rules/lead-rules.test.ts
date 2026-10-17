import { describe, expect, it } from 'vitest';

import { planAutoDead } from 'src/automation/rules/lead-auto-dead.rule';
import { planContactSlaEscalations } from 'src/automation/rules/lead-contact-sla.rule';
import {
  buildConvertedOpportunity,
  needsConversion,
  pickOpportunityType,
} from 'src/automation/rules/lead-conversion.rule';
import {
  computeQualificationScore,
  isLicenceGradeLead,
  planQualification,
} from 'src/automation/rules/lead-qualification.rule';
import {
  planReferralCredit,
  planReferralThanks,
} from 'src/automation/rules/lead-referral.rule';
import { planLeadStatusEntry } from 'src/automation/rules/lead-status.rule';
import { planLeadTriage } from 'src/automation/rules/lead-triage.rule';

const NO_HOLIDAYS = new Set<string>();
const UNCHECKED = {
  needIdentified: false,
  decisionMakerReached: false,
  capabilityMatched: false,
  fundingPathIdentified: false,
  timingKnown: false,
};

describe('L1 triage', () => {
  // Thursday 15 October 2026, 10:00 in Dubai
  const now = new Date('2026-10-15T06:00:00.000Z');
  const newLead = {
    ...UNCHECKED,
    status: 'NEW' as const,
    ownerId: null,
    referredByMemberId: null,
    playbookApplied: false,
    statusEnteredAt: null,
    qualificationScore: null,
    createdAt: '2026-10-15T05:58:00.000Z',
    createdBy: { source: 'MANUAL', workspaceMemberId: 'member-omar' },
  };

  it('gives an ownerless lead to the ops coordinator, due next business day at 17:00', () => {
    const plan = planLeadTriage({
      lead: newLead,
      opsCoordinatorMemberId: 'member-sara',
      holidays: NO_HOLIDAYS,
      now,
    });

    expect(plan?.changes).toEqual({
      ownerId: 'member-sara',
      statusEnteredAt: '2026-10-15T05:58:00.000Z',
      qualificationScore: 0,
      referredByMemberId: 'member-omar',
    });
    expect(plan?.taskAssigneeId).toBe('member-sara');
    // Friday 16 October 17:00 Dubai
    expect(plan?.taskDueAt).toBe('2026-10-16T13:00:00.000Z');
  });

  it('skips the weekend and holidays for the triage due date', () => {
    const friday = new Date('2026-10-16T06:00:00.000Z');
    const plan = planLeadTriage({
      lead: newLead,
      opsCoordinatorMemberId: 'member-sara',
      holidays: new Set(['2026-10-19']),
      now: friday,
    });

    // Monday is a holiday, so Tuesday 20 October 17:00 Dubai
    expect(plan?.taskDueAt).toBe('2026-10-20T13:00:00.000Z');
  });

  it('keeps an owner, a named colleague and a status someone already set', () => {
    const plan = planLeadTriage({
      lead: {
        ...newLead,
        status: 'CONTACTED',
        ownerId: 'member-aisha',
        referredByMemberId: 'member-khalid',
        statusEnteredAt: '2026-10-14T06:00:00.000Z',
      },
      opsCoordinatorMemberId: 'member-sara',
      holidays: NO_HOLIDAYS,
      now,
    });

    expect(plan?.changes).toEqual({ qualificationScore: 0 });
    expect(plan?.taskAssigneeId).toBe('member-aisha');
  });

  it('credits nobody for a lead an integration or an import created', () => {
    for (const source of ['API', 'IMPORT', 'APPLICATION']) {
      const plan = planLeadTriage({
        lead: { ...newLead, createdBy: { source, workspaceMemberId: null } },
        opsCoordinatorMemberId: 'member-sara',
        holidays: NO_HOLIDAYS,
        now,
      });

      expect(plan?.changes).not.toHaveProperty('referredByMemberId');
    }
  });

  it('runs once: the guard stops a second triage', () => {
    expect(
      planLeadTriage({
        lead: { ...newLead, playbookApplied: true },
        opsCoordinatorMemberId: 'member-sara',
        holidays: NO_HOLIDAYS,
        now,
      }),
    ).toBeNull();
  });
});

describe('L2 contact SLA', () => {
  // Entered New on Thursday 15 October 2026, 10:00 Dubai
  const lead = {
    id: 'lead-1',
    status: 'NEW' as const,
    statusEnteredAt: '2026-10-15T06:00:00.000Z',
    createdAt: '2026-10-15T05:00:00.000Z',
    contactNudgeSentAt: null,
    contactEdNotifiedAt: null,
  };

  it('nudges the owner after 3 business days, not before', () => {
    // 3 business days after Thursday is Tuesday 20 October, 10:00 Dubai
    expect(
      planContactSlaEscalations({ lead, holidays: NO_HOLIDAYS, now: new Date('2026-10-20T05:59:00.000Z') }),
    ).toEqual([]);

    const [nudge, ...rest] = planContactSlaEscalations({
      lead,
      holidays: NO_HOLIDAYS,
      now: new Date('2026-10-20T06:00:00.000Z'),
    });

    expect(rest).toEqual([]);
    expect(nudge).toMatchObject({ level: 1, stampField: 'contactNudgeSentAt' });
    expect(nudge.dedupeKey).toBe(`lead-contact-lead-1-${Date.parse(lead.statusEnteredAt)}-l1`);
  });

  it('tells the ED after 7 business days, holidays excluded', () => {
    // 7 business days after Thursday 15 is Monday 26; a holiday on Wednesday 21 moves it to Tuesday 27
    const holidays = new Set(['2026-10-21']);
    const nudged = { ...lead, contactNudgeSentAt: '2026-10-20T06:00:00.000Z' };

    expect(
      planContactSlaEscalations({ lead: nudged, holidays, now: new Date('2026-10-26T06:30:00.000Z') }),
    ).toEqual([]);
    expect(
      planContactSlaEscalations({ lead: nudged, holidays, now: new Date('2026-10-27T06:00:00.000Z') }).map(
        ({ level }) => level,
      ),
    ).toEqual([2]);
  });

  it('never repeats a level for the same clock, and restarts when the lead re-enters New', () => {
    const fired = {
      ...lead,
      contactNudgeSentAt: '2026-10-20T06:00:00.000Z',
      contactEdNotifiedAt: '2026-10-26T06:00:00.000Z',
    };
    // 7 business days after Friday 20 November is Tuesday 1 December
    const later = new Date('2026-12-01T06:00:00.000Z');

    expect(planContactSlaEscalations({ lead: fired, holidays: NO_HOLIDAYS, now: later })).toEqual([]);
    expect(
      planContactSlaEscalations({
        lead: { ...fired, statusEnteredAt: '2026-11-20T06:00:00.000Z' },
        holidays: NO_HOLIDAYS,
        now: later,
      }).map(({ level }) => level),
    ).toEqual([1, 2]);
  });

  it('only watches New leads', () => {
    for (const status of ['CONTACTED', 'ENGAGED', 'QUALIFIED', 'NURTURE', 'DEAD', 'CONVERTED'] as const) {
      expect(
        planContactSlaEscalations({
          lead: { ...lead, status },
          holidays: NO_HOLIDAYS,
          now: new Date('2026-12-01T06:00:00.000Z'),
        }),
      ).toEqual([]);
    }
  });
});

describe('L3 auto-dead', () => {
  const lead = {
    id: 'lead-2',
    status: 'CONTACTED' as const,
    statusEnteredAt: '2026-09-15T06:00:00.000Z',
    lastEngagementAt: null,
    createdAt: '2026-09-01T06:00:00.000Z',
  };

  it('closes a Contacted or Engaged lead after 30 quiet days, with a revive task due in 5 days', () => {
    expect(planAutoDead(lead, new Date('2026-10-15T05:59:59.000Z'))).toBeNull();

    const plan = planAutoDead({ ...lead, status: 'ENGAGED' }, new Date('2026-10-15T06:00:00.000Z'));

    expect(plan?.changes).toEqual({
      status: 'DEAD',
      deadReason: 'NO_RESPONSE',
      autoClosedAt: '2026-10-15T06:00:00.000Z',
    });
    // 20 October 17:00 Dubai
    expect(plan?.reviveTaskDueAt).toBe('2026-10-20T13:00:00.000Z');
  });

  it('counts from the latest engagement when it is after the status change', () => {
    const engaged = { ...lead, lastEngagementAt: '2026-10-01T06:00:00.000Z' };

    expect(planAutoDead(engaged, new Date('2026-10-20T06:00:00.000Z'))).toBeNull();
    expect(planAutoDead(engaged, new Date('2026-10-31T06:00:00.000Z'))?.quietSince).toBe(
      '2026-10-01T06:00:00.000Z',
    );
  });

  it('leaves every other status alone', () => {
    for (const status of ['NEW', 'QUALIFIED', 'NURTURE', 'DEAD', 'CONVERTED'] as const) {
      expect(planAutoDead({ ...lead, status }, new Date('2027-01-01T00:00:00.000Z'))).toBeNull();
    }
  });
});

describe('L4 qualification', () => {
  const lead = {
    ...UNCHECKED,
    status: 'CONTACTED' as const,
    qualificationScore: 0,
    offeringInterest: ['LAB_TESTING'],
    estimatedValue: null,
  };

  it('scores the ticked checks and qualifies at 4', () => {
    const three = { ...lead, needIdentified: true, decisionMakerReached: true, timingKnown: true };

    expect(computeQualificationScore(three)).toBe(3);
    expect(planQualification(three)).toEqual({ score: 3, scoreChanged: true, qualify: false });
    expect(planQualification({ ...three, capabilityMatched: true })).toEqual({
      score: 4,
      scoreChanged: true,
      qualify: true,
    });
  });

  it('only rescores leads that are already Qualified, Dead or Converted', () => {
    const allTicked = {
      needIdentified: true,
      decisionMakerReached: true,
      capabilityMatched: true,
      fundingPathIdentified: true,
      timingKnown: true,
    };

    for (const status of ['QUALIFIED', 'DEAD', 'CONVERTED'] as const) {
      expect(planQualification({ ...lead, ...allTicked, status, qualificationScore: 5 })).toEqual({
        score: 5,
        scoreChanged: false,
        qualify: false,
      });
    }

    for (const status of ['NEW', 'ENGAGED', 'NURTURE'] as const) {
      expect(planQualification({ ...lead, ...allTicked, status }).qualify).toBe(true);
    }
  });

  it('treats an IP licence interest or an estimate above the threshold as licence-grade', () => {
    expect(isLicenceGradeLead({ offeringInterest: ['TRAINING', 'IP_LICENCE'], estimatedValue: null }, null)).toBe(true);
    expect(isLicenceGradeLead({ offeringInterest: ['TRAINING'], estimatedValue: null }, 500_000)).toBe(false);

    const estimate = (amount: number) => ({ amountMicros: amount * 1_000_000, currencyCode: 'AED' });

    expect(isLicenceGradeLead({ offeringInterest: [], estimatedValue: estimate(500_001) }, 500_000)).toBe(true);
    expect(isLicenceGradeLead({ offeringInterest: [], estimatedValue: estimate(500_000) }, 500_000)).toBe(false);
    // amountMicros can arrive as a string from the API
    expect(
      isLicenceGradeLead({ offeringInterest: null, estimatedValue: { amountMicros: '900000000000', currencyCode: 'AED' } }, 500_000),
    ).toBe(true);
    // no threshold set yet: only the licence interest counts
    expect(isLicenceGradeLead({ offeringInterest: [], estimatedValue: estimate(10_000_000) }, null)).toBe(false);
  });
});

describe('L5 conversion', () => {
  const lead = {
    id: 'lead-3',
    name: 'ADNOC corrosion testing',
    status: 'CONVERTED' as const,
    source: 'GALA_QR',
    need: 'Accelerated corrosion tests on pipeline coatings',
    offeringInterest: ['LAB_TESTING', 'IP_LICENCE'],
    department: 'LAB_ACCESS',
    estimatedValue: { amountMicros: 250_000_000_000, currencyCode: 'AED' },
    nextAction: 'Send the test plan',
    nextActionDate: '2026-10-20',
    otherDetails: null,
    ownerId: 'member-aisha',
    companyId: 'company-1',
    personId: 'person-1',
    convertedOpportunityId: null,
    statusEnteredAt: '2026-10-15T06:00:00.000Z',
    lastConvertedAt: null,
  };

  it('picks the type from the first offering in list order', () => {
    expect(pickOpportunityType(['LAB_TESTING', 'IP_LICENCE'])).toBe('TECHNOLOGY_LICENSING');
    expect(pickOpportunityType(['ADVISORY', 'TRAINING'])).toBe('TRAINING_OR_BOOTCAMP');
    expect(pickOpportunityType(['TECHNICAL_SERVICE'])).toBe('RFQ_TECHNICAL_SERVICE');
    expect(pickOpportunityType([])).toBeNull();
    expect(pickOpportunityType(null)).toBeNull();
  });

  it('copies the lead into a Qualify opportunity linked back to it, type set afterwards', () => {
    expect(buildConvertedOpportunity(lead)).toEqual({
      create: {
        name: 'ADNOC corrosion testing',
        stage: 'NEW',
        leadId: 'lead-3',
        ownerId: 'member-aisha',
        companyId: 'company-1',
        pointOfContactId: 'person-1',
        description: 'Accelerated corrosion tests on pipeline coatings',
        nextAction: 'Send the test plan',
        nextActionDate: '2026-10-20',
        source: 'GALA_QR',
        department: 'LAB_ACCESS',
        offering: ['LAB_TESTING', 'IP_LICENCE'],
        amount: { amountMicros: 250_000_000_000, currencyCode: 'AED' },
      },
      playbookType: 'TECHNOLOGY_LICENSING',
    });
  });

  it('converts once per move into Converted, so a cross-sell converts again', () => {
    expect(needsConversion(lead, lead.statusEnteredAt)).toBe(true);

    const converted = {
      ...lead,
      convertedOpportunityId: 'opportunity-1',
      lastConvertedAt: '2026-10-15T06:00:02.000Z',
    };

    expect(needsConversion(converted, converted.statusEnteredAt)).toBe(false);
    expect(needsConversion(converted, '2026-11-02T06:00:00.000Z')).toBe(true);
    expect(needsConversion({ ...converted, status: 'QUALIFIED' }, '2026-11-02T06:00:00.000Z')).toBe(false);
  });
});

describe('L6 referral credit', () => {
  const lead = {
    id: 'lead-4',
    ownerId: 'member-aisha',
    referredById: 'person-faculty',
    referredByMemberId: 'member-omar',
    referralCreditedAt: null,
  };

  it('asks the owner to thank the referrer once at Qualified and once at Converted', () => {
    expect(planReferralThanks({ lead, previousStatus: 'ENGAGED', status: 'QUALIFIED' })).toEqual({
      dedupeKey: 'lead-referral-thanks:lead-4:QUALIFIED',
    });
    expect(planReferralThanks({ lead, previousStatus: 'QUALIFIED', status: 'CONVERTED' })?.dedupeKey).toBe(
      'lead-referral-thanks:lead-4:CONVERTED',
    );
    expect(planReferralThanks({ lead, previousStatus: 'NEW', status: 'CONTACTED' })).toBeNull();
    expect(
      planReferralThanks({
        lead: { ...lead, referredById: null, referredByMemberId: null },
        previousStatus: 'ENGAGED',
        status: 'QUALIFIED',
      }),
    ).toBeNull();
  });

  it('credits the lead on its first signed opportunity and notes every signing', () => {
    const now = new Date('2026-12-01T06:00:00.000Z');

    expect(planReferralCredit({ lead, opportunityId: 'opportunity-1', now })).toEqual({
      changes: { referralCreditedAt: '2026-12-01T06:00:00.000Z' },
      notePersonId: 'person-faculty',
      dedupeKey: 'lead-referral-credit:lead-4:opportunity-1',
    });
    expect(
      planReferralCredit({
        lead: { ...lead, referralCreditedAt: '2026-12-01T06:00:00.000Z' },
        opportunityId: 'opportunity-2',
        now,
      })?.changes,
    ).toBeNull();
    expect(
      planReferralCredit({
        lead: { ...lead, referredById: null, referredByMemberId: null },
        opportunityId: 'opportunity-1',
        now,
      }),
    ).toBeNull();
  });
});

describe('lead status entry', () => {
  it('stamps the entry, gives Nurture a review date 90 days out and asks Dead for a reason', () => {
    const enteredAt = '2026-10-15T21:00:00.000Z';

    expect(
      planLeadStatusEntry({
        lead: { status: 'NURTURE', deadReason: null, nurtureReviewDate: null },
        enteredAt,
      }),
    ).toEqual({
      // 16 October in Dubai plus 90 days
      changes: { statusEnteredAt: enteredAt, nurtureReviewDate: '2027-01-14' },
      needsDeadReason: false,
    });
    expect(
      planLeadStatusEntry({
        lead: { status: 'NURTURE', deadReason: null, nurtureReviewDate: '2026-11-01' },
        enteredAt,
      }).changes,
    ).toEqual({ statusEnteredAt: enteredAt });
    expect(
      planLeadStatusEntry({ lead: { status: 'DEAD', deadReason: null, nurtureReviewDate: null }, enteredAt })
        .needsDeadReason,
    ).toBe(true);
    expect(
      planLeadStatusEntry({ lead: { status: 'DEAD', deadReason: 'NO_FIT', nurtureReviewDate: null }, enteredAt })
        .needsDeadReason,
    ).toBe(false);
  });
});
