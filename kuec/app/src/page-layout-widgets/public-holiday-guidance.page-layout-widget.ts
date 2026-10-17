import { definePageLayoutWidget } from 'twenty-sdk/define';
import { PUBLIC_HOLIDAY_UNIVERSAL_IDENTIFIER } from '../objects/public-holiday.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const PUBLIC_HOLIDAY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '9758e020-5fce-4451-8c0d-69f6e67f0b8d';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: PUBLIC_HOLIDAY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'publicHoliday',
    objectUniversalIdentifier: PUBLIC_HOLIDAY_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(PUBLIC_HOLIDAY_UNIVERSAL_IDENTIFIER),
  }),
);
