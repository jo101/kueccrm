import {
  definePageLayoutWidget,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';

export const COMPANY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '56322f6f-ead1-4516-b9a6-263ff34c06cb';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: COMPANY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'company',
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
    pageLayoutTabUniversalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage.tabs.home
        .universalIdentifier,
  }),
);
