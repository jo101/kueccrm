import { describe, expect, it } from 'vitest';

import {
  decideTimerRun,
  derivePendingTimers,
  MAX_JOB_DELAY_MS,
  planTimerJob,
  type TimerWorkPackage,
} from 'src/automation/timers/work-package-timers';

const NO_HOLIDAYS = new Set<string>();
const OFFERED_AT = '2026-10-15T06:00:00.000Z';

const offeredWorkPackage: TimerWorkPackage = {
  id: '6f3c3a0e-0000-4000-8000-000000000001',
  status: 'OFFERED',
  offeredAt: OFFERED_AT,
  dueAt: '2026-11-12T13:00:00.000Z',
  acceptReminderSentAt: null,
  reassignedAt: null,
  overdueOwnerNotifiedAt: null,
  overdueEdNotifiedAt: null,
};

describe('derivePendingTimers', () => {
  it('arms the 2-day acceptance reminder and the due timer for a fresh offer', () => {
    const timers = derivePendingTimers(offeredWorkPackage, NO_HOLIDAYS);

    expect(timers.map(({ baseJobId }) => baseJobId)).toEqual([
      `wp-accept-${offeredWorkPackage.id}-${Date.parse(OFFERED_AT)}-l1`,
      `wp-due-${offeredWorkPackage.id}-${Date.parse('2026-11-12T13:00:00.000Z')}-l1`,
    ]);
    expect(timers[0]?.fireAt.toISOString()).toBe('2026-10-19T06:00:00.000Z');
  });

  it('moves to the 5-day reassignment once the reminder has fired', () => {
    const [acceptTimer] = derivePendingTimers(
      { ...offeredWorkPackage, acceptReminderSentAt: '2026-10-19T06:00:30Z' },
      NO_HOLIDAYS,
    );

    expect(acceptTimer?.level).toBe(2);
    expect(acceptTimer?.fireAt.toISOString()).toBe('2026-10-22T06:00:00.000Z');
  });

  it('re-arms when the work package is offered again', () => {
    const [acceptTimer] = derivePendingTimers(
      {
        ...offeredWorkPackage,
        offeredAt: '2026-11-02T06:00:00.000Z',
        acceptReminderSentAt: '2026-10-19T06:00:30Z',
        reassignedAt: '2026-10-22T06:00:30Z',
      },
      NO_HOLIDAYS,
    );

    expect(acceptTimer?.level).toBe(1);
  });

  it('notifies the ED 2 business days after the owner for overdue work', () => {
    const timers = derivePendingTimers(
      {
        ...offeredWorkPackage,
        status: 'ACCEPTED',
        overdueOwnerNotifiedAt: '2026-11-12T13:00:10Z',
      },
      NO_HOLIDAYS,
    );

    expect(timers).toHaveLength(1);
    expect(timers[0]?.level).toBe(2);
    expect(timers[0]?.fireAt.toISOString()).toBe('2026-11-16T13:00:00.000Z');
  });

  it('re-arms the overdue timer when the due date moves later', () => {
    const timers = derivePendingTimers(
      {
        ...offeredWorkPackage,
        status: 'ACCEPTED',
        dueAt: '2026-11-20T13:00:00.000Z',
        overdueOwnerNotifiedAt: '2026-11-12T13:00:10Z',
        overdueEdNotifiedAt: '2026-11-16T13:00:10Z',
      },
      NO_HOLIDAYS,
    );

    expect(timers[0]?.level).toBe(1);
  });

  it('arms nothing for done, declined, cancelled or planned work', () => {
    for (const status of ['DONE', 'DECLINED', 'CANCELLED', 'PLANNED'] as const) {
      expect(
        derivePendingTimers({ ...offeredWorkPackage, status }, NO_HOLIDAYS),
      ).toEqual([]);
    }
  });
});

describe('planTimerJob', () => {
  const [, dueTimer] = derivePendingTimers(offeredWorkPackage, NO_HOLIDAYS);

  it('enqueues the final job when the timer is within 7 days', () => {
    if (dueTimer === undefined) throw new Error('missing timer');

    const now = new Date(dueTimer.fireAt.getTime() - 3 * 24 * 60 * 60 * 1000);
    const job = planTimerJob(dueTimer, now);

    expect(job.jobId).toBe(dueTimer.baseJobId);
    expect(job.delayMs).toBe(3 * 24 * 60 * 60 * 1000);
  });

  it('chains hop jobs landing 7 days apart for later timers', () => {
    if (dueTimer === undefined) throw new Error('missing timer');

    const now = new Date(dueTimer.fireAt.getTime() - 17 * 24 * 60 * 60 * 1000);
    const firstHop = planTimerJob(dueTimer, now);

    expect(firstHop.jobId).toBe(`${dueTimer.baseJobId}-h2`);
    expect(firstHop.delayMs).toBe(3 * 24 * 60 * 60 * 1000);

    const secondHop = planTimerJob(
      dueTimer,
      new Date(now.getTime() + firstHop.delayMs),
    );

    expect(secondHop.jobId).toBe(`${dueTimer.baseJobId}-h1`);
    expect(secondHop.delayMs).toBe(MAX_JOB_DELAY_MS);
  });

  it('runs an overdue timer immediately', () => {
    if (dueTimer === undefined) throw new Error('missing timer');

    const job = planTimerJob(
      dueTimer,
      new Date(dueTimer.fireAt.getTime() + 1000),
    );

    expect(job.delayMs).toBe(0);
    expect(job.jobId).toBe(dueTimer.baseJobId);
  });
});

describe('decideTimerRun', () => {
  const payload = {
    workPackageId: offeredWorkPackage.id,
    kind: 'ACCEPT' as const,
    level: 1 as const,
    anchorAt: OFFERED_AT,
  };

  it('fires when the timer is due', () => {
    expect(
      decideTimerRun({
        workPackage: offeredWorkPackage,
        payload,
        now: new Date('2026-10-19T06:00:00Z'),
        holidays: NO_HOLIDAYS,
      }).action,
    ).toBe('FIRE');
  });

  it('is stale once the escalation has fired, so a retry does nothing', () => {
    expect(
      decideTimerRun({
        workPackage: {
          ...offeredWorkPackage,
          acceptReminderSentAt: '2026-10-19T06:00:05Z',
        },
        payload,
        now: new Date('2026-10-19T06:00:10Z'),
        holidays: NO_HOLIDAYS,
      }).action,
    ).toBe('STALE');
  });

  it('is stale once the work package is accepted', () => {
    expect(
      decideTimerRun({
        workPackage: { ...offeredWorkPackage, status: 'ACCEPTED' },
        payload,
        now: new Date('2026-10-19T06:00:00Z'),
        holidays: NO_HOLIDAYS,
      }).action,
    ).toBe('STALE');
  });

  it('waits when a hop lands before the timer', () => {
    expect(
      decideTimerRun({
        workPackage: offeredWorkPackage,
        payload,
        now: new Date('2026-10-16T06:00:00Z'),
        holidays: NO_HOLIDAYS,
      }).action,
    ).toBe('WAIT');
  });
});
