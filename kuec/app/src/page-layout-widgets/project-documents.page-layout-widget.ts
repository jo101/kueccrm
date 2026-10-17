import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-project.field';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';

export const PROJECT_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = '859e4d97-9fed-4fff-8b97-9076b80f2751';

const PROJECT_HOME_TAB_UNIVERSAL_IDENTIFIER =
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
    }),
    title: 'Home',
  });

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: PROJECT_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: PROJECT_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
