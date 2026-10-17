import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { SIDEBAR_POSITION } from '../constants/sidebar-positions';
import { DOCUMENTS_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER } from '../views/documents-by-type.view';

export const DOCUMENTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'fb7bc1ed-09ee-4824-8e84-99df684af1ed';

export default defineNavigationMenuItem({
  universalIdentifier: DOCUMENTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Documents',
  icon: 'IconFileText',
  position: SIDEBAR_POSITION.DOCUMENTS,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: DOCUMENTS_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER,
});
