import { definePageLayoutWidget } from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const LEAD_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'c02ed4dd-59fa-4664-a131-329962cef8b0';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: LEAD_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'lead',
    objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(LEAD_UNIVERSAL_IDENTIFIER),
  }),
);
