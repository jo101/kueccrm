import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { EXPIRING_CONTRACTS_VIEW_UNIVERSAL_IDENTIFIER } from '../views/expiring-contracts.view';

export const CONTRACTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '0efc4a48-2a08-40c8-b57f-bc7a0797d3b9';

export default defineNavigationMenuItem({
  universalIdentifier: CONTRACTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Contracts',
  icon: 'IconFileCertificate',
  position: SIDEBAR_POSITION.CONTRACTS,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: EXPIRING_CONTRACTS_VIEW_UNIVERSAL_IDENTIFIER,
});
