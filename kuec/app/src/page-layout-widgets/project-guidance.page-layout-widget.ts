import { definePageLayoutWidget } from 'twenty-sdk/define';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const PROJECT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '2882cf30-015d-4080-932e-1e63d951bf3b';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: PROJECT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'project',
    objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(PROJECT_UNIVERSAL_IDENTIFIER),
  }),
);
