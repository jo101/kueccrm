import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/home.page-layout';
import myWorkDueWithin7DaysView from '../views/home/home-my-work-due-within-7-days.view';
import needsYourDecisionView from '../views/home/home-needs-your-decision.view';
import otherWorkByStatusView from '../views/home/home-other-work-by-status.view';
import {
  belowGuidance,
  gridPosition,
  guidanceTabWidget,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const HOME_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = 'd07ce75f-1707-4615-a1c1-931f011026a4';
export const HOME_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'bc9615f6-7fe3-40f9-b2cc-680991b9a709';
export const HOME_NEEDS_YOUR_DECISION_WIDGET_UNIVERSAL_IDENTIFIER = '3faf030f-e363-4e8c-aab9-5fc39cae6cbd';
export const HOME_YOUR_NEXT_ACTIONS_WIDGET_UNIVERSAL_IDENTIFIER = '1cea1379-f428-451a-9918-159653a88186';
export const HOME_OTHER_WORK_WIDGET_UNIVERSAL_IDENTIFIER = 'd71e5146-3d6b-4577-8756-fb96590d98d9';

const FULL_WIDTH = 12;

export default definePageLayoutTab({
  universalIdentifier: HOME_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Home',
  position: 0,
  icon: 'IconHome',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: HOME_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'home',
    }),
    ...belowGuidance([
      recordTableWidget({
        universalIdentifier: HOME_NEEDS_YOUR_DECISION_WIDGET_UNIVERSAL_IDENTIFIER,
        title: 'Needs your decision',
        view: needsYourDecisionView,
        position: gridPosition(0, 0, 6, FULL_WIDTH),
      }),
      recordTableWidget({
        universalIdentifier: HOME_YOUR_NEXT_ACTIONS_WIDGET_UNIVERSAL_IDENTIFIER,
        title: 'Your next actions',
        view: myWorkDueWithin7DaysView,
        position: gridPosition(6, 0, 6, FULL_WIDTH),
      }),
      recordTableWidget({
        universalIdentifier: HOME_OTHER_WORK_WIDGET_UNIVERSAL_IDENTIFIER,
        title: 'Other work is progressing',
        view: otherWorkByStatusView,
        position: gridPosition(12, 0, 8, FULL_WIDTH),
      }),
    ]),
  ],
});
