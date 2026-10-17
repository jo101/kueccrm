import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { UVENTURE_PAGE_URL } from '../constants/uventure';

export const OPEN_UVENTURE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '16ed9d24-ca7f-41a4-b090-a904b6f89fd2';

// For what the embedded pages do not cover, such as editing a technology.
export default defineNavigationMenuItem({
  universalIdentifier: OPEN_UVENTURE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Open uVENTURE',
  icon: 'IconPlug',
  position: SIDEBAR_POSITION.OPEN_UVENTURE,
  type: NavigationMenuItemType.LINK,
  link: UVENTURE_PAGE_URL.HOME,
});
