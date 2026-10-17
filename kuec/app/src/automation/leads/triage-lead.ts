import { type AutomationContext } from 'src/automation/api/load-automation-context';
import { type TwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { leadTarget } from 'src/automation/leads/lead-target';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { planLeadTriage } from 'src/automation/rules/lead-triage.rule';

// The guard is set last, so a run that stops halfway is finished by its retry
// or by the sweep; the task is deduplicated per lead.
export const triageLead = async ({
  api,
  lead,
  context,
  now,
}: {
  api: TwentyApi;
  lead: LeadRecord;
  context: AutomationContext;
  now: Date;
}): Promise<boolean> => {
  const plan = planLeadTriage({
    lead,
    opsCoordinatorMemberId: context.opsCoordinatorMemberId,
    holidays: context.holidays,
    now,
  });

  if (plan === null) {
    return false;
  }

  if (Object.keys(plan.changes).length > 0) {
    await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, plan.changes);
  }

  if (context.opsCoordinatorMemberId === null && lead.ownerId === null) {
    console.error(`l01 cannot assign ${lead.id}: no active ops coordinator in playbook role assignments`);
  }

  const target = leadTarget(lead.id);

  await createTaskOnce({
    api,
    assigneeId: plan.taskAssigneeId ?? context.edMemberId,
    title: `Triage: ${lead.name ?? ''}`,
    body: NOTIFICATION_MESSAGES.leadTriage({
      subject: lead.name ?? '',
      link: recordLinkFor(target),
    }),
    target,
    dedupeKey: `lead-triage:${lead.id}`,
    now,
    dueAt: plan.taskDueAt,
  });
  await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, {
    playbookApplied: true,
  });

  return true;
};
