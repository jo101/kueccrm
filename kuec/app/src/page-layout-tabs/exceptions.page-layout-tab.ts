import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/exceptions.page-layout';
import blockedWorkPackagesView from '../views/blocked-work-packages.view';
import opportunitiesWithoutNextActionView from '../views/opportunities-without-next-action.view';
import overdueWorkPackagesView from '../views/overdue-work-packages.view';
import { gridPosition, recordTableWidget } from './utils/dashboard-widgets';

export const EXCEPTIONS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = 'e3bc0672-cc48-4b95-9414-2c1ae16b4680';

const FULL_WIDTH = 12;

// The ED fixes exceptions where they are listed, so these tables are editable;
// record permissions still decide who can change what.
export default definePageLayoutTab({
  universalIdentifier: EXCEPTIONS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Exceptions',
  position: 0,
  icon: 'IconAlertTriangle',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    recordTableWidget({
      universalIdentifier: 'a403f564-08a5-4f80-98f8-234f55da23e5',
      title: 'Blocked',
      view: blockedWorkPackagesView,
      position: gridPosition(0, 0, 6, FULL_WIDTH),
      isUIEditable: true,
    }),
    recordTableWidget({
      universalIdentifier: '86b95e53-0957-4d86-900b-bf1019020ac3',
      title: 'Overdue',
      view: overdueWorkPackagesView,
      position: gridPosition(6, 0, 6, FULL_WIDTH),
      isUIEditable: true,
    }),
    recordTableWidget({
      universalIdentifier: '89f38ece-dd4d-4e69-af67-b40dc5423e59',
      title: 'No next action',
      view: opportunitiesWithoutNextActionView,
      position: gridPosition(12, 0, 6, FULL_WIDTH),
      isUIEditable: true,
    }),
  ],
});
