import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';

export const COMPANIES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '7b2a23d9-ab7d-4912-8105-16081bd75679';

// Replaces Twenty's own Companies entry, which is removed in the UI so the
// app controls the order (config/dashboards/sidebar.md).
export default defineNavigationMenuItem({
  universalIdentifier: COMPANIES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Companies',
  icon: 'IconBuildingSkyscraper',
  position: SIDEBAR_POSITION.COMPANIES,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
});
