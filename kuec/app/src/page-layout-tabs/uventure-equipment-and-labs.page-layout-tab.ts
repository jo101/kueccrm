import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { UVENTURE_PAGE_URL } from '../constants/uventure';
import { UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/uventure.page-layout';
import {
  belowGuidance,
  gridPosition,
  guidanceTabWidget,
} from './utils/dashboard-widgets';

export const UVENTURE_EQUIPMENT_AND_LABS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '20d7ad34-3d3c-408c-9ae6-40d2d80044a9';
export const UVENTURE_EQUIPMENT_AND_LABS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '6beeda11-f67f-41b2-aa0b-f126d9edbf5b';

export default definePageLayoutTab({
  universalIdentifier: UVENTURE_EQUIPMENT_AND_LABS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Equipment and labs',
  position: 1,
  icon: 'IconMicroscope',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: UVENTURE_EQUIPMENT_AND_LABS_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'uventureEquipment',
    }),
    ...belowGuidance([
      {
        universalIdentifier: '95edb262-7ba7-45b4-806f-c00ebff49646',
        title: 'uVENTURE: equipment and labs',
        type: 'IFRAME',
        position: gridPosition(0, 0, 18, 12),
        configuration: {
          configurationType: 'IFRAME',
          url: UVENTURE_PAGE_URL.EQUIPMENT_AND_LABS,
        },
      },
    ]),
  ],
});
