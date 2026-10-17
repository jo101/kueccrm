import {
  definePageLayoutWidget,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';

export const PERSON_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '93b796d1-9ed5-4363-a9a2-0f1ef6de6861';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: PERSON_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'person',
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
    pageLayoutTabUniversalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home
        .universalIdentifier,
  }),
);
