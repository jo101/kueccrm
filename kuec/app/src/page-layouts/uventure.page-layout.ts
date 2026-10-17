import { definePageLayout } from 'twenty-sdk/define';

export const UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = 'fad24ade-d547-4ff5-b7c6-aea50d3b6d20';

// uVENTURE pages embedded through iFrame widgets, one tab each; uVENTURE allows
// the CRM's origin to frame them (runbooks/21-uventure-readiness.md section 1.5).
export default definePageLayout({
  universalIdentifier: UVENTURE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'uVENTURE',
  type: 'STANDALONE_PAGE',
});
