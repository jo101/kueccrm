import { definePageLayoutWidget } from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const DOCUMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'fb0719b2-5ef6-4986-9f31-86fd176abc7c';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: DOCUMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'document',
    objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(DOCUMENT_UNIVERSAL_IDENTIFIER),
  }),
);
