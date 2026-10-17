import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/exceptions.page-layout';

export const EXCEPTIONS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '170b0fb0-67e9-4b38-b289-075180052ebc';

export default defineNavigationMenuItem({
  universalIdentifier: EXCEPTIONS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Exceptions',
  icon: 'IconAlertTriangle',
  position: SIDEBAR_POSITION.EXCEPTIONS,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
