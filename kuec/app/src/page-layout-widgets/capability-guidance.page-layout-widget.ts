import { definePageLayoutWidget } from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const CAPABILITY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'fe6d7cc4-fe29-4c61-ab83-3b82e67b6047';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: CAPABILITY_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'capability',
    objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(CAPABILITY_UNIVERSAL_IDENTIFIER),
  }),
);
