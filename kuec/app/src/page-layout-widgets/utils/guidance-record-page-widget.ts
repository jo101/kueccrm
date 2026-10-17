import {
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
  type StandalonePageLayoutWidgetManifest,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../../application.config';
import {
  buildGuidanceBody,
  GUIDANCE_WIDGET_TITLE,
} from '../../i18n/guidance-widget-body';

// Twenty's Fields widget holds index 0 on every Home tab, and the guidance
// opens the tab, so it sorts before it.
export const GUIDANCE_WIDGET_INDEX = -1;

export const getAppObjectHomeTabUniversalIdentifier = (
  objectUniversalIdentifier: string,
): string =>
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier,
    }),
    title: 'Home',
  });

export const guidanceRecordPageWidget = ({
  universalIdentifier,
  guidancePageKey,
  objectUniversalIdentifier,
  pageLayoutTabUniversalIdentifier,
}: {
  universalIdentifier: string;
  guidancePageKey: string;
  objectUniversalIdentifier: string;
  pageLayoutTabUniversalIdentifier: string;
}): StandalonePageLayoutWidgetManifest => ({
  universalIdentifier,
  pageLayoutTabUniversalIdentifier,
  title: GUIDANCE_WIDGET_TITLE.RECORD_PAGE,
  type: 'STANDALONE_RICH_TEXT',
  objectUniversalIdentifier,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: GUIDANCE_WIDGET_INDEX,
    heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.FIT_CONTENT,
  },
  configuration: {
    configurationType: 'STANDALONE_RICH_TEXT',
    body: buildGuidanceBody(guidancePageKey),
  },
});
