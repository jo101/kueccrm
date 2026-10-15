import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER } from '../views/open-milestones.view';

export const MILESTONES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'd3adf9a0-9e64-4812-8e5a-3e3fd586ae43';

export default defineNavigationMenuItem({
  universalIdentifier: MILESTONES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Milestones',
  icon: 'IconFlag',
  position: 3,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
});
