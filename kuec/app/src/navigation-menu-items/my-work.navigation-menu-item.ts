import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { MY_WORK_VIEW_UNIVERSAL_IDENTIFIER } from '../views/my-work.view';

export const MY_WORK_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'b9870b3b-4a2e-45be-aca2-8590cee6af87';

export default defineNavigationMenuItem({
  universalIdentifier: MY_WORK_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'My work',
  icon: 'IconUserCheck',
  position: 0,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: MY_WORK_VIEW_UNIVERSAL_IDENTIFIER,
});
