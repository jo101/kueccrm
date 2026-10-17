import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER } from '../views/engagements-this-month.view';

export const ENGAGEMENTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '35365fde-27e4-4376-b531-67969ec3f15b';

export default defineNavigationMenuItem({
  universalIdentifier: ENGAGEMENTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Engagements',
  icon: 'IconMessages',
  position: SIDEBAR_POSITION.ENGAGEMENTS,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER,
});
