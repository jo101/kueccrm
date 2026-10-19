import { describe, expect, it } from 'vitest';

import {
  planOfferedTransitions,
  planOpportunityPlaybookFollowUp,
} from 'src/automation/rules/playbook-follow-up.rule';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

type PlaybookStep = Pick<
  WorkPackageRecord,
  'id' | 'name' | 'status' | 'dueAt' | 'offeredAt'
>;

const NOW = new Date('2026-10-17T20:08:16.000Z');
const LINK = 'https://crm.example.test/object/opportunity/6d5930e3';

const technicalAssessment: PlaybookStep = {
  id: 'wp-1',
  name: 'Technical assessment',
  status: WORK_PACKAGE_STATUS.OFFERED,
  // 17:00 Asia/Dubai on 30 October.
  dueAt: '2026-10-30T13:00:00.000Z',
  offeredAt: null,
};
const marketAssessment: PlaybookStep = {
  id: 'wp-2',
  name: 'Market assessment',
  status: WORK_PACKAGE_STATUS.PLANNED,
  dueAt: '2026-11-06T13:00:00.000Z',
  offeredAt: null,
};

const licensingOpportunity = {
  playbookType: OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING,
  nextAction: null,
  nextActionDate: null,
};

describe('planOfferedTransitions', () => {
  it('logs one Offered row per offered step, dated now on the first run', () => {
    expect(
      planOfferedTransitions([technicalAssessment, marketAssessment], NOW),
    ).toEqual([
      { workPackage: technicalAssessment, happenedAt: '2026-10-17T20:08:16.000Z' },
    ]);
  });

  it('keeps the first run offeredAt on a retry', () => {
    const alreadyOffered = {
      ...technicalAssessment,
      offeredAt: '2026-10-17T20:08:17.206Z',
    };

    expect(planOfferedTransitions([alreadyOffered], NOW)).toEqual([
      { workPackage: alreadyOffered, happenedAt: '2026-10-17T20:08:17.206Z' },
    ]);
  });

  it('logs nothing when no step is offered', () => {
    expect(planOfferedTransitions([marketAssessment], NOW)).toEqual([]);
  });
});

describe('planOpportunityPlaybookFollowUp', () => {
  it('asks the ED to confirm a licensing plan', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: licensingOpportunity,
        workPackages: [technicalAssessment, marketAssessment],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).confirmPlanTask,
    ).toEqual({
      title: 'Confirm plan: Desalination membrane licence',
      body: `Confirm the licensing plan and its 2 work packages. ${LINK}`,
    });
  });

  it('asks for no plan confirmation on an RFQ', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: { ...licensingOpportunity, playbookType: OPPORTUNITY_PLAYBOOK_TYPE.RFQ_TECHNICAL_SERVICE },
        workPackages: [technicalAssessment],
        caseName: 'Water testing RFQ',
        link: LINK,
      }).confirmPlanTask,
    ).toBeNull();
  });

  it('gives an opportunity without a next action the first step and its Dubai due day', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: licensingOpportunity,
        workPackages: [technicalAssessment, marketAssessment],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).nextActionPatch,
    ).toEqual({ nextAction: 'Technical assessment', nextActionDate: '2026-10-30' });
  });

  it('dates the next action by the Asia/Dubai day, not the UTC day', () => {
    const dueLateEvening = {
      ...technicalAssessment,
      // 01:30 Asia/Dubai on 31 October, still 30 October in UTC.
      dueAt: '2026-10-30T21:30:00.000Z',
    };

    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: licensingOpportunity,
        workPackages: [dueLateEvening],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).nextActionPatch?.nextActionDate,
    ).toBe('2026-10-31');
  });

  it('keeps a next action the owner already wrote and fills only the missing date', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: { ...licensingOpportunity, nextAction: 'Scoping call with the decision maker' },
        workPackages: [technicalAssessment],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).nextActionPatch,
    ).toEqual({
      nextAction: 'Scoping call with the decision maker',
      nextActionDate: '2026-10-30',
    });
  });

  it('leaves a complete next action alone', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: {
          ...licensingOpportunity,
          nextAction: 'Scoping call with the decision maker',
          nextActionDate: '2026-10-20',
        },
        workPackages: [technicalAssessment],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).nextActionPatch,
    ).toBeNull();
  });

  it('writes no next action when the playbook created no work package', () => {
    expect(
      planOpportunityPlaybookFollowUp({
        opportunity: licensingOpportunity,
        workPackages: [],
        caseName: 'Desalination membrane licence',
        link: LINK,
      }).nextActionPatch,
    ).toBeNull();
  });
});
