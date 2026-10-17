import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import {
  CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
} from '../objects/contract.object';

export const CONTRACT_SHAREPOINT_FOLDER_WIDGET_UNIVERSAL_IDENTIFIER = '434f23a1-8022-451f-911a-8360aaa666c7';

const CONTRACT_HOME_TAB_UNIVERSAL_IDENTIFIER =
  getSystemPageLayoutTabUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
    }),
    title: 'Home',
  });

// The executed contract lives on SharePoint, so the link gets its own card
// under the native Fields widget; the Files tab is hidden in the UI
// (config/dashboards/record-page-files-tab.md).
export default definePageLayoutWidget({
  universalIdentifier: CONTRACT_SHAREPOINT_FOLDER_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: CONTRACT_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'SharePoint folder',
  type: 'FIELD',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
  },
  configuration: {
    configurationType: 'FIELD',
    fieldMetadataId: CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER,
    fieldDisplayMode: 'FIELD',
  },
});
