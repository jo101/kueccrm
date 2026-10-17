import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';

export const PEOPLE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '9bff8c2b-c427-411c-aa3c-2cdff60a0b5f';

// Replaces Twenty's own People entry, which is removed in the UI so the app
// controls the order (config/dashboards/sidebar.md).
export default defineNavigationMenuItem({
  universalIdentifier: PEOPLE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'People',
  icon: 'IconUser',
  position: SIDEBAR_POSITION.PEOPLE,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
});
