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

export const UVENTURE_TECHNOLOGIES_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '26389e4f-08d3-42be-b44b-a45d4dd4e88c';
export const UVENTURE_TECHNOLOGIES_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'dbd6411e-bd88-4d8e-bb1a-bd084acfcf97';

export default definePageLayoutTab({
  universalIdentifier: UVENTURE_TECHNOLOGIES_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Technologies',
  position: 0,
  icon: 'IconFlask',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: UVENTURE_TECHNOLOGIES_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'uventureTechnologies',
    }),
    ...belowGuidance([
      {
        universalIdentifier: 'eff47441-919a-4ee0-a6f0-2845dc414d0d',
        title: 'uVENTURE: technologies',
        type: 'IFRAME',
        position: gridPosition(0, 0, 18, 12),
        configuration: {
          configurationType: 'IFRAME',
          url: UVENTURE_PAGE_URL.TECHNOLOGIES,
        },
      },
    ]),
  ],
});
