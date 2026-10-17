import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { CAPABILITIES_ALL_VIEW_UNIVERSAL_IDENTIFIER } from '../views/capabilities-all.view';

export const CAPABILITIES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'f0cacaf2-841d-4f1a-8fed-55cb5d103993';

export default defineNavigationMenuItem({
  universalIdentifier: CAPABILITIES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Capabilities',
  icon: 'IconFlask',
  position: SIDEBAR_POSITION.CAPABILITIES,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: CAPABILITIES_ALL_VIEW_UNIVERSAL_IDENTIFIER,
});
