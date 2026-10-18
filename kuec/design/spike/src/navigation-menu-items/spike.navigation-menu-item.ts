import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { SPIKE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/spike.page-layout';

export const SPIKE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '4c7e2a9b-6d1f-4e8c-b5a3-9f0d7c2e1b86';

export default defineNavigationMenuItem({
  universalIdentifier: SPIKE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Mantine spike',
  icon: 'IconFlask',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: SPIKE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
