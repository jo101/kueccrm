import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER } from '../views/project-portfolio.view';

export const PORTFOLIO_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'a2469366-38df-4a82-a57e-098e0d374169';

export default defineNavigationMenuItem({
  universalIdentifier: PORTFOLIO_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Projects',
  icon: 'IconBriefcase',
  position: SIDEBAR_POSITION.PROJECTS,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER,
});
