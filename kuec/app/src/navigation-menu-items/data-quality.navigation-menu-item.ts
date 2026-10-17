import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/data-quality.page-layout';

export const DATA_QUALITY_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '080bc15a-b518-4e1a-ba91-b4bd4547e42c';

export default defineNavigationMenuItem({
  universalIdentifier: DATA_QUALITY_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Data quality',
  icon: 'IconChecklist',
  position: SIDEBAR_POSITION.DATA_QUALITY,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
