import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/documents-on-contract.field';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';

export const CONTRACT_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER = 'e8067e22-17fb-4673-9330-4ba95139f4fe';

const CONTRACT_HOME_TAB_UNIVERSAL_IDENTIFIER =
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
    }),
    title: 'Home',
  });

// A document is a link with its metadata (kuec/CLAUDE.md section 4), so the
// record page lists the record's documents in their own card. Uploads stay
// off: the Files tab is hidden in the UI (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: CONTRACT_DOCUMENTS_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: CONTRACT_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'Documents',
  type: 'FIELD',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 2,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'CARD',
  },
});
