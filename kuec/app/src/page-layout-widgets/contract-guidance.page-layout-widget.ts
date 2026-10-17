import { definePageLayoutWidget } from 'twenty-sdk/define';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const CONTRACT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '404a081d-f4f5-4369-aae6-2ac28e4ac462';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: CONTRACT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'contract',
    objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(CONTRACT_UNIVERSAL_IDENTIFIER),
  }),
);
