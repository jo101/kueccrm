import { definePageLayoutWidget } from 'twenty-sdk/define';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const MILESTONE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'a089aa84-b1c8-42ba-b4bf-e9f387d9c8b0';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: MILESTONE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'milestone',
    objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(MILESTONE_UNIVERSAL_IDENTIFIER),
  }),
);
