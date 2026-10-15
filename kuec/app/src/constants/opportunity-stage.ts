// The standard opportunity stage field is not owned by this app; these options
// are added in Settings per config/dashboards/opportunity-stages.md.
export const OPPORTUNITY_STAGE = {
  SIGNED: 'SIGNED',
  LOST: 'LOST',
  PARKED: 'PARKED',
} as const;

export const CLOSED_OPPORTUNITY_STAGES: string[] = [
  OPPORTUNITY_STAGE.SIGNED,
  OPPORTUNITY_STAGE.LOST,
  OPPORTUNITY_STAGE.PARKED,
];
