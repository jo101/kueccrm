import { definePageLayoutWidget } from 'twenty-sdk/define';
import { CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER } from '../objects/campaign-target.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const CAMPAIGN_TARGET_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'e606f075-6573-407a-b26a-822521355c58';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: CAMPAIGN_TARGET_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'campaignTarget',
    objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER),
  }),
);
