import { isDefined } from 'twenty-sdk/utils';

import {
  listRecords,
  type TwentyApi,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { leadTarget } from 'src/automation/leads/lead-target';
import {
  createNoteOnce,
  type NotificationTarget,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type LeadRecord,
  type OpportunityRecord,
  type PersonRecord,
  type WorkspaceMemberRecord,
} from 'src/automation/records/record-types';
import { planReferralCredit } from 'src/automation/rules/lead-referral.rule';

const fullName = (
  name: { firstName: string | null; lastName: string | null } | null | undefined,
): string | null => {
  const text = [name?.firstName, name?.lastName].filter(isDefined).join(' ').trim();

  return text.length > 0 ? text : null;
};

// L6, on Signed: the lead is stamped (the Team dashboard's Leads by referrer
// counts stamped leads per colleague) and a Note records the credit on the
// referrer's Person record, the lead and the opportunity.
export const creditReferral = async ({
  api,
  lead,
  opportunity,
  now,
}: {
  api: TwentyApi;
  lead: LeadRecord;
  opportunity: Pick<OpportunityRecord, 'id' | 'name'>;
  now: Date;
}): Promise<boolean> => {
  const plan = planReferralCredit({ lead, opportunityId: opportunity.id, now });

  if (plan === null) {
    return false;
  }

  if (isDefined(plan.changes)) {
    await updateRecord(api.asApplication, OBJECT_NAMES.lead, lead.id, plan.changes);
  }

  const [person] = isDefined(lead.referredById)
    ? await listRecords<PersonRecord>(
        api.asApplication,
        OBJECT_NAMES.person,
        `id[eq]:"${lead.referredById}"`,
      )
    : [];
  const [member] = isDefined(lead.referredByMemberId)
    ? await listRecords<WorkspaceMemberRecord>(
        api.asApplication,
        OBJECT_NAMES.workspaceMember,
        `id[eq]:"${lead.referredByMemberId}"`,
      )
    : [];
  const opportunityTarget: NotificationTarget = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: opportunity.id,
  };
  const targets: NotificationTarget[] = [
    ...(isDefined(plan.notePersonId)
      ? [{ objectNameSingular: OBJECT_NAMES.person.singular, recordId: plan.notePersonId }]
      : []),
    leadTarget(lead.id),
    opportunityTarget,
  ];
  const referrers = [fullName(person?.name), fullName(member?.name)].filter(isDefined);

  await createNoteOnce({
    api,
    title: `Referral credit: ${opportunity.name ?? lead.name ?? ''}`,
    body: [
      `Signed on ${toDubaiDateString(now)}: ${opportunity.name ?? ''} (${recordLinkFor(opportunityTarget)}), from the lead ${lead.name ?? ''} (${recordLinkFor(leadTarget(lead.id))}).`,
      `Referral credit: ${referrers.length > 0 ? referrers.join(' and ') : 'the referrer on the lead'}.`,
      ...(isDefined(lead.referralNote) && lead.referralNote.trim().length > 0
        ? [`Referral note: ${lead.referralNote}`]
        : []),
    ].join('\n\n'),
    targets,
    dedupeKey: plan.dedupeKey,
  });

  return true;
};
