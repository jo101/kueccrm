import { describe, expect, it } from 'vitest';

import { needsNextActionFlag } from 'src/automation/rules/next-action-guard.rule';
import {
  areAllMilestonesDone,
  computeDailyHealth,
  computePercentComplete,
} from 'src/automation/rules/project-health.rule';

const TODAY = '2026-10-15';
const openOpportunity = {
  id: 'opportunity-1',
  stage: 'SCREENING',
  nextAction: 'Call the CTO',
  nextActionDate: '2026-10-20',
  nextActionFlaggedOn: null,
};

describe('needsNextActionFlag', () => {
  it('passes an open opportunity with a future next action', () => {
    expect(needsNextActionFlag(openOpportunity, TODAY)).toBe(false);
  });

  it('flags an empty or past next-action date and an empty next action', () => {
    expect(needsNextActionFlag({ ...openOpportunity, nextActionDate: null }, TODAY)).toBe(true);
    expect(needsNextActionFlag({ ...openOpportunity, nextActionDate: '2026-10-14' }, TODAY)).toBe(true);
    expect(needsNextActionFlag({ ...openOpportunity, nextAction: '' }, TODAY)).toBe(true);
  });

  it('treats today as not past', () => {
    expect(needsNextActionFlag({ ...openOpportunity, nextActionDate: TODAY }, TODAY)).toBe(false);
  });

  it('flags once per day and never closed opportunities', () => {
    const stale = { ...openOpportunity, nextActionDate: null };

    expect(needsNextActionFlag({ ...stale, nextActionFlaggedOn: TODAY }, TODAY)).toBe(false);
    expect(needsNextActionFlag({ ...stale, nextActionFlaggedOn: '2026-10-14' }, TODAY)).toBe(true);

    for (const stage of ['SIGNED', 'LOST', 'PARKED']) {
      expect(needsNextActionFlag({ ...stale, stage }, TODAY)).toBe(false);
    }
  });
});

describe('project health', () => {
  const now = new Date('2026-10-15T04:00:00Z');

  it('turns amber when an open milestone is due within 7 days', () => {
    expect(
      computeDailyHealth({
        currentHealth: 'GREEN',
        milestones: [{ status: 'OPEN', dueAt: '2026-10-21T13:00:00Z' }],
        now,
      }),
    ).toBe('AMBER');
    expect(
      computeDailyHealth({
        currentHealth: 'GREEN',
        milestones: [{ status: 'OPEN', dueAt: '2026-11-21T13:00:00Z' }],
        now,
      }),
    ).toBe('GREEN');
  });

  it('never downgrades red', () => {
    expect(
      computeDailyHealth({
        currentHealth: 'RED',
        milestones: [{ status: 'OPEN', dueAt: '2026-10-21T13:00:00Z' }],
        now,
      }),
    ).toBe('RED');
  });

  it('computes percent complete and all-done', () => {
    const milestones = [
      { status: 'DONE' as const, dueAt: null },
      { status: 'DONE' as const, dueAt: null },
      { status: 'OPEN' as const, dueAt: null },
    ];

    expect(computePercentComplete(milestones)).toBe(67);
    expect(areAllMilestonesDone(milestones)).toBe(false);
    expect(areAllMilestonesDone([])).toBe(false);
  });
});
