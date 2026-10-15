import { isDefined } from 'twenty-sdk/utils';

import {
  MILESTONE_STATUS,
  type MilestoneStatus,
} from 'src/objects/milestone.object';
import {
  PROJECT_HEALTH,
  type ProjectHealth,
} from 'src/objects/project.object';

export const AMBER_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type HealthMilestone = {
  status: MilestoneStatus;
  dueAt: string | null;
};

export const computePercentComplete = (milestones: HealthMilestone[]): number =>
  milestones.length === 0
    ? 0
    : Math.round(
        (milestones.filter(({ status }) => status === MILESTONE_STATUS.DONE)
          .length /
          milestones.length) *
          100,
      );

export const hasMissedMilestone = (milestones: HealthMilestone[]): boolean =>
  milestones.some(({ status }) => status === MILESTONE_STATUS.MISSED);

export const areAllMilestonesDone = (milestones: HealthMilestone[]): boolean =>
  milestones.length > 0 &&
  milestones.every(({ status }) => status === MILESTONE_STATUS.DONE);

// Red is only ever set by a missed milestone and is cleared by a person.
export const computeDailyHealth = ({
  currentHealth,
  milestones,
  now,
}: {
  currentHealth: ProjectHealth;
  milestones: HealthMilestone[];
  now: Date;
}): ProjectHealth => {
  if (currentHealth === PROJECT_HEALTH.RED) {
    return PROJECT_HEALTH.RED;
  }

  const hasOpenMilestoneDueSoon = milestones.some(
    ({ status, dueAt }) =>
      status === MILESTONE_STATUS.OPEN &&
      isDefined(dueAt) &&
      Date.parse(dueAt) - now.getTime() <= AMBER_WINDOW_MS,
  );

  return hasOpenMilestoneDueSoon ? PROJECT_HEALTH.AMBER : currentHealth;
};
