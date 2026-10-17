import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/uventure.page-layout';

export const UVENTURE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'fcbb03c6-53c2-47a0-b43d-d7dd8e04efb7';

// uVENTURE's own pages inside the CRM, so the two feel like one product.
export default defineNavigationMenuItem({
  universalIdentifier: UVENTURE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'uVENTURE',
  icon: 'IconFrame',
  position: SIDEBAR_POSITION.UVENTURE,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
