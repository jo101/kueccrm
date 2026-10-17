import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-campaign-target.field';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-lead.field';
import {
  CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
} from '../objects/campaign-target.object';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import packCampaignsActiveCampaignsView from '../views/dashboard/pack-campaigns-active-campaigns.view';
import packCampaignsCampaignLeadsView from '../views/dashboard/pack-campaigns-campaign-leads.view';
import packCampaignsCampaignTargetsView from '../views/dashboard/pack-campaigns-campaign-targets.view';
import {
  BAR_CHART_DEFAULTS,
  belowGuidance,
  chartFilterFromView,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const PACK_CAMPAIGNS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '2be88ed1-447c-482e-aeff-f4bfec2c4aa0';
export const PACK_CAMPAIGNS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'a7774a20-2d26-4d71-9748-9bef936e0ccb';
export const PACK_CAMPAIGNS_COST_PER_QUALIFIED_LEAD_WIDGET_UNIVERSAL_IDENTIFIER = '3d508690-4ed1-4bb7-bdb0-65d1ee700a7c';

// Every chart puts the campaign on the X axis: grouping on the campaign relation
// counts per campaign, with no per-campaign view to maintain.
const PER_CAMPAIGN = {
  ...BAR_CHART_DEFAULTS,
  primaryAxisOrderBy: 'FIELD_ASC',
  secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
  groupMode: 'STACKED',
  displayLegend: true,
} as const;

const COST_PER_QUALIFIED_LEAD_TEXT =
  'Not calculated yet: Twenty holds no campaign cost. It is filled once finance provides the cost of each campaign; until then this stays blank on purpose. / لم تُحسب بعد: لا يحتفظ Twenty بتكلفة الحملات. تُملأ عندما توفر المالية تكلفة كل حملة، وتبقى فارغة عمداً حتى ذلك الحين.';

// The GTM pack's dashboard tab: target lists, campaign leads and the active
// campaigns with their plan (kuec/playbooks/gtm-pack.md).
export default definePageLayoutTab({
  universalIdentifier: PACK_CAMPAIGNS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Campaign pack',
  position: 5,
  icon: 'IconSpeakerphone',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: PACK_CAMPAIGNS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'packCampaigns',
    }),
    ...belowGuidance([
      {
        universalIdentifier: '8cb666eb-9047-4af8-b509-e62eccc3229d',
        title: 'Targets per campaign, by status',
        type: 'GRAPH',
        objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
        position: gridPosition(0, 0, 6, 5),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(packCampaignsCampaignTargetsView),
          ...PER_CAMPAIGN,
        },
      },
      recordTableWidget({
        universalIdentifier: '224e5ace-e93b-4331-9779-21e6a141a53c',
        title: 'Campaign targets, latest change first',
        view: packCampaignsCampaignTargetsView,
        position: gridPosition(0, 5, 6, 7),
      }),
      {
        universalIdentifier: '6985959a-b205-4beb-bfee-a5eddffcfae6',
        title: 'Leads per campaign, by status',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(6, 0, 6, 5),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(packCampaignsCampaignLeadsView),
          ...PER_CAMPAIGN,
        },
      },
      recordTableWidget({
        universalIdentifier: 'eac9488f-b516-4fcd-8306-eabd3bcf6156',
        title: 'Leads attributed to a campaign',
        view: packCampaignsCampaignLeadsView,
        position: gridPosition(6, 5, 6, 7),
      }),
      recordTableWidget({
        universalIdentifier: 'c242a44b-0eaa-4856-af1e-90ad50dbc0d1',
        title: 'Active campaigns and their plan',
        view: packCampaignsActiveCampaignsView,
        position: gridPosition(12, 0, 5, 8),
      }),
      {
        universalIdentifier: PACK_CAMPAIGNS_COST_PER_QUALIFIED_LEAD_WIDGET_UNIVERSAL_IDENTIFIER,
        title: 'Cost per qualified lead',
        type: 'STANDALONE_RICH_TEXT',
        position: gridPosition(12, 8, 5, 4),
        configuration: {
          configurationType: 'STANDALONE_RICH_TEXT',
          body: {
            blocknote: JSON.stringify([
              {
                id: 'cost-per-qualified-lead',
                type: 'paragraph',
                props: { textColor: 'gray', backgroundColor: 'default', textAlignment: 'left' },
                content: [{ type: 'text', text: COST_PER_QUALIFIED_LEAD_TEXT, styles: {} }],
                children: [],
              },
            ]),
            markdown: COST_PER_QUALIFIED_LEAD_TEXT,
          },
        },
      },
    ]),
  ],
});
