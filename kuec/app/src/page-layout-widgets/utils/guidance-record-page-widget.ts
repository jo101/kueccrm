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

// Twenty 2.48 rejects a negative index, so the guidance shares index 0 with
// Twenty's Fields widget on every Home tab; the front's sort is stable, so
// which of the two comes first follows the order the server returns them in.
export const GUIDANCE_WIDGET_INDEX = 0;

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
