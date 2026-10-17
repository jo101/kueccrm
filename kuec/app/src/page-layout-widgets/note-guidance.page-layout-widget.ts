import {
  definePageLayoutWidget,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';

export const NOTE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'c2681c9c-b5d9-4d6d-b92d-ff15971db59b';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: NOTE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'note',
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note.universalIdentifier,
    pageLayoutTabUniversalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.home
        .universalIdentifier,
  }),
);
