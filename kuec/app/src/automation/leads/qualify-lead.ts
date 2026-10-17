import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { LEAD_ED_VALUE_THRESHOLD_VARIABLE } from 'src/application.config';
import { type AutomationContext } from 'src/automation/api/load-automation-context';
import { type TwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import {
  isLicenceGradeLead,
  planQualification,
  type QualificationPlan,
} from 'src/automation/rules/lead-qualification.rule';
import { LEAD_STATUS } from 'src/objects/lead.object';

export const readEdValueThreshold = (): number | null => {
  const raw = process.env[LEAD_ED_VALUE_THRESHOLD_VARIABLE];
  const threshold = isNonEmptyString(raw) ? Number(raw) : Number.NaN;

  return Number.isFinite(threshold) ? threshold : null;
};

// Keyed on the qualifiedAt the app stamped, so a retry or a later tick of a
// check on a lead the app qualified sends nothing twice, and a lead a person
// set to Qualified by hand gets no "Convert or park" task.
export const sendQualificationFollowUps = async ({
  api,
  lead,
  qualifiedAt,
  context,
  now,
}: {
  api: TwentyApi;
  lead: LeadRecord;
  qualifiedAt: string;
  context: AutomationContext;
  now: Date;
}): Promise<void> => {
  const target = leadTarget(lead.id);
  const link = recordLinkFor(target);
  const subject = lead.name ?? '';
  const dedupeKey = `lead-qualified:${lead.id}:${Date.parse(qualifiedAt)}`;

  await createTaskOnce({
    api,
    assigneeId: lead.ownerId ?? context.edMemberId,
    title: `Convert or park: ${subject}`,
    body: NOTIFICATION_MESSAGES.leadQualified({ subject, link }),
    target,
    dedupeKey,
    now,
  });

  if (isLicenceGradeLead(lead, readEdValueThreshold())) {
    await notifyMembers({
      api,
      memberIds: [context.edMemberId],
      message: NOTIFICATION_MESSAGES.leadQualifiedForEd({ subject, link }),
      taskTitle: `Licence-grade lead qualified: ${subject}`,
      target,
      dedupeKey,
      now,
    });
  }
};

export const qualifyLead = async ({
  api,
  lead,
  context,
  now,
}: {
  api: TwentyApi;
  lead: LeadRecord;
  context: AutomationContext;
  now: Date;
}): Promise<QualificationPlan> => {
  const plan = planQualification(lead);
  const changes: Record<string, unknown> = {};

  if (plan.scoreChanged) {
    changes.qualificationScore = plan.score;
  }

  const qualifiedAt = plan.qualify ? now.toISOString() : lead.qualifiedAt;

  if (plan.qualify) {
    changes.status = LEAD_STATUS.QUALIFIED;
    changes.qualifiedAt = qualifiedAt;
  }

  if (Object.keys(changes).length > 0) {
    await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, changes);
  }

  const isQualifiedByTheApp =
    plan.qualify || (lead.status === LEAD_STATUS.QUALIFIED && isDefined(lead.qualifiedAt));

  if (isQualifiedByTheApp && isDefined(qualifiedAt)) {
    await sendQualificationFollowUps({ api, lead, qualifiedAt, context, now });
  }

  return plan;
};
