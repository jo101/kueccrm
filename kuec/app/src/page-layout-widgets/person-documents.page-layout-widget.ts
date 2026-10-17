import {
  definePageLayoutWidget,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-person.field';

export const PERSON_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = '29b3860a-e53f-40c0-96d7-32d8e86af24c';

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: PERSON_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home
      .universalIdentifier,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 4,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
