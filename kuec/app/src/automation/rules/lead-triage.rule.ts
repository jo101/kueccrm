import { isDefined } from 'twenty-sdk/utils';

import {
  dueAtAfterBusinessDays,
  type HolidaySet,
} from 'src/automation/dates/business-days';
import { type CreatedByActor } from 'src/automation/rules/default-owner.rule';
import {
  computeQualificationScore,
  type QualificationChecks,
} from 'src/automation/rules/lead-qualification.rule';
import { LEAD_STATUS, type LeadStatus } from 'src/objects/lead.object';

export const TRIAGE_DUE_AFTER_BUSINESS_DAYS = 1;

export type TriageLead = QualificationChecks & {
  status: LeadStatus;
  ownerId: string | null;
  referredByMemberId: string | null;
  playbookApplied: boolean;
  statusEnteredAt: string | null;
  qualificationScore: number | null;
  createdAt: string;
  createdBy: CreatedByActor | null;
};

export type LeadTriagePlan = {
  changes: Record<string, unknown>;
  taskAssigneeId: string | null;
  taskDueAt: string;
};

// L1. Owner defaults to the ops coordinator. The colleague who typed the lead
// in the UI holds the internal referral credit unless another colleague is
// named; an outside referrer in Referred by keeps theirs (runbooks/19-leads.md
// section 5). A status someone already moved past New is left alone, so an
// imported history keeps its statuses.
export const planLeadTriage = ({
  lead,
  opsCoordinatorMemberId,
  holidays,
  now,
}: {
  lead: TriageLead;
  opsCoordinatorMemberId: string | null;
  holidays: HolidaySet;
  now: Date;
}): LeadTriagePlan | null => {
  if (lead.playbookApplied) {
    return null;
  }

  const changes: Record<string, unknown> = {};
  const ownerId = lead.ownerId ?? opsCoordinatorMemberId;

  if (!isDefined(lead.ownerId) && isDefined(opsCoordinatorMemberId)) {
    changes.ownerId = opsCoordinatorMemberId;
  }

  if (lead.status === LEAD_STATUS.NEW && !isDefined(lead.statusEnteredAt)) {
    changes.statusEnteredAt = lead.createdAt;
  }

  const score = computeQualificationScore(lead);

  if (lead.qualificationScore !== score) {
    changes.qualificationScore = score;
  }

  const loggedBy =
    lead.createdBy?.source === 'MANUAL' ? lead.createdBy.workspaceMemberId : null;

  if (isDefined(loggedBy) && !isDefined(lead.referredByMemberId)) {
    changes.referredByMemberId = loggedBy;
  }

  return {
    changes,
    taskAssigneeId: ownerId,
    taskDueAt: dueAtAfterBusinessDays(
      now,
      TRIAGE_DUE_AFTER_BUSINESS_DAYS,
      holidays,
    ).toISOString(),
  };
};
