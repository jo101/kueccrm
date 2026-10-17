import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lost-reason-category-on-opportunity.field';
import { PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/playbook-type-on-opportunity.field';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/probability-on-opportunity.field';
import { SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/source-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';
import {
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/contract.object';
import {
  LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';
import {
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../objects/milestone.object';
import {
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import activeProjectsView from '../views/dashboard/bd-active-projects.view';
import allLeadsView from '../views/dashboard/bd-all-leads.view';
import closingThisQuarterView from '../views/dashboard/bd-closing-this-quarter.view';
import contractsExpiringIn90DaysView from '../views/dashboard/bd-contracts-expiring-in-90-days.view';
import contractsInNegotiationView from '../views/dashboard/bd-contracts-in-negotiation.view';
import contractsSignedThisYearView from '../views/dashboard/bd-contracts-signed-this-year.view';
import keyAccountsNotEngagedView from '../views/dashboard/bd-key-accounts-not-engaged.view';
import leadsCreatedPast12MonthsView from '../views/dashboard/bd-leads-created-past-12-months.view';
import lostThisQuarterView from '../views/dashboard/bd-lost-this-quarter.view';
import milestonesDueIn30DaysView from '../views/dashboard/bd-milestones-due-in-30-days.view';
import openPipelineByStageView from '../views/dashboard/bd-open-pipeline-by-stage.view';
import openPipelineByTypeAndSectorView from '../views/dashboard/bd-open-pipeline-by-type-and-sector.view';
import opportunitiesCreatedPast12MonthsView from '../views/dashboard/bd-opportunities-created-past-12-months.view';
import signedLicencesThisYearView from '../views/dashboard/bd-signed-licences-this-year.view';
import staleOpportunitiesView from '../views/dashboard/bd-stale-opportunities.view';
import wonAndLostThisQuarterView from '../views/dashboard/bd-won-and-lost-this-quarter.view';
import {
  BAR_CHART_DEFAULTS,
  belowGuidance,
  CHART_DEFAULTS,
  chartFilterFromView,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const BD_EXECUTIVE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '89496b1a-5d77-49b4-bfe1-16c3b7de25d6';
export const BD_EXECUTIVE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '2c0707ca-5efc-429e-b063-172797615349';
export const BD_THURSDAY_UPDATE_WIDGET_UNIVERSAL_IDENTIFIER = 'ba5b0873-e242-434f-8e28-e41fd0ac329f';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;
const company = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company;

// Charts on the left, the records behind them on the right.
const CHART_COLUMN = 0;
const CHART_WIDTH = 5;
const TABLE_COLUMN = 5;
const TABLE_WIDTH = 7;

const THURSDAY_UPDATE_HEADINGS = [
  { blockId: '8a664242-0dd1-4362-95c1-df8f5a72702b', label: 'What closed:' },
  { blockId: '3c066f39-46ca-4940-b334-6ed7bd122db5', label: 'What is blocked, and the decision I need:' },
  { blockId: '2611fa24-4159-412e-bb1b-368dbc337cb0', label: 'Next week:' },
];

const thursdayUpdateBlocknote = JSON.stringify(
  THURSDAY_UPDATE_HEADINGS.map(({ blockId, label }) => ({
    id: blockId,
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [{ type: 'text', text: label, styles: { bold: true } }],
    children: [],
  })),
);

const thursdayUpdateMarkdown = THURSDAY_UPDATE_HEADINGS.map(
  ({ label }) => `**${label}**`,
).join('\n\n');

export default definePageLayoutTab({
  universalIdentifier: BD_EXECUTIVE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Executive',
  position: 0,
  icon: 'IconPresentation',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: BD_EXECUTIVE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'bdExecutive',
    }),
    ...belowGuidance([
      {
        universalIdentifier: BD_THURSDAY_UPDATE_WIDGET_UNIVERSAL_IDENTIFIER,
        title: 'Thursday update',
        type: 'STANDALONE_RICH_TEXT',
        position: gridPosition(0, 0, 4, 12),
        configuration: {
          configurationType: 'STANDALONE_RICH_TEXT',
          body: {
            blocknote: thursdayUpdateBlocknote,
            markdown: thursdayUpdateMarkdown,
          },
        },
      },
      {
        universalIdentifier: '0e2a8ad2-0d5c-4ddf-842f-d0ad139a662f',
        title: 'Signed licences this year',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(4, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          suffix: ' / 2',
          description: 'Licence opportunities that entered Signed this calendar year, against a target of 2',
          filter: chartFilterFromView(signedLicencesThisYearView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '3ea570c8-8aca-4af5-a383-0671bfc07a59',
        title: 'Signed licences this year',
        view: signedLicencesThisYearView,
        position: gridPosition(4, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'e396852a-986c-4fd8-96d7-a9d600f4628d',
        title: 'Signed contract value this year',
        type: 'GRAPH',
        objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(8, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.SUM,
          prefix: 'AED ',
          description: 'Sum of Value of contracts signed this calendar year, whatever their status now',
          filter: chartFilterFromView(contractsSignedThisYearView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: 'c1e92f00-1682-4fba-8563-36b443bdc5c1',
        title: 'Contracts signed this year',
        view: contractsSignedThisYearView,
        position: gridPosition(8, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '80cd0dbf-a319-42e3-8050-1741a4465656',
        title: 'Open pipeline by stage (count)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(12, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          filter: chartFilterFromView(openPipelineByStageView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      {
        universalIdentifier: 'a9dfb9a0-3f77-4559-a3a9-28667ba7f023',
        title: 'Open pipeline by stage (Amount)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(17, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
          aggregateOperation: AggregateOperations.SUM,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          filter: chartFilterFromView(openPipelineByStageView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      // Stands in for a weighted pipeline until the expected-value field exists (Prompt 4).
      {
        universalIdentifier: '14d5939b-e851-4588-9580-f351ce217679',
        title: 'Open pipeline by stage and probability (Amount)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(22, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
          aggregateOperation: AggregateOperations.SUM,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
          groupMode: 'STACKED',
          displayLegend: true,
          description: 'Substitute for weighted pipeline until the expected-value field exists',
          filter: chartFilterFromView(openPipelineByStageView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: 'a565fae9-ffd1-42f9-ae3d-48dfb05f1da9',
        title: 'Open pipeline',
        view: openPipelineByStageView,
        position: gridPosition(12, TABLE_COLUMN, 15, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'e44d66f9-e437-4a84-b8c3-189a683fa37c',
        title: 'Open pipeline by type (Amount)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(27, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
          aggregateOperation: AggregateOperations.SUM,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          filter: chartFilterFromView(openPipelineByTypeAndSectorView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      {
        universalIdentifier: 'a2e114ba-3036-4c7e-a4a3-4d59c38be97d',
        title: 'Open pipeline by company sector (Amount)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(32, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'PIE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
          aggregateOperation: AggregateOperations.SUM,
          groupByFieldMetadataUniversalIdentifier: opportunity.fields.company.universalIdentifier,
          groupBySubFieldName: 'sector',
          orderBy: 'VALUE_DESC',
          displayLegend: true,
          filter: chartFilterFromView(openPipelineByTypeAndSectorView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '0c26b1c6-ec30-457c-9f9b-47f3b0b2f961',
        title: 'Open pipeline by type and company',
        view: openPipelineByTypeAndSectorView,
        position: gridPosition(27, TABLE_COLUMN, 10, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '5b298120-6f7e-4a96-80f6-2a29cc33f0f0',
        title: 'Opportunities created per month, by source',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(37, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.createdAt.universalIdentifier,
          primaryAxisDateGranularity: 'MONTH',
          primaryAxisOrderBy: 'FIELD_ASC',
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
          groupMode: 'STACKED',
          displayLegend: true,
          description: 'The past 12 months, this month included',
          filter: chartFilterFromView(opportunitiesCreatedPast12MonthsView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: 'b7ff4f4f-5727-4b83-9fb4-5c801706d2b7',
        title: 'Opportunities created, past 12 months',
        view: opportunitiesCreatedPast12MonthsView,
        position: gridPosition(37, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '1e10f5ef-fbc5-4b5e-9746-2dea928ad954',
        title: 'Closing this quarter',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(42, CHART_COLUMN, 3, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          filter: chartFilterFromView(closingThisQuarterView),
          ...CHART_DEFAULTS,
        },
      },
      {
        universalIdentifier: '7740fceb-3725-4ccc-ae63-eee19529032a',
        title: 'Closing this quarter (Amount)',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(45, CHART_COLUMN, 3, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
          aggregateOperation: AggregateOperations.SUM,
          prefix: 'AED ',
          filter: chartFilterFromView(closingThisQuarterView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '46cc88e6-115a-4cad-a5de-bc029de004cd',
        title: 'Closing this quarter',
        view: closingThisQuarterView,
        position: gridPosition(42, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'c84a9610-9cdb-415c-b3a1-05374bd7a6df',
        title: 'Stale: in stage for more than 30 days',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(48, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          description: 'Open opportunities whose Stage entered at is more than 30 days ago (Stale from is in the past)',
          filter: chartFilterFromView(staleOpportunitiesView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: 'b9e76054-b5fb-4437-aa92-2412c9315dc6',
        title: 'Stale opportunities',
        view: staleOpportunitiesView,
        position: gridPosition(48, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'd0c48e77-7b78-479a-a4ec-effa99ce8658',
        title: 'Won and lost by month, this quarter',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(52, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
          primaryAxisDateGranularity: 'MONTH',
          primaryAxisOrderBy: 'FIELD_ASC',
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
          groupMode: 'GROUPED',
          displayLegend: true,
          filter: chartFilterFromView(wonAndLostThisQuarterView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '7224aca2-ab59-4b04-b1ef-ef67737a9b86',
        title: 'Won and lost this quarter',
        view: wonAndLostThisQuarterView,
        position: gridPosition(52, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'c03b4ac8-a714-4d2d-9de8-96d6170234f7',
        title: 'Lost by reason, this quarter',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(57, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'PIE_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          groupByFieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
          orderBy: 'VALUE_DESC',
          displayLegend: true,
          filter: chartFilterFromView(lostThisQuarterView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '13441cf1-b713-4283-9a8e-3e9dd68619d3',
        title: 'Lost this quarter',
        view: lostThisQuarterView,
        position: gridPosition(57, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'f183611d-9632-4323-a896-bd8f4c8ba2b7',
        title: 'Tier 1 and 2 accounts not engaged in 60 days',
        type: 'GRAPH',
        objectUniversalIdentifier: company.universalIdentifier,
        position: gridPosition(62, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: company.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          description: 'Tier 1 (strategic) and Tier 2 companies whose last engagement is more than 60 days ago',
          filter: chartFilterFromView(keyAccountsNotEngagedView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '56952397-ef15-416d-a7fd-f4f416020369',
        title: 'Tier 1 and 2 accounts not engaged in 60 days',
        view: keyAccountsNotEngagedView,
        position: gridPosition(62, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '26a4a5ef-55b0-4238-a9b9-2c0e247e7dcf',
        title: 'Contracts in negotiation',
        type: 'GRAPH',
        objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(66, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          filter: chartFilterFromView(contractsInNegotiationView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '3fd1adb1-1b3e-4473-a04d-58e2a305162f',
        title: 'Contracts in negotiation',
        view: contractsInNegotiationView,
        position: gridPosition(66, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '94fbcb6b-e3a3-41ea-a7ee-94ccc74a9c4c',
        title: 'Contracts expiring in 90 days',
        type: 'GRAPH',
        objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(70, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          description: 'Signed contracts whose Expires on is today or in the next 90 days',
          filter: chartFilterFromView(contractsExpiringIn90DaysView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '6d556f6b-0710-4fbb-91ff-a3984222d457',
        title: 'Contracts expiring in 90 days',
        view: contractsExpiringIn90DaysView,
        position: gridPosition(70, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '7a4095f9-f0c2-4747-8424-f7cc2ad85ca1',
        title: 'Active projects by health',
        type: 'GRAPH',
        objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(74, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          filter: chartFilterFromView(activeProjectsView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '9e690834-4d0b-40f9-ae8b-183d0fc61d3f',
        title: 'Active projects',
        view: activeProjectsView,
        position: gridPosition(74, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '60c80260-8071-4a3f-a6c5-e89de79e454f',
        title: 'Milestones due in 30 days',
        type: 'GRAPH',
        objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(79, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          description: 'Open milestones due today or in the next 30 days',
          filter: chartFilterFromView(milestonesDueIn30DaysView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '871862e4-9845-45c6-b8ec-d64baa7ed2a4',
        title: 'Milestones due in 30 days',
        view: milestonesDueIn30DaysView,
        position: gridPosition(79, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '11479a63-865c-45f4-9ad8-1055d5f6080b',
        title: 'Leads created per month, by source',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(83, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
          primaryAxisDateGranularity: 'MONTH',
          primaryAxisOrderBy: 'FIELD_ASC',
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
          groupMode: 'STACKED',
          displayLegend: true,
          description: 'The past 12 months, this month included',
          filter: chartFilterFromView(leadsCreatedPast12MonthsView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '66273247-5070-42a5-8caf-c95f2002f53c',
        title: 'Leads created, past 12 months',
        view: leadsCreatedPast12MonthsView,
        position: gridPosition(83, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '59583e23-fd8a-49c0-9f59-6435042af465',
        title: 'Lead conversion rate',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(88, CHART_COLUMN, 4, CHART_WIDTH),
        configuration: {
          configurationType: 'AGGREGATE_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          ratioAggregateConfig: {
            fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
            optionValue: LEAD_STATUS.CONVERTED,
          },
          description: 'Leads with Status Converted as a share of all leads',
          filter: chartFilterFromView(allLeadsView),
          ...CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '8b531067-ef42-4b5d-a6d3-bf41884ba224',
        title: 'All leads',
        view: allLeadsView,
        position: gridPosition(88, TABLE_COLUMN, 4, TABLE_WIDTH),
      }),
    ]),
  ],
});
