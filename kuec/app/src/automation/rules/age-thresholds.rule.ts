import { isDefined } from 'twenty-sdk/utils';

export const STALE_AFTER_DAYS = 30;
export const ENGAGEMENT_LAPSE_AFTER_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

// Dashboard filters cannot say "before N days ago" (IS_BEFORE takes a fixed
// date), so the app stores the instant a record crosses the threshold and the
// dashboards filter on it with "is in past". Asia/Dubai has no DST, so N days
// is always N times 24 hours.
const addDays = (instant: string | null, days: number): string | null =>
  isDefined(instant)
    ? new Date(Date.parse(instant) + days * DAY_MS).toISOString()
    : null;

export const computeStaleFrom = (stageEnteredAt: string | null): string | null =>
  addDays(stageEnteredAt, STALE_AFTER_DAYS);

export const computeEngagementLapsesAt = (
  lastEngagementAt: string | null,
): string | null => addDays(lastEngagementAt, ENGAGEMENT_LAPSE_AFTER_DAYS);

export const isSameInstant = (
  left: string | null,
  right: string | null,
): boolean =>
  isDefined(left) && isDefined(right)
    ? Date.parse(left) === Date.parse(right)
    : left === right;
