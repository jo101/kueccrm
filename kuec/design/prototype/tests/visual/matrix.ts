export type Variant = { locale: 'en' | 'ar'; scheme: 'light' | 'dark'; viewport: 'phone' | 'desktop' };

export const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1440, height: 1000 },
} as const;

// The eight variants every screen must pass (brief part 7).
export const VARIANTS: Variant[] = (['en', 'ar'] as const).flatMap((locale) =>
  (['light', 'dark'] as const).flatMap((scheme) => (['desktop', 'phone'] as const).map((viewport) => ({ locale, scheme, viewport }))),
);

export const variantName = (variant: Variant): string => `${variant.viewport === 'phone' ? '390' : '1440'}-${variant.locale === 'ar' ? 'rtl' : 'ltr'}-${variant.scheme}`;

export const variantQuery = (variant: Variant, extra: Record<string, string> = {}): string =>
  new URLSearchParams({ lang: variant.locale, scheme: variant.scheme, ...extra }).toString();

export type Screen = { id: string; path: string; query: Record<string, string>; description: string };

// The three screens that set the standard, as the persona the screen is for.
export const SCREENS: Screen[] = [
  { id: 'home-bd-officer', path: '/', query: { as: 'bd1' }, description: 'Home for a BD officer' },
  { id: 'home-ed', path: '/', query: { as: 'ed' }, description: 'Home for the ED: Decisions, Escalations, In progress' },
  { id: 'home-ops-coordinator', path: '/', query: { as: 'ops' }, description: 'Home for the operations coordinator' },
  { id: 'home-technical-contributor', path: '/', query: { as: 'eng2' }, description: 'Home for a technical contributor' },
  { id: 'task-assigned-owner', path: '/tasks/task-term-sheet', query: { as: 'bd1', from: 'notification' }, description: 'Task card, assigned to the viewer, from a notification' },
  { id: 'task-pending-review-reviewer', path: '/tasks/task-fatigue-quote', query: { as: 'bd1' }, description: 'Task card, pending review, viewer is the reviewer' },
  { id: 'task-blocked-ed', path: '/tasks/task-falcon-handover', query: { as: 'ed' }, description: 'Task card, blocked, viewer is the ED' },
  { id: 'opportunity-owner', path: '/opportunities/opp-marzouqi', query: { as: 'bd1' }, description: 'Opportunity record, owner, Next Step current' },
  { id: 'opportunity-no-next-step', path: '/opportunities/opp-dana-water', query: { as: 'bd1' }, description: 'Opportunity record, Next Step missing' },
  { id: 'opportunity-read-only', path: '/opportunities/opp-marzouqi', query: { as: 'eng1' }, description: 'Opportunity record, viewer is not the owner' },
];
