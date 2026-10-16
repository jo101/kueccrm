import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../front-components/work-package-card.front-component';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';

export const WORK_PACKAGE_CARD_WIDGET_UNIVERSAL_IDENTIFIER = '7a3e93e3-a9a1-4146-984e-1990cb6962ce';

// Twenty generates the work package record page; the card joins its Home tab
// right after the native Fields widget, which keeps index 0.
export const WORK_PACKAGE_HOME_TAB_UNIVERSAL_IDENTIFIER =
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    }),
    title: 'Home',
  });

export default definePageLayoutWidget({
  universalIdentifier: WORK_PACKAGE_CARD_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: WORK_PACKAGE_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'Work package',
  type: 'FRONT_COMPONENT',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
    heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.FIT_CONTENT,
  },
  configuration: {
    configurationType: 'FRONT_COMPONENT',
    frontComponentUniversalIdentifier:
      WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  },
});
