import {
  definePageLayoutWidget,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-opportunity.field';

export const OPPORTUNITY_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = '3cba565d-f953-4cd0-875c-4806cda6b162';

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: OPPORTUNITY_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home
      .universalIdentifier,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 4,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
