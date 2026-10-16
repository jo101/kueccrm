import { definePageLayout } from 'twenty-sdk/define';

export const EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = 'b63c4464-64f9-47f5-bfa5-d8d59cf1e1e4';

// Same constraint as Home: a sidebar item can only open a standalone page.
export default definePageLayout({
  universalIdentifier: EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Exceptions',
  type: 'STANDALONE_PAGE',
});
