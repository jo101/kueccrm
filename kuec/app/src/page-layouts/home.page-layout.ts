import { definePageLayout } from 'twenty-sdk/define';

export const HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = '94ef9691-04da-40ac-a589-87d911a31449';

// A navigation menu item can only open a standalone page (an app cannot create
// a Dashboard record), so Home is a standalone page laid out as a dashboard grid.
export default definePageLayout({
  universalIdentifier: HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Home',
  type: 'STANDALONE_PAGE',
});
