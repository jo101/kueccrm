import { isDefined } from 'twenty-sdk/utils';

import {
  dueAtOnDate,
  toDubaiDateString,
} from 'src/automation/dates/business-days';
import {
  LEAD_DEAD_REASON,
  LEAD_STATUS,
  type LeadStatus,
} from 'src/objects/lead.object';

export const LEAD_QUIET_AFTER_DAYS = 30;
export const REVIVE_WITHIN_DAYS = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

const STATUSES_THAT_GO_QUIET: LeadStatus[] = [
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.ENGAGED,
];

export type AutoDeadLead = {
  id: string;
  status: LeadStatus;
  statusEnteredAt: string | null;
  lastEngagementAt: string | null;
  createdAt: string;
};

export type AutoDeadPlan = {
  quietSince: string;
  changes: Record<string, unknown>;
  reviveTaskDueAt: string;
  dedupeKey: string;
};

const latest = (instants: (string | null)[]): string =>
  instants
    .filter(isDefined)
    .reduce((left, right) => (Date.parse(right) > Date.parse(left) ? right : left));

// L3. Quiet means no status change and no engagement dated after it for 30
// days; Asia/Dubai has no DST, so 30 days is 30 times 24 hours.
export const planAutoDead = (lead: AutoDeadLead, now: Date): AutoDeadPlan | null => {
  if (!STATUSES_THAT_GO_QUIET.includes(lead.status)) {
    return null;
  }

  const quietSince = latest([
    lead.statusEnteredAt ?? lead.createdAt,
    lead.lastEngagementAt,
  ]);

  if (now.getTime() - Date.parse(quietSince) < LEAD_QUIET_AFTER_DAYS * DAY_MS) {
    return null;
  }

  return {
    quietSince,
    changes: {
      status: LEAD_STATUS.DEAD,
      deadReason: LEAD_DEAD_REASON.NO_RESPONSE,
      autoClosedAt: now.toISOString(),
    },
    reviveTaskDueAt: dueAtOnDate(
      toDubaiDateString(new Date(now.getTime() + REVIVE_WITHIN_DAYS * DAY_MS)),
    ).toISOString(),
    dedupeKey: `lead-auto-dead:${lead.id}:${Date.parse(quietSince)}`,
  };
};
