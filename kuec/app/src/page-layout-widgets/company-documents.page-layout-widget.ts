import {
  definePageLayoutWidget,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-company.field';

export const COMPANY_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = '320d7bfb-8c53-4568-8639-7921731b5d92';

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: COMPANY_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage.tabs.home
      .universalIdentifier,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 3,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
