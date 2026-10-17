import {
  definePageLayoutWidget,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sharepoint-folder-on-opportunity.field';

export const OPPORTUNITY_SHAREPOINT_FOLDER_WIDGET_UNIVERSAL_IDENTIFIER = 'b0456eee-03e9-45fb-ab8a-0f60687bd82f';

// Documents live on SharePoint, so the link gets its own card under the native
// Fields widget, with Twenty's Point of Contact card; the Files tab is hidden in
// the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: OPPORTUNITY_SHAREPOINT_FOLDER_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home
      .universalIdentifier,
  title: 'SharePoint folder',
  type: 'FIELD',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'FIELD',
  },
});
