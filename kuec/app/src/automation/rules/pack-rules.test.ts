import { describe, expect, it } from 'vitest';

import {
  MAX_TARGETS_PER_CAMPAIGN,
  planCampaignTargets,
  type TargetingCampaign,
} from 'src/automation/rules/campaign-targets.rule';
import {
  type ExitCheckOpportunity,
  isForwardMove,
  stageExitGaps,
} from 'src/automation/rules/stage-exit.rule';
import {
  planWeeklyReviews,
  reviewWeekOf,
} from 'src/automation/rules/weekly-review.rule';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { CAMPAIGN_TARGET_STATUS } from 'src/objects/campaign-target.object';
import { PROJECT_STATUS, PROJECT_TYPE } from 'src/objects/project.object';

const COMPLETE: ExitCheckOpportunity = {
  playbookType: 'TECHNICAL_SERVICE',
  companyId: 'company-1',
  ownerId: 'member-1',
  source: 'INBOUND',
  pointOfContactId: 'person-1',
  offering: ['LAB_TESTING'],
  amount: { amountMicros: 50_000_000_000 },
  closeDate: '2026-12-15',
  fundingPath: 'CUSTOMER_BUDGET',
  probability: 'PCT_50',
  sharepointFolder: { primaryLinkUrl: 'https://kuac.sharepoint.com/sites/BD/case-1' },
  capabilityId: null,
  uventureRecord: null,
};

describe('CRM pack: stage exit criteria', () => {
  it('checks only forward moves inside the open pipeline', () => {
    expect(isForwardMove(OPPORTUNITY_STAGE.NEW, OPPORTUNITY_STAGE.SCREENING)).toBe(true);
    expect(isForwardMove(OPPORTUNITY_STAGE.NEW, OPPORTUNITY_STAGE.PROPOSAL)).toBe(true);
    expect(isForwardMove(OPPORTUNITY_STAGE.PROPOSAL, OPPORTUNITY_STAGE.MEETING)).toBe(false);
    expect(isForwardMove(OPPORTUNITY_STAGE.MEETING, OPPORTUNITY_STAGE.LOST)).toBe(false);
    expect(isForwardMove(OPPORTUNITY_STAGE.PARKED, OPPORTUNITY_STAGE.SCREENING)).toBe(true);
  });

  it('owes nothing when every criterion is met', () => {
    expect(stageExitGaps(COMPLETE, OPPORTUNITY_STAGE.SIGNED)).toEqual([]);
  });

  it('owes the criteria of every stage it skipped', () => {
    expect(
      stageExitGaps({ ...COMPLETE, pointOfContactId: null, amount: null }, OPPORTUNITY_STAGE.PROPOSAL),
    ).toEqual(['Point of contact', 'Amount']);
    expect(stageExitGaps({ ...COMPLETE, amount: null }, OPPORTUNITY_STAGE.MEETING)).toEqual([]);
  });

  it('asks a licence for its technology and uVENTURE record before Signed', () => {
    expect(
      stageExitGaps({ ...COMPLETE, playbookType: 'TECHNOLOGY_LICENSING' }, OPPORTUNITY_STAGE.SIGNED),
    ).toEqual(['Capability (the technology)', 'uVENTURE record']);
  });
});

describe('GTM pack: campaign target list', () => {
  const campaign: TargetingCampaign = {
    id: 'campaign-1',
    playbookType: PROJECT_TYPE.GTM_CAMPAIGN,
    status: PROJECT_STATUS.ACTIVE,
    targetSector: 'OIL_AND_GAS',
    targetSizeClass: 'LARGE_ENTERPRISE',
  };
  const companies = [
    { id: 'c-b', name: 'Beta Energy', sector: 'OIL_AND_GAS', sizeClass: 'LARGE_ENTERPRISE' },
    { id: 'c-a', name: 'Alpha Drilling', sector: 'OIL_AND_GAS', sizeClass: 'LARGE_ENTERPRISE' },
    { id: 'c-small', name: 'Small Rigs', sector: 'OIL_AND_GAS', sizeClass: 'SME' },
    { id: 'c-lead', name: 'Gulf Health', sector: 'HEALTHCARE', sizeClass: 'SME' },
  ];

  it('lists the matching companies by name, and the companies that sent a campaign lead', () => {
    expect(planCampaignTargets({ campaign, companies, targets: [], campaignLeads: [{ companyId: 'c-lead' }] })).toEqual({
      create: [
        { companyId: 'c-lead', name: 'Gulf Health', status: CAMPAIGN_TARGET_STATUS.LEAD_CREATED },
        { companyId: 'c-a', name: 'Alpha Drilling', status: CAMPAIGN_TARGET_STATUS.TO_CONTACT },
        { companyId: 'c-b', name: 'Beta Energy', status: CAMPAIGN_TARGET_STATUS.TO_CONTACT },
      ],
      markLeadCreated: [],
      overLimitBy: 0,
    });
  });

  it('takes every size when no size class is set, and never lists a company twice', () => {
    const plan = planCampaignTargets({
      campaign: { ...campaign, targetSizeClass: null },
      companies,
      targets: [{ id: 't-1', companyId: 'c-a', status: CAMPAIGN_TARGET_STATUS.CONTACTED }],
      campaignLeads: [],
    });

    expect(plan.create.map(({ companyId }) => companyId)).toEqual(['c-b', 'c-small']);
  });

  it('marks a target Lead created once its company sends a lead, unless a person closed it', () => {
    const plan = planCampaignTargets({
      campaign,
      companies,
      targets: [
        { id: 't-a', companyId: 'c-a', status: CAMPAIGN_TARGET_STATUS.RESPONDED },
        { id: 't-b', companyId: 'c-b', status: CAMPAIGN_TARGET_STATUS.DO_NOT_CONTACT },
      ],
      campaignLeads: [{ companyId: 'c-a' }, { companyId: 'c-b' }],
    });

    expect(plan.markLeadCreated).toEqual(['t-a']);
    expect(plan.create).toEqual([]);
  });

  it('builds nothing for a campaign that is not active or has no sector', () => {
    expect(
      planCampaignTargets({ campaign: { ...campaign, status: PROJECT_STATUS.ON_HOLD }, companies, targets: [], campaignLeads: [] })
        .create,
    ).toEqual([]);
    expect(
      planCampaignTargets({ campaign: { ...campaign, targetSector: null }, companies, targets: [], campaignLeads: [] }).create,
    ).toEqual([]);
  });

  it('stops at the list limit and says how many more match', () => {
    const many = Array.from({ length: MAX_TARGETS_PER_CAMPAIGN + 7 }, (_, index) => ({
      id: `c-${index}`,
      name: `Company ${String(index).padStart(4, '0')}`,
      sector: 'OIL_AND_GAS',
      sizeClass: 'LARGE_ENTERPRISE',
    }));
    const plan = planCampaignTargets({ campaign, companies: many, targets: [], campaignLeads: [] });

    expect(plan.create).toHaveLength(MAX_TARGETS_PER_CAMPAIGN);
    expect(plan.overLimitBy).toBe(7);
  });
});

describe('PM pack: weekly review', () => {
  it('gives each owner one review of their active projects, worst health first', () => {
    expect(
      planWeeklyReviews([
        { id: 'p1', name: 'Pilot plant', status: PROJECT_STATUS.ACTIVE, health: 'GREEN', ownerId: 'm1' },
        { id: 'p2', name: 'Sensor trial', status: PROJECT_STATUS.ACTIVE, health: 'RED', ownerId: 'm1' },
        { id: 'p3', name: 'Done work', status: PROJECT_STATUS.DONE, health: 'GREEN', ownerId: 'm1' },
        { id: 'p4', name: 'Orphan', status: PROJECT_STATUS.ACTIVE, health: 'AMBER', ownerId: null },
        { id: 'p5', name: 'Workshop', status: PROJECT_STATUS.ACTIVE, health: 'AMBER', ownerId: 'm2' },
      ]).map(({ ownerId, projects }) => ({ ownerId, projects: projects.map(({ id }) => id) })),
    ).toEqual([
      { ownerId: 'm1', projects: ['p2', 'p1'] },
      { ownerId: 'm2', projects: ['p5'] },
    ]);
  });

  it('keys the review on the Monday of the Asia/Dubai week', () => {
    expect(reviewWeekOf('2026-10-19')).toBe('2026-10-19');
    expect(reviewWeekOf('2026-10-25')).toBe('2026-10-19');
    expect(reviewWeekOf('2026-10-18')).toBe('2026-10-12');
  });
});
