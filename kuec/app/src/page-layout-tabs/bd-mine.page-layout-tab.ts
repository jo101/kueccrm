import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';
import {
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import myClosingThisQuarterView from '../views/dashboard/bd-my-closing-this-quarter.view';
import myEngagementsThisWeekView from '../views/dashboard/bd-my-engagements-this-week.view';
import myOpenWorkPackagesView from '../views/dashboard/bd-my-open-work-packages.view';
import myOpportunitiesWithoutNextActionView from '../views/dashboard/bd-my-opportunities-without-next-action.view';
import myOverdueWorkPackagesView from '../views/dashboard/bd-my-overdue-work-packages.view';
import mySubmittedWorkPackagesView from '../views/dashboard/bd-my-submitted-work-packages.view';
import {
  CHART_DEFAULTS,
  chartFilterFromView,
  gridPosition,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const BD_MINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '91fff47f-7262-4ae1-af66-b6ebe6ece0eb';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;

const CHART_COLUMN = 0;
const CHART_WIDTH = 5;
const TABLE_COLUMN = 5;
const TABLE_WIDTH = 7;

// Every view behind this tab filters its owner with "is me", so each member sees their own numbers.
export default definePageLayoutTab({
  universalIdentifier: BD_MINE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Mine',
  position: 2,
  icon: 'IconUser',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    {
      universalIdentifier: 'da42104d-9ba7-4ce2-837e-cba01904e347',
      title: 'My open work packages',
      type: 'GRAPH',
      objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      position: gridPosition(0, CHART_COLUMN, 4, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(myOpenWorkPackagesView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: 'c1f2ad6b-b9db-425e-aaa2-fb7187302721',
      title: 'My open work packages',
      view: myOpenWorkPackagesView,
      position: gridPosition(0, TABLE_COLUMN, 4, TABLE_WIDTH),
    }),
    {
      universalIdentifier: '8f2abb90-7e1b-40ea-96f8-901d80870e71',
      title: 'My overdue work packages',
      type: 'GRAPH',
      objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      position: gridPosition(4, CHART_COLUMN, 4, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(myOverdueWorkPackagesView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: 'e9bf9172-d04c-44c5-b91b-5e2edc796852',
      title: 'My overdue work packages',
      view: myOverdueWorkPackagesView,
      position: gridPosition(4, TABLE_COLUMN, 4, TABLE_WIDTH),
    }),
    {
      universalIdentifier: '26f7b654-6611-495c-85b2-d529c37d551e',
      title: 'My submitted work packages, awaiting review',
      type: 'GRAPH',
      objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      position: gridPosition(8, CHART_COLUMN, 4, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(mySubmittedWorkPackagesView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: '6eb164e5-9339-41e4-b3dd-5a933e1e1c5c',
      title: 'My submitted work packages, awaiting review',
      view: mySubmittedWorkPackagesView,
      position: gridPosition(8, TABLE_COLUMN, 4, TABLE_WIDTH),
    }),
    {
      universalIdentifier: '5875f861-24f8-41c3-8c1d-ae6986d80118',
      title: 'My opportunities with no next action',
      type: 'GRAPH',
      objectUniversalIdentifier: opportunity.universalIdentifier,
      position: gridPosition(12, CHART_COLUMN, 4, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(myOpportunitiesWithoutNextActionView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: '6828cda8-8afe-42df-9319-49c96abb0097',
      title: 'My opportunities with no next action',
      view: myOpportunitiesWithoutNextActionView,
      position: gridPosition(12, TABLE_COLUMN, 4, TABLE_WIDTH),
    }),
    {
      universalIdentifier: '18091ea6-e2a3-4c74-8b0d-453ef7df0c0f',
      title: 'My engagements this week',
      type: 'GRAPH',
      objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
      position: gridPosition(16, CHART_COLUMN, 4, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(myEngagementsThisWeekView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: '04d8acf3-91d9-498c-b802-b04e1ac4657d',
      title: 'My engagements this week',
      view: myEngagementsThisWeekView,
      position: gridPosition(16, TABLE_COLUMN, 4, TABLE_WIDTH),
    }),
    {
      universalIdentifier: '1819bcb5-4474-46b9-b7ef-f36022999aa5',
      title: 'My opportunities closing this quarter',
      type: 'GRAPH',
      objectUniversalIdentifier: opportunity.universalIdentifier,
      position: gridPosition(20, CHART_COLUMN, 3, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(myClosingThisQuarterView),
        ...CHART_DEFAULTS,
      },
    },
    {
      universalIdentifier: '9e8c098a-02ee-463d-8508-305615c4d6b8',
      title: 'My opportunities closing this quarter (Amount)',
      type: 'GRAPH',
      objectUniversalIdentifier: opportunity.universalIdentifier,
      position: gridPosition(23, CHART_COLUMN, 3, CHART_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
        aggregateOperation: AggregateOperations.SUM,
        prefix: 'AED ',
        filter: chartFilterFromView(myClosingThisQuarterView),
        ...CHART_DEFAULTS,
      },
    },
    recordTableWidget({
      universalIdentifier: '5d1d8e25-3dea-451f-b74a-9eec99db00c2',
      title: 'My opportunities closing this quarter',
      view: myClosingThisQuarterView,
      position: gridPosition(20, TABLE_COLUMN, 6, TABLE_WIDTH),
    }),
  ],
});
