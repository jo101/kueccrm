import { definePageLayoutWidget } from 'twenty-sdk/define';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';
import { WORK_PACKAGE_HOME_TAB_UNIVERSAL_IDENTIFIER } from './work-package-card.page-layout-widget';

export const WORK_PACKAGE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = 'a54622cf-3b2a-4f0d-b2d3-93a2bdd3eadf';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: WORK_PACKAGE_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'workPackage',
    objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier: WORK_PACKAGE_HOME_TAB_UNIVERSAL_IDENTIFIER,
  }),
);
