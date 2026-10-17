import {
  definePageLayoutWidget,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { guidanceRecordPageWidget } from './utils/guidance-record-page-widget';

export const TASK_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '7fa4323c-4207-4257-a353-111d2c414c2e';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: TASK_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'task',
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
    pageLayoutTabUniversalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.home
        .universalIdentifier,
  }),
);
