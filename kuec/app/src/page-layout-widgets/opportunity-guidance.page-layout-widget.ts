import {
  definePageLayoutWidget,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';

export const OPPORTUNITY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '7bbf6d7a-e030-4e48-ad7a-767e1845ed8c';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: OPPORTUNITY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'opportunity',
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
    pageLayoutTabUniversalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home
        .universalIdentifier,
  }),
);
