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

export const UVENTURE_CHALLENGES_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '14fdc2b8-3ac9-4f8b-b2c8-2bd9ad15f704';
export const UVENTURE_CHALLENGES_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '9cfda5ea-bf0d-46b0-9473-e6d50f698f83';

export default definePageLayoutTab({
  universalIdentifier: UVENTURE_CHALLENGES_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Challenges',
  position: 2,
  icon: 'IconBulb',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    guidanceTabWidget({
      universalIdentifier: UVENTURE_CHALLENGES_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
      guidancePageKey: 'uventureChallenges',
    }),
    ...belowGuidance([
      {
        universalIdentifier: 'dfce42ac-5e84-4a90-a437-d3381ec4b137',
        title: 'uVENTURE: challenges',
        type: 'IFRAME',
        position: gridPosition(0, 0, 18, 12),
        configuration: {
          configurationType: 'IFRAME',
          url: UVENTURE_PAGE_URL.CHALLENGES,
        },
      },
    ]),
  ],
});
