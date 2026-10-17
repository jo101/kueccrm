import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER } from '../views/lead-inbox.view';

export const LEADS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'a2dea0e3-0d6a-4929-89ce-61e51bb64af8';

export default defineNavigationMenuItem({
  universalIdentifier: LEADS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Leads',
  icon: 'IconUserSearch',
  position: SIDEBAR_POSITION.LEADS,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER,
});
