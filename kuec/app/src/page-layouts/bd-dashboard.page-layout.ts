import { definePageLayout } from 'twenty-sdk/define';

export const BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = '5ebd9d71-c38b-470d-a1e8-1ebc226734cf';

// An app cannot create a Dashboard record, so the BD dashboard is a standalone
// page opened from the sidebar. Its tabs are in src/page-layout-tabs.
export default definePageLayout({
  universalIdentifier: BD_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'BD',
  type: 'STANDALONE_PAGE',
});
