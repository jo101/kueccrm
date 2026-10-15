import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/bd-dashboard.page-layout';

export const BD_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '1170dfb2-814a-4860-870b-9f1cf881aa54';

export default defineNavigationMenuItem({
  universalIdentifier: BD_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'BD',
  icon: 'IconLayoutDashboard',
  position: 6,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
