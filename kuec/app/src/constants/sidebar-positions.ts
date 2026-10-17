// Twenty seeds its own sidebar entries at positions 0 to 6 and orders the
// Workspace section by position alone, so every app entry sits below 0 to keep
// this order whatever standard entries remain. The first entry is everyone's
// landing page. The BD Team link is added in the UI and placed between
// BD_EXECUTIVE and PROJECTS (config/dashboards/sidebar.md).
export const SIDEBAR_POSITION = {
  HOME: -20,
  EXCEPTIONS: -19,
  PIPELINE: -18,
  MY_WORK: -17,
  BD_EXECUTIVE: -16,
  PROJECTS: -15,
  COMPANIES: -14,
  PEOPLE: -13,
  ENGAGEMENTS: -12,
  CONTRACTS: -11,
  MILESTONES: -10,
} as const;
