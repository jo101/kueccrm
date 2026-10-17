import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-lead.field';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';

export const LEAD_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = '0dbceea8-3137-40ac-be54-61409523a7dc';

const LEAD_HOME_TAB_UNIVERSAL_IDENTIFIER =
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
    }),
    title: 'Home',
  });

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: LEAD_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: LEAD_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
