import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import {
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';
import packProjectsActiveProjectsView from '../views/dashboard/pack-projects-active-projects.view';
import packProjectsBlockedWorkPackagesView from '../views/dashboard/pack-projects-blocked-work-packages.view';
import packProjectsOpenMilestonesView from '../views/dashboard/pack-projects-open-milestones.view';
import {
  BAR_CHART_DEFAULTS,
  belowGuidance,
  chartFilterFromView,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const PACK_PROJECTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = 'b09192c4-bb5b-4041-9748-fcf85f090da7';
export const PACK_PROJECTS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'ac043878-dac7-4175-a69d-27c72ae568ea';

// The PM pack's dashboard tab, the screen of the weekly review: project health,
// what is due, what is blocked (kuec/playbooks/pm-pack.md).
export default definePageLayoutTab({
  universalIdentifier: PACK_PROJECTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Project pack',
  position: 4,
  icon: 'IconBriefcase',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: PACK_PROJECTS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'packProjects',
    }),
    ...belowGuidance([
      {
        universalIdentifier: '7ea8b7da-0523-4306-983e-1f698ad3a8e5',
        title: 'Active projects by health',
        type: 'GRAPH',
        objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
        position: gridPosition(0, 0, 6, 5),
        configuration: {
          configurationType: 'BAR_CHART',
          aggregateFieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
          aggregateOperation: AggregateOperations.COUNT,
          primaryAxisGroupByFieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
          primaryAxisOrderBy: 'FIELD_POSITION_ASC',
          filter: chartFilterFromView(packProjectsActiveProjectsView),
          ...BAR_CHART_DEFAULTS,
        },
      },
      recordTableWidget({
        universalIdentifier: '85c3bcac-7dfa-41aa-ac0d-bc20672baa70',
        title: 'Active projects, nearest end date first',
        view: packProjectsActiveProjectsView,
        position: gridPosition(0, 5, 6, 7),
      }),
      recordTableWidget({
        universalIdentifier: 'bed8471a-93b8-4109-b652-0d54a53e2e20',
        title: 'Open and missed milestones',
        view: packProjectsOpenMilestonesView,
        position: gridPosition(6, 0, 5, 12),
      }),
      recordTableWidget({
        universalIdentifier: '0f47f3ac-59d0-4c53-8be9-fc85efdd3fed',
        title: 'Blocked work packages on projects',
        view: packProjectsBlockedWorkPackagesView,
        position: gridPosition(11, 0, 5, 12),
      }),
    ]),
  ],
});
