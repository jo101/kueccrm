import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import packPipelineExitCriteriaMissingView from '../views/dashboard/pack-pipeline-exit-criteria-missing.view';
import packPipelineLeadsPastContactTimeView from '../views/dashboard/pack-pipeline-leads-past-contact-time.view';
import packPipelineOpenLeadsView from '../views/dashboard/pack-pipeline-open-leads.view';
import packPipelineOpenOpportunitiesView from '../views/dashboard/pack-pipeline-open-opportunities.view';
import packPipelineReferralCreditsView from '../views/dashboard/pack-pipeline-referral-credits.view';
import packPipelineTieredAccountsView from '../views/dashboard/pack-pipeline-tiered-accounts.view';
import {
  BAR_CHART_DEFAULTS,
  belowGuidance,
  chartFilterFromView,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const PACK_PIPELINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '17a7045f-fbe7-4108-acbb-b1e8bc490d4c';
export const PACK_PIPELINE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'df4a4155-5f2b-4593-a934-3aa3bc2a12ce';

const { opportunity, company } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

const CHART_COLUMN = 0;
const CHART_WIDTH = 5;
const TABLE_COLUMN = 5;
const TABLE_WIDTH = 7;
const FULL_WIDTH = 12;

const BY_SELECT = {
  ...BAR_CHART_DEFAULTS,
  primaryAxisOrderBy: 'FIELD_POSITION_ASC',
} as const;

// The CRM pack's dashboard tab: lead to opportunity with its contact times,
// stage exit criteria, account tiers and referral credit (kuec/playbooks/crm-pack.md).
export default definePageLayoutTab({
  universalIdentifier: PACK_PIPELINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Pipeline pack',
  position: 3,
  icon: 'IconFilter',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: PACK_PIPELINE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'packPipeline',
    }),
    ...belowGuidance([
      {
        universalIdentifier: '1e1573d8-af6b-433a-876a-4d13c08e95a9',
        title: 'Open leads by status',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(0, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(packPipelineOpenLeadsView),
          ...BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: 'ccf79eea-62d6-4d97-94f0-86ebdf91b6aa',
        title: 'Open leads, oldest status first',
        view: packPipelineOpenLeadsView,
        position: gridPosition(0, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      recordTableWidget({
        universalIdentifier: '95e26b44-9c5c-4ae5-8ea4-e1aa9623994f',
        title: 'Leads past their contact time',
        view: packPipelineLeadsPastContactTimeView,
        position: gridPosition(5, 0, 4, FULL_WIDTH),
      }),
      {
        universalIdentifier: 'b21ce2c8-53fb-4725-b456-c73cad98a681',
        title: 'Open opportunities by stage',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(9, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          filter: chartFilterFromView(packPipelineOpenOpportunitiesView),
          ...BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: '43b6f12f-5a8f-4b45-b3ca-71066eed4cab',
        title: 'Open opportunities, longest in stage first',
        view: packPipelineOpenOpportunitiesView,
        position: gridPosition(9, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      recordTableWidget({
        universalIdentifier: '0b1b4c85-b89d-4e35-aed8-97bc7e931858',
        title: 'Proposal or later, exit criteria missing',
        view: packPipelineExitCriteriaMissingView,
        position: gridPosition(14, 0, 4, FULL_WIDTH),
      }),
      {
        universalIdentifier: '0a5fc25d-7bac-49da-8ccc-3a10a96aa789',
        title: 'Accounts by tier',
        type: 'GRAPH',
        objectUniversalIdentifier: company.universalIdentifier,
        position: gridPosition(18, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: company.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(packPipelineTieredAccountsView),
          ...BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: 'a264b48a-29b8-4f4b-90ca-9cb1b47ca040',
        title: 'Tiered accounts, least recently engaged first',
        view: packPipelineTieredAccountsView,
        position: gridPosition(18, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      recordTableWidget({
        universalIdentifier: '208edcb2-050d-4ebd-8e18-97f87315199b',
        title: 'Referral credits',
        view: packPipelineReferralCreditsView,
        position: gridPosition(23, 0, 4, FULL_WIDTH),
      }),
    ]),
  ],
});
