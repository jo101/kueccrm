import { isDefined } from 'twenty-sdk/utils';

import {
  createRecord,
  listRecords,
  quoteFilterValues,
  type TwentyApi,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import { notifyMembers, recordLinkFor } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type CampaignTargetRecord,
  type LeadRecord,
} from 'src/automation/records/record-types';
import {
  isTargetingCampaign,
  planCampaignTargets,
  type TargetableCompany,
  type TargetingCampaign,
} from 'src/automation/rules/campaign-targets.rule';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { CAMPAIGN_TARGET_STATUS } from 'src/objects/campaign-target.object';

export type CampaignToSync = TargetingCampaign & {
  name: string | null;
  ownerId: string | null;
};

export type CampaignSyncResult = { created: number; markedLeadCreated: number; overLimitBy: number };

// G1, from the event and from the daily sweep: same plan, same writes, and a
// notice to the campaign owner only when companies were added.
export const syncCampaignTargets = async ({
  api,
  campaign,
  now,
}: {
  api: TwentyApi;
  campaign: CampaignToSync;
  now: Date;
}): Promise<CampaignSyncResult> => {
  const [sectorCompanies, targets, campaignLeads] = await Promise.all([
    isTargetingCampaign(campaign)
      ? listRecords<TargetableCompany>(
          api.asApplication,
          OBJECT_NAMES.company,
          `sector[eq]:${campaign.targetSector}`,
        )
      : Promise.resolve([]),
    listRecords<CampaignTargetRecord>(
      api.asApplication,
      OBJECT_NAMES.campaignTarget,
      `campaignId[eq]:"${campaign.id}"`,
    ),
    listRecords<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, `campaignId[eq]:"${campaign.id}"`),
  ]);
  const knownCompanyIds = new Set(sectorCompanies.map(({ id }) => id));
  const leadCompanyIds = [
    ...new Set(campaignLeads.map(({ companyId }) => companyId).filter(isDefined)),
  ].filter((companyId) => !knownCompanyIds.has(companyId));
  const leadCompanies =
    leadCompanyIds.length > 0
      ? await listRecords<TargetableCompany>(
          api.asApplication,
          OBJECT_NAMES.company,
          `id[in]:${quoteFilterValues(leadCompanyIds)}`,
        )
      : [];
  const plan = planCampaignTargets({
    campaign,
    companies: [...sectorCompanies, ...leadCompanies],
    targets,
    campaignLeads,
  });

  for (const target of plan.create) {
    await createRecord(api.asApplication, OBJECT_NAMES.campaignTarget, {
      name: target.name,
      status: target.status,
      campaignId: campaign.id,
      companyId: target.companyId,
    });
  }

  for (const targetId of plan.markLeadCreated) {
    await updateRecord(api.asApplication, OBJECT_NAMES.campaignTarget, targetId, {
      status: CAMPAIGN_TARGET_STATUS.LEAD_CREATED,
    });
  }

  const added = plan.create.filter(({ status }) => status === CAMPAIGN_TARGET_STATUS.TO_CONTACT).length;

  if (added > 0) {
    const target = { objectNameSingular: OBJECT_NAMES.project.singular, recordId: campaign.id };

    await notifyMembers({
      api,
      memberIds: [campaign.ownerId],
      message: NOTIFICATION_MESSAGES.campaignTargetsAdded({
        subject: campaign.name ?? '',
        link: recordLinkFor(target),
        reason:
          plan.overLimitBy > 0
            ? `${added} companies added, ${plan.overLimitBy} more match: narrow the size class.`
            : `${added} companies added.`,
      }),
      taskTitle: `Target list: ${campaign.name ?? ''}`,
      target,
      dedupeKey: `campaign-targets:${campaign.id}:${toDubaiDateString(now)}:${targets.length + plan.create.length}`,
      now,
    });
  }

  return {
    created: plan.create.length,
    markedLeadCreated: plan.markLeadCreated.length,
    overLimitBy: plan.overLimitBy,
  };
};
