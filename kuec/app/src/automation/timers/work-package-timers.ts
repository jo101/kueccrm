import { isDefined } from 'twenty-sdk/utils';

import {
  addBusinessDays,
  type HolidaySet,
} from 'src/automation/dates/business-days';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

export const MAX_JOB_DELAY_MS = 7 * 24 * 60 * 60 * 1000;
export const TIMER_FIRE_TOLERANCE_MS = 60 * 1000;

export const ACCEPT_REMINDER_AFTER_BUSINESS_DAYS = 2;
export const ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS = 5;
export const OVERDUE_ED_AFTER_BUSINESS_DAYS = 2;

export const TIMER_KIND = {
  ACCEPT: 'ACCEPT',
  DUE: 'DUE',
} as const;

export type TimerKind = (typeof TIMER_KIND)[keyof typeof TIMER_KIND];

export type TimerLevel = 1 | 2;

// Planned work is not started yet and its due date is an estimate, so it has no overdue timer.
export const STATUSES_WITH_DUE_TIMER: WorkPackageStatus[] = [
  WORK_PACKAGE_STATUS.OFFERED,
  WORK_PACKAGE_STATUS.ACCEPTED,
  WORK_PACKAGE_STATUS.SUBMITTED,
  WORK_PACKAGE_STATUS.BLOCKED,
];

export type TimerWorkPackage = {
  id: string;
  status: WorkPackageStatus;
  offeredAt: string | null;
  dueAt: string | null;
  acceptReminderSentAt: string | null;
  reassignedAt: string | null;
  overdueOwnerNotifiedAt: string | null;
  overdueEdNotifiedAt: string | null;
};

export type WorkPackageTimer = {
  workPackageId: string;
  kind: TimerKind;
  level: TimerLevel;
  anchorAt: string;
  fireAt: Date;
  baseJobId: string;
};

export type TimerJobPayload = {
  workPackageId: string;
  kind: TimerKind;
  level: TimerLevel;
  anchorAt: string;
};

// An escalation counts as fired for the current anchor only: a re-offer or a
// later due date moves the anchor past the stamp and re-arms it.
export const hasFiredForAnchor = (
  stamp: string | null,
  anchorAt: string,
): boolean => isDefined(stamp) && Date.parse(stamp) >= Date.parse(anchorAt);

export const buildBaseJobId = ({
  kind,
  workPackageId,
  anchorAt,
  level,
}: Pick<WorkPackageTimer, 'kind' | 'workPackageId' | 'anchorAt' | 'level'>) =>
  `${kind === TIMER_KIND.ACCEPT ? 'wp-accept' : 'wp-due'}-${workPackageId}-${Date.parse(anchorAt)}-l${level}`;

const buildTimer = (
  workPackage: TimerWorkPackage,
  kind: TimerKind,
  level: TimerLevel,
  anchorAt: string,
  fireAt: Date,
): WorkPackageTimer => ({
  workPackageId: workPackage.id,
  kind,
  level,
  anchorAt,
  fireAt,
  baseJobId: buildBaseJobId({
    kind,
    workPackageId: workPackage.id,
    anchorAt,
    level,
  }),
});

export const derivePendingAcceptTimer = (
  workPackage: TimerWorkPackage,
  holidays: HolidaySet,
): WorkPackageTimer | null => {
  const { status, offeredAt } = workPackage;

  if (status !== WORK_PACKAGE_STATUS.OFFERED || !isDefined(offeredAt)) {
    return null;
  }

  if (!hasFiredForAnchor(workPackage.acceptReminderSentAt, offeredAt)) {
    return buildTimer(
      workPackage,
      TIMER_KIND.ACCEPT,
      1,
      offeredAt,
      addBusinessDays(
        new Date(offeredAt),
        ACCEPT_REMINDER_AFTER_BUSINESS_DAYS,
        holidays,
      ),
    );
  }

  if (!hasFiredForAnchor(workPackage.reassignedAt, offeredAt)) {
    return buildTimer(
      workPackage,
      TIMER_KIND.ACCEPT,
      2,
      offeredAt,
      addBusinessDays(
        new Date(offeredAt),
        ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS,
        holidays,
      ),
    );
  }

  return null;
};

export const derivePendingDueTimer = (
  workPackage: TimerWorkPackage,
  holidays: HolidaySet,
): WorkPackageTimer | null => {
  const { status, dueAt } = workPackage;

  if (!STATUSES_WITH_DUE_TIMER.includes(status) || !isDefined(dueAt)) {
    return null;
  }

  if (!hasFiredForAnchor(workPackage.overdueOwnerNotifiedAt, dueAt)) {
    return buildTimer(workPackage, TIMER_KIND.DUE, 1, dueAt, new Date(dueAt));
  }

  if (!hasFiredForAnchor(workPackage.overdueEdNotifiedAt, dueAt)) {
    return buildTimer(
      workPackage,
      TIMER_KIND.DUE,
      2,
      dueAt,
      addBusinessDays(new Date(dueAt), OVERDUE_ED_AFTER_BUSINESS_DAYS, holidays),
    );
  }

  return null;
};

export const derivePendingTimer = (
  workPackage: TimerWorkPackage,
  kind: TimerKind,
  holidays: HolidaySet,
): WorkPackageTimer | null =>
  kind === TIMER_KIND.ACCEPT
    ? derivePendingAcceptTimer(workPackage, holidays)
    : derivePendingDueTimer(workPackage, holidays);

export const derivePendingTimers = (
  workPackage: TimerWorkPackage,
  holidays: HolidaySet,
): WorkPackageTimer[] =>
  [
    derivePendingAcceptTimer(workPackage, holidays),
    derivePendingDueTimer(workPackage, holidays),
  ].filter(isDefined);

export type PlannedTimerJob = {
  jobId: string;
  delayMs: number;
  payload: TimerJobPayload;
};

// Jobs wait at most 7 days, so a later timer is reached through hop jobs that
// land exactly 7 days apart; each hop id is fixed by how many hops remain.
export const planTimerJob = (
  timer: WorkPackageTimer,
  now: Date,
): PlannedTimerJob => {
  const remainingMs = Math.max(0, timer.fireAt.getTime() - now.getTime());
  const hopsRemaining = Math.max(0, Math.ceil(remainingMs / MAX_JOB_DELAY_MS) - 1);

  return {
    jobId:
      hopsRemaining === 0
        ? timer.baseJobId
        : `${timer.baseJobId}-h${hopsRemaining}`,
    delayMs: remainingMs - hopsRemaining * MAX_JOB_DELAY_MS,
    payload: {
      workPackageId: timer.workPackageId,
      kind: timer.kind,
      level: timer.level,
      anchorAt: timer.anchorAt,
    },
  };
};

export type TimerRunDecision =
  | { action: 'STALE'; reason: string }
  | { action: 'WAIT'; timer: WorkPackageTimer }
  | { action: 'FIRE'; timer: WorkPackageTimer };

export const decideTimerRun = ({
  workPackage,
  payload,
  now,
  holidays,
}: {
  workPackage: TimerWorkPackage | null;
  payload: TimerJobPayload;
  now: Date;
  holidays: HolidaySet;
}): TimerRunDecision => {
  if (!isDefined(workPackage)) {
    return { action: 'STALE', reason: 'work package no longer exists' };
  }

  const timer = derivePendingTimer(workPackage, payload.kind, holidays);

  if (!isDefined(timer)) {
    return { action: 'STALE', reason: 'nothing pending for this work package' };
  }

  if (
    timer.level !== payload.level ||
    Date.parse(timer.anchorAt) !== Date.parse(payload.anchorAt)
  ) {
    return {
      action: 'STALE',
      reason: `pending timer is now ${timer.baseJobId}`,
    };
  }

  if (timer.fireAt.getTime() - now.getTime() > TIMER_FIRE_TOLERANCE_MS) {
    return { action: 'WAIT', timer };
  }

  return { action: 'FIRE', timer };
};

export const buildSweepRetryJobId = (baseJobId: string, now: Date): string =>
  `${baseJobId}-s${Math.floor(now.getTime() / (60 * 60 * 1000))}`;
