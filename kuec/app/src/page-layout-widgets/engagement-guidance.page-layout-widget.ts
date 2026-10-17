import { definePageLayoutWidget } from 'twenty-sdk/define';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const ENGAGEMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '498a562c-1320-4a97-8314-d23bb8114a9e';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: ENGAGEMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'engagement',
    objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(ENGAGEMENT_UNIVERSAL_IDENTIFIER),
  }),
);
