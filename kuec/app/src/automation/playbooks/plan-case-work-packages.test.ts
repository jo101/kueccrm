import { describe, expect, it } from 'vitest';

import { planCaseWorkPackages } from 'src/automation/playbooks/plan-case-work-packages';
import {
  findOpportunityPlaybook,
  findProjectTemplate,
  type CaseTemplate,
} from 'src/automation/playbooks/playbook-templates';

const getTemplate = (template: CaseTemplate | null): CaseTemplate => {
  if (template === null) {
    throw new Error('template not found');
  }

  return template;
};

const THURSDAY_TEN_LOCAL = new Date('2026-10-15T06:00:00Z');
const NO_HOLIDAYS = new Set<string>();

const baseInput = {
  openedAt: THURSDAY_TEN_LOCAL,
  holidays: NO_HOLIDAYS,
  anchors: {},
  caseOwnerMemberId: 'bd-owner',
  opsCoordinatorMemberId: 'ops',
  membersByRole: {
    ED: ['ed'],
    DEVELOPER: ['dev-a', 'dev-b'],
    DATA_ANALYST: ['analyst'],
    LEGAL: ['legal'],
    FINANCE: ['finance'],
  },
  openWorkPackageCountByMember: { 'dev-a': 3, 'dev-b': 1 },
};

describe('planCaseWorkPackages', () => {
  it('offers step 1 and plans the rest behind it', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      caseTemplate: getTemplate(findOpportunityPlaybook('TECHNOLOGY_LICENSING')),
    });

    expect(workPackages.map(({ status }) => status)).toEqual([
      'OFFERED',
      'PLANNED',
      'PLANNED',
      'PLANNED',
      'PLANNED',
      'PLANNED',
    ]);
    expect(workPackages[0]?.offeredAt).toBe(THURSDAY_TEN_LOCAL.toISOString());
    expect(workPackages[1]?.offeredAt).toBeNull();
    expect(workPackages[1]?.dependsOnKey).toBe('TECHNICAL_ASSESSMENT');
    expect(workPackages[0]?.playbookStep).toBe(
      'TECHNOLOGY_LICENSING.TECHNICAL_ASSESSMENT',
    );
  });

  it('accumulates business-day offsets at 17:00 Asia/Dubai', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      caseTemplate: getTemplate(findOpportunityPlaybook('TECHNOLOGY_LICENSING')),
    });

    // 10 business days after Thu 15 Oct is Thu 29 Oct; 5 more is Thu 5 Nov.
    expect(workPackages[0]?.dueAt).toBe('2026-10-29T13:00:00.000Z');
    expect(workPackages[1]?.dueAt).toBe('2026-11-05T13:00:00.000Z');
  });

  it('gives the case owner the case-owner role and the least-loaded member other roles', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      caseTemplate: getTemplate(findOpportunityPlaybook('TECHNOLOGY_LICENSING')),
    });

    expect(workPackages[0]?.ownerMemberId).toBe('dev-b');
    expect(workPackages[0]?.reviewerMemberId).toBe('ed');
    expect(workPackages[1]?.ownerMemberId).toBe('bd-owner');
    expect(workPackages[2]?.ownerMemberId).toBe('analyst');
  });

  it('falls back to the ops coordinator when nobody holds a role', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      membersByRole: {},
      caseTemplate: getTemplate(findOpportunityPlaybook('TECHNOLOGY_LICENSING')),
    });

    expect(workPackages[0]?.ownerMemberId).toBe('ops');
  });

  it('caps RFQ steps 2 business days before the client deadline', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      anchors: { CLIENT_DEADLINE: '2026-10-23' },
      caseTemplate: getTemplate(findOpportunityPlaybook('RFQ_TECHNICAL_SERVICE')),
    });

    expect(workPackages[0]?.dueAt).toBe('2026-10-19T13:00:00.000Z');
    expect(workPackages[1]?.dueAt).toBe('2026-10-21T13:00:00.000Z');
    expect(workPackages[4]?.dueAt).toBe('2026-10-21T13:00:00.000Z');
  });

  it('anchors the workshop run on the event date and builds milestones', () => {
    const { workPackages, milestones } = planCaseWorkPackages({
      ...baseInput,
      anchors: { EVENT_DATE: '2027-01-20' },
      caseTemplate: getTemplate(findProjectTemplate('WORKSHOP')),
    });

    const run = workPackages.find(({ key }) => key === 'RUN');

    expect(run?.dueAt).toBe('2027-01-20T13:00:00.000Z');
    expect(run?.playbookStep).toBe('WORKSHOP.RUN');
    expect(milestones.map(({ key }) => key)).toEqual([
      'OBJECTIVE_APPROVED',
      'INVITATIONS_SENT',
      'LOGISTICS_CONFIRMED',
      'WORKSHOP_HELD',
      'OUTCOMES_LOGGED',
    ]);
    expect(milestones[3]?.dueAt).toBe(run?.dueAt);
    expect(
      workPackages.find(({ key }) => key === 'AUDIENCE_AND_TARGET_ROLES')
        ?.milestoneKey,
    ).toBe('INVITATIONS_SENT');
  });

  it('leaves the run undated when the event date is missing', () => {
    const { workPackages } = planCaseWorkPackages({
      ...baseInput,
      caseTemplate: getTemplate(findProjectTemplate('WORKSHOP')),
    });

    expect(workPackages.find(({ key }) => key === 'RUN')?.dueAt).toBeNull();
  });
});
