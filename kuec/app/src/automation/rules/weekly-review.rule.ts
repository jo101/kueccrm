import { isDefined } from 'twenty-sdk/utils';

import { PROJECT_STATUS } from 'src/objects/project.object';

export type ReviewProject = {
  id: string;
  name: string | null;
  status: string;
  health: string | null;
  ownerId: string | null;
};

export type WeeklyReview = {
  ownerId: string;
  projects: ReviewProject[];
};

// One review per project owner, listing every active project they own, worst
// health first so the review starts where it matters (PM pack, kuec/playbooks/pm-pack.md).
const HEALTH_ORDER = ['RED', 'AMBER', 'GREEN'];

export const planWeeklyReviews = (projects: ReviewProject[]): WeeklyReview[] => {
  const byOwner = new Map<string, ReviewProject[]>();

  for (const project of projects) {
    if (project.status !== PROJECT_STATUS.ACTIVE || !isDefined(project.ownerId)) {
      continue;
    }

    byOwner.set(project.ownerId, [...(byOwner.get(project.ownerId) ?? []), project]);
  }

  return [...byOwner.entries()]
    .map(([ownerId, owned]) => ({
      ownerId,
      projects: [...owned].sort(
        (left, right) =>
          HEALTH_ORDER.indexOf(left.health ?? 'GREEN') - HEALTH_ORDER.indexOf(right.health ?? 'GREEN') ||
          (left.name ?? '').localeCompare(right.name ?? ''),
      ),
    }))
    .sort((left, right) => left.ownerId.localeCompare(right.ownerId));
};

// The Monday of the Asia/Dubai week a date falls in, as the review's key.
export const reviewWeekOf = (dubaiDate: string): string => {
  const date = new Date(`${dubaiDate}T00:00:00.000Z`);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;

  return new Date(date.getTime() - daysSinceMonday * 86_400_000).toISOString().slice(0, 10);
};
