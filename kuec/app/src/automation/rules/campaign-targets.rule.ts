import { isDefined } from 'twenty-sdk/utils';

import {
  CAMPAIGN_TARGET_STATUS,
  type CampaignTargetStatus,
} from 'src/objects/campaign-target.object';
import { PROJECT_STATUS, PROJECT_TYPE } from 'src/objects/project.object';

// A list longer than this is too broad to work: narrow the size class.
export const MAX_TARGETS_PER_CAMPAIGN = 500;

export type TargetingCampaign = {
  id: string;
  playbookType: string | null;
  status: string;
  targetSector: string | null;
  targetSizeClass: string | null;
};

export type TargetableCompany = {
  id: string;
  name: string | null;
  sector: string | null;
  sizeClass: string | null;
};

export type ExistingTarget = {
  id: string;
  companyId: string | null;
  status: CampaignTargetStatus;
};

export type CampaignLead = { companyId: string | null };

export type CampaignTargetPlan = {
  create: { companyId: string; name: string; status: CampaignTargetStatus }[];
  markLeadCreated: string[];
  overLimitBy: number;
};

// Statuses a person set on purpose; the app never moves a target out of them.
const FINAL_STATUSES: CampaignTargetStatus[] = [
  CAMPAIGN_TARGET_STATUS.LEAD_CREATED,
  CAMPAIGN_TARGET_STATUS.DO_NOT_CONTACT,
];

export const isTargetingCampaign = (campaign: TargetingCampaign): boolean =>
  campaign.playbookType === PROJECT_TYPE.GTM_CAMPAIGN &&
  campaign.status === PROJECT_STATUS.ACTIVE &&
  isDefined(campaign.targetSector);

export const matchesCampaign = (
  campaign: TargetingCampaign,
  company: TargetableCompany,
): boolean =>
  company.sector === campaign.targetSector &&
  (!isDefined(campaign.targetSizeClass) || company.sizeClass === campaign.targetSizeClass);

// Builds the list from the companies in the target sector and size class (the
// registry fills both), adds any company that sent a lead attributed to the
// campaign, and marks a target Lead created once its company has one. Never
// removes a target and never undoes a person's status.
export const planCampaignTargets = ({
  campaign,
  companies,
  targets,
  campaignLeads,
}: {
  campaign: TargetingCampaign;
  companies: TargetableCompany[];
  targets: ExistingTarget[];
  campaignLeads: CampaignLead[];
}): CampaignTargetPlan => {
  const targetedCompanyIds = new Set(targets.map(({ companyId }) => companyId).filter(isDefined));
  const leadCompanyIds = new Set(campaignLeads.map(({ companyId }) => companyId).filter(isDefined));
  const companyById = new Map(companies.map((company) => [company.id, company]));
  const fromLeads = [...leadCompanyIds]
    .filter((companyId) => !targetedCompanyIds.has(companyId))
    .map((companyId) => ({
      companyId,
      name: companyById.get(companyId)?.name ?? companyId,
      status: CAMPAIGN_TARGET_STATUS.LEAD_CREATED,
    }));
  const matching = isTargetingCampaign(campaign)
    ? companies
        .filter(
          (company) =>
            matchesCampaign(campaign, company) &&
            !targetedCompanyIds.has(company.id) &&
            !leadCompanyIds.has(company.id),
        )
        .sort((left, right) => (left.name ?? '').localeCompare(right.name ?? ''))
    : [];
  const room = Math.max(0, MAX_TARGETS_PER_CAMPAIGN - targets.length - fromLeads.length);

  return {
    create: [
      ...fromLeads,
      ...matching.slice(0, room).map((company) => ({
        companyId: company.id,
        name: company.name ?? company.id,
        status: CAMPAIGN_TARGET_STATUS.TO_CONTACT,
      })),
    ],
    markLeadCreated: targets
      .filter(
        (target) =>
          isDefined(target.companyId) &&
          leadCompanyIds.has(target.companyId) &&
          !FINAL_STATUSES.includes(target.status),
      )
      .map(({ id }) => id),
    overLimitBy: Math.max(0, matching.length - room),
  };
};
