import {
  CRM_PACK_ENABLED_VARIABLE,
  GTM_PACK_ENABLED_VARIABLE,
  PM_PACK_ENABLED_VARIABLE,
} from 'src/application.config';
import { C01_STAGE_EXIT_CHECK_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/c01-stage-exit-check';
import { G01_CAMPAIGN_TARGETS_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/g01-campaign-targets';
import { L02_LEAD_CONTACT_SLA_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/l02-lead-contact-sla';
import { L03_LEAD_AUTO_DEAD_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/l03-lead-auto-dead';
import { L06_LEAD_REFERRAL_THANKS_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/l06-lead-referral-thanks';
import { L06_REFERRAL_SIGNED_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/l06-referral-signed';
import { LEAD_SWEEP_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/lead-sweep';
import { P01_RAID_LOG_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/p01-raid-log';
import { P02_WEEKLY_REVIEW_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/p02-weekly-review';
import { PACKS_SWEEP_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/packs-sweep';
import { PACK_CAMPAIGNS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER } from 'src/page-layout-tabs/pack-campaigns.page-layout-tab';
import { PACK_PIPELINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER } from 'src/page-layout-tabs/pack-pipeline.page-layout-tab';
import { PACK_PROJECTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER } from 'src/page-layout-tabs/pack-projects.page-layout-tab';
import { PACK, type Pack } from 'src/packs/pack-switch';
import { BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/blocked-work-packages.view';
import { CAMPAIGN_TARGETS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/campaign-targets-everything.view';
import { CAMPAIGN_TARGETS_TO_WORK_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/campaign-targets-to-work.view';
import { COMPANIES_BY_TIER_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/companies-by-tier.view';
import { PACK_CAMPAIGNS_ACTIVE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-campaigns-active-campaigns.view';
import { PACK_CAMPAIGNS_CAMPAIGN_LEADS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-campaigns-campaign-leads.view';
import { PACK_CAMPAIGNS_CAMPAIGN_TARGETS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-campaigns-campaign-targets.view';
import { PACK_PIPELINE_EXIT_CRITERIA_MISSING_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-exit-criteria-missing.view';
import { PACK_PIPELINE_LEADS_PAST_CONTACT_TIME_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-leads-past-contact-time.view';
import { PACK_PIPELINE_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-open-leads.view';
import { PACK_PIPELINE_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-open-opportunities.view';
import { PACK_PIPELINE_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-referral-credits.view';
import { PACK_PIPELINE_TIERED_ACCOUNTS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-pipeline-tiered-accounts.view';
import { PACK_PROJECTS_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-projects-active-projects.view';
import { PACK_PROJECTS_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-projects-blocked-work-packages.view';
import { PACK_PROJECTS_OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/dashboard/pack-projects-open-milestones.view';
import { LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/lead-inbox.view';
import { LEADS_BY_CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/leads-by-campaign.view';
import { LEADS_QUALIFIED_NOT_CONVERTED_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/leads-qualified-not-converted.view';
import { OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/open-milestones.view';
import { OPPORTUNITIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/opportunities-missing-key-fields.view';
import { PIPELINE_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/pipeline.view';
import { PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/project-portfolio.view';
import { PROJECTS_AT_RISK_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/projects-at-risk.view';
import { PROJECTS_BY_HEALTH_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/projects-by-health.view';

// A best-practice pack is app content: a playbook, views, a dashboard tab and
// guidance texts, shipped and versioned with kuec-bd-ops, its automations
// switched by one application variable (runbooks/21-uventure-readiness.md section 5).
export type PackContent = {
  pack: Pack;
  label: string;
  playbook: string;
  enabledVariable: string;
  dashboardTabTitle: string;
  dashboardTabUniversalIdentifier: string;
  guidancePageKey: string;
  viewUniversalIdentifiers: string[];
  logicFunctionUniversalIdentifiers: string[];
};

export const PACKS: PackContent[] = [
  {
    pack: PACK.CRM,
    label: 'CRM pack',
    playbook: 'playbooks/crm-pack.md',
    enabledVariable: CRM_PACK_ENABLED_VARIABLE,
    dashboardTabTitle: 'Pipeline pack',
    dashboardTabUniversalIdentifier: PACK_PIPELINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'packPipeline',
    viewUniversalIdentifiers: [
      LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER,
      LEADS_QUALIFIED_NOT_CONVERTED_VIEW_UNIVERSAL_IDENTIFIER,
      PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
      OPPORTUNITIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
      COMPANIES_BY_TIER_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_LEADS_PAST_CONTACT_TIME_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_EXIT_CRITERIA_MISSING_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_TIERED_ACCOUNTS_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PIPELINE_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER,
    ],
    logicFunctionUniversalIdentifiers: [
      L02_LEAD_CONTACT_SLA_UNIVERSAL_IDENTIFIER,
      L03_LEAD_AUTO_DEAD_UNIVERSAL_IDENTIFIER,
      L06_LEAD_REFERRAL_THANKS_UNIVERSAL_IDENTIFIER,
      L06_REFERRAL_SIGNED_UNIVERSAL_IDENTIFIER,
      LEAD_SWEEP_UNIVERSAL_IDENTIFIER,
      C01_STAGE_EXIT_CHECK_UNIVERSAL_IDENTIFIER,
    ],
  },
  {
    pack: PACK.PM,
    label: 'PM pack',
    playbook: 'playbooks/pm-pack.md',
    enabledVariable: PM_PACK_ENABLED_VARIABLE,
    dashboardTabTitle: 'Project pack',
    dashboardTabUniversalIdentifier: PACK_PROJECTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'packProjects',
    viewUniversalIdentifiers: [
      PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER,
      PROJECTS_BY_HEALTH_VIEW_UNIVERSAL_IDENTIFIER,
      PROJECTS_AT_RISK_VIEW_UNIVERSAL_IDENTIFIER,
      OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
      BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PROJECTS_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PROJECTS_OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_PROJECTS_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
    ],
    logicFunctionUniversalIdentifiers: [
      P01_RAID_LOG_UNIVERSAL_IDENTIFIER,
      P02_WEEKLY_REVIEW_UNIVERSAL_IDENTIFIER,
      PACKS_SWEEP_UNIVERSAL_IDENTIFIER,
    ],
  },
  {
    pack: PACK.GTM,
    label: 'GTM pack',
    playbook: 'playbooks/gtm-pack.md',
    enabledVariable: GTM_PACK_ENABLED_VARIABLE,
    dashboardTabTitle: 'Campaign pack',
    dashboardTabUniversalIdentifier: PACK_CAMPAIGNS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'packCampaigns',
    viewUniversalIdentifiers: [
      CAMPAIGN_TARGETS_TO_WORK_VIEW_UNIVERSAL_IDENTIFIER,
      CAMPAIGN_TARGETS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
      LEADS_BY_CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_CAMPAIGNS_CAMPAIGN_TARGETS_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_CAMPAIGNS_CAMPAIGN_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
      PACK_CAMPAIGNS_ACTIVE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER,
    ],
    logicFunctionUniversalIdentifiers: [
      G01_CAMPAIGN_TARGETS_UNIVERSAL_IDENTIFIER,
      PACKS_SWEEP_UNIVERSAL_IDENTIFIER,
    ],
  },
];
