import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/home.page-layout';

export const HOME_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'edc6f0b7-9fd5-4194-bf0b-02a2749b8a3f';

export default defineNavigationMenuItem({
  universalIdentifier: HOME_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Home',
  icon: 'IconHome',
  position: SIDEBAR_POSITION.HOME,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
