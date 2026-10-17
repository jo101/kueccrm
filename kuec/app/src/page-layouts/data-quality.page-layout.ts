import { definePageLayout } from 'twenty-sdk/define';

export const DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = '636f90a5-26d1-4c68-b8ca-e8eeaa813e5b';

// Same constraint as BD and Home: an app cannot create a Dashboard record, and a
// sidebar item can only open a standalone page.
export default definePageLayout({
  universalIdentifier: DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Data quality',
  type: 'STANDALONE_PAGE',
});
