import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { PIPELINE_VIEW_UNIVERSAL_IDENTIFIER } from '../views/pipeline.view';

export const PIPELINE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'af4f63ab-c60b-4127-ae25-e653522310d8';

export default defineNavigationMenuItem({
  universalIdentifier: PIPELINE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline',
  icon: 'IconLayoutKanban',
  position: 1,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
});
