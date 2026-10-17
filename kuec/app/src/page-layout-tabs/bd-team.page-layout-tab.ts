import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/referred-by-member-on-lead.field';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/reviewer-on-work-package.field';
import {
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';
import {
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';
import {
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import teamActiveProjectsView from '../views/dashboard/bd-team-active-projects.view';
import teamBlockedWorkPackagesView from '../views/dashboard/bd-team-blocked-work-packages.view';
import teamEngagementsThisMonthView from '../views/dashboard/bd-team-engagements-this-month.view';
import teamOfferedWorkPackagesView from '../views/dashboard/bd-team-offered-work-packages.view';
import teamOpenLeadsView from '../views/dashboard/bd-team-open-leads.view';
import teamOpenOpportunitiesView from '../views/dashboard/bd-team-open-opportunities.view';
import teamOpenWorkPackagesView from '../views/dashboard/bd-team-open-work-packages.view';
import teamOpportunitiesWithoutNextActionView from '../views/dashboard/bd-team-opportunities-without-next-action.view';
import teamOverdueWorkPackagesView from '../views/dashboard/bd-team-overdue-work-packages.view';
import teamReferralCreditsView from '../views/dashboard/bd-team-referral-credits.view';
import teamSubmittedForReviewView from '../views/dashboard/bd-team-submitted-for-review.view';
import teamWorkPackageBoardView from '../views/dashboard/bd-team-work-package-board.view';
import {
  BAR_CHART_DEFAULTS,
  belowGuidance,
  chartFilterFromView,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const BD_TEAM_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '68b429dc-19e2-4dcb-a9ab-ed2e8e2270c2';
export const BD_TEAM_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '998c5eb2-372f-4375-938e-349802280074';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;

const CHART_COLUMN = 0;
const CHART_WIDTH = 5;
const TABLE_COLUMN = 5;
const TABLE_WIDTH = 7;

// Every chart puts the person on the X axis: grouping on the owner relation
// counts per workspace member, with no per-person view to maintain.
const PER_PERSON = {
  ...BAR_CHART_DEFAULTS,
  primaryAxisOrderBy: 'FIELD_ASC',
} as const;

const STACKED_BY_SELECT = {
  secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
  groupMode: 'STACKED',
  displayLegend: true,
} as const;

export default definePageLayoutTab({
  universalIdentifier: BD_TEAM_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Team',
  position: 1,
  icon: 'IconUsers',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: BD_TEAM_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'bdTeam',
    }),
    ...belowGuidance([
      {
        universalIdentifier: '453560b0-a35e-4586-99f4-f74c27dceb51',
        title: 'Open work packages per owner, by status',
        type: 'GRAPH',
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(0, CHART_COLUMN, 6, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamOpenWorkPackagesView),
          ...PER_PERSON,
          ...STACKED_BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: '23458ad3-e7c5-448f-9160-95823d6932e5',
        title: 'Open work packages',
        view: teamOpenWorkPackagesView,
        position: gridPosition(0, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '978314b5-ca11-4173-a944-757c1b20bda3',
        title: 'Overdue per owner',
        type: 'GRAPH',
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(6, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamOverdueWorkPackagesView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: '0a5b7915-73a7-41d8-9c8a-c7d8dd50cbc5',
        title: 'Overdue work packages',
        view: teamOverdueWorkPackagesView,
        position: gridPosition(6, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'a8da0be6-e4b9-4394-af02-6940ee3365bb',
        title: 'Blocked per owner',
        type: 'GRAPH',
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(11, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamBlockedWorkPackagesView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: 'aaf44b80-27b3-484e-a18a-70fed5259dd5',
        title: 'Blocked work packages',
        view: teamBlockedWorkPackagesView,
        position: gridPosition(11, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '2aa510d7-e192-49ce-a518-14a682da556c',
        title: 'Offered, not accepted, per owner',
        type: 'GRAPH',
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(16, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamOfferedWorkPackagesView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: '4127427b-6df2-4134-b9f6-371545e1cb47',
        title: 'Offered, not accepted',
        view: teamOfferedWorkPackagesView,
        position: gridPosition(16, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '31f141c9-4464-4443-a271-4a31f5400707',
        title: 'Submitted, awaiting review, per reviewer',
        type: 'GRAPH',
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        position: gridPosition(21, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamSubmittedForReviewView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: 'bab120a8-ee31-4ac1-8d53-c9e9e4c46160',
        title: 'Submitted, awaiting review',
        view: teamSubmittedForReviewView,
        position: gridPosition(21, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'e2a83244-9a1f-4c07-9f1a-c113b5c31233',
        title: 'Open opportunities per owner, by stage',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(26, CHART_COLUMN, 6, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.owner.universalIdentifier,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.stage.universalIdentifier,
          filter: chartFilterFromView(teamOpenOpportunitiesView),
          ...PER_PERSON,
          ...STACKED_BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: 'ed706cf8-71f4-4767-be21-b5eee7562ea9',
        title: 'Open opportunities',
        view: teamOpenOpportunitiesView,
        position: gridPosition(26, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '697dac51-5f9c-40c2-afb4-12df8566e8fe',
        title: 'No next action per owner',
        type: 'GRAPH',
        objectUniversalIdentifier: opportunity.universalIdentifier,
        position: gridPosition(32, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: opportunity.fields.owner.universalIdentifier,
          filter: chartFilterFromView(teamOpportunitiesWithoutNextActionView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: '15b7ec24-e923-4cbb-9fe8-d0567f94c544',
        title: 'Opportunities without next action',
        view: teamOpportunitiesWithoutNextActionView,
        position: gridPosition(32, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
      {
        universalIdentifier: '4679022b-9f57-4bb3-9533-ca2d5feef0a3',
        title: 'Engagements this month per owner, by kind',
        type: 'GRAPH',
        objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(37, CHART_COLUMN, 6, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamEngagementsThisMonthView),
          ...PER_PERSON,
          ...STACKED_BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: '0d84d36b-11fa-40de-a257-25efa1fd6a96',
        title: 'Engagements this month',
        view: teamEngagementsThisMonthView,
        position: gridPosition(37, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      {
        universalIdentifier: 'c6d148a6-1e96-4a87-ae5d-25a734e8a831',
        title: 'Active projects per owner, by health',
        type: 'GRAPH',
        objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(43, CHART_COLUMN, 6, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamActiveProjectsView),
          ...PER_PERSON,
          ...STACKED_BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: 'cdd55ec7-c2fb-41ae-885b-fd0af80ccd96',
        title: 'Active projects',
        view: teamActiveProjectsView,
        position: gridPosition(43, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      // The Monday standup moves cards on this board, so its cells are editable.
      recordTableWidget({
        universalIdentifier: 'f2ff97a9-ea03-437c-8a21-fe57e671570b',
        title: 'Open work packages by status',
        view: teamWorkPackageBoardView,
        position: gridPosition(49, 0, 14, 12),
        isUIEditable: true,
      }),
      {
        universalIdentifier: '0b39de01-036d-41b6-ab02-61229531eb6c',
        title: 'Open leads per owner, by status',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(63, CHART_COLUMN, 6, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
          secondaryAxisGroupByFieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          filter: chartFilterFromView(teamOpenLeadsView),
          ...PER_PERSON,
          ...STACKED_BY_SELECT,
        },
      },
      recordTableWidget({
        universalIdentifier: '71959d68-7a6d-4068-b949-7f3cdd1411d3',
        title: 'Open leads',
        view: teamOpenLeadsView,
        position: gridPosition(63, TABLE_COLUMN, 6, TABLE_WIDTH),
      }),
      // One line per referral credit (L6): a lead whose opportunity reached
      // Signed, counted for the colleague who referred or logged it.
      {
        universalIdentifier: '352c8451-ee07-4b9d-85a9-50b54331f0fb',
        title: 'Leads by referrer',
        type: 'GRAPH',
        objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
        position: gridPosition(69, CHART_COLUMN, 5, CHART_WIDTH),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
          description: 'Referred leads whose opportunity reached Signed, per colleague',
          filter: chartFilterFromView(teamReferralCreditsView),
          ...PER_PERSON,
        },
      },
      recordTableWidget({
        universalIdentifier: '0bc11ad7-b7c7-47cf-8b27-2a78c26402ad',
        title: 'Referral credits',
        view: teamReferralCreditsView,
        position: gridPosition(69, TABLE_COLUMN, 5, TABLE_WIDTH),
      }),
    ]),
  ],
});
