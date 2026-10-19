import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';

export const HELP_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '6303d542-2721-4d72-a7eb-134156ffc9df';

// A SharePoint page, so the guide can change without an app release; what it
// holds and who keeps it current: kuec/runbooks/20-guidance.md section 5.
export const HELP_PAGE_URL =
  'https://kuec.sharepoint.com/sites/BD/SitePages/CRM-Help.aspx';

export default defineNavigationMenuItem({
  universalIdentifier: HELP_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Help',
  icon: 'IconHelp',
  position: SIDEBAR_POSITION.HELP,
  type: NavigationMenuItemType.LINK,
  link: HELP_PAGE_URL,
});
