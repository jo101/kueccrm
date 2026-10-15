import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER } from '../views/project-portfolio.view';

export const PORTFOLIO_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'a2469366-38df-4a82-a57e-098e0d374169';

export default defineNavigationMenuItem({
  universalIdentifier: PORTFOLIO_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Portfolio',
  icon: 'IconBriefcase',
  position: 2,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER,
});
