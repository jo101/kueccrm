import { defineLogicFunction } from 'twenty-sdk/define';

import { CRM_BASE_URL_VARIABLE } from 'src/application.config';
import { createTwentyApi, listRecords } from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { buildRecordLink } from 'src/automation/notifications/compose-notification-message';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import { notifyMemberAboutSystem } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  planWeeklyReviews,
  type ReviewProject,
  reviewWeekOf,
} from 'src/automation/rules/weekly-review.rule';
import { PROJECT_STATUS } from 'src/objects/project.object';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const P02_WEEKLY_REVIEW_UNIVERSAL_IDENTIFIER = '9ea5605d-086a-4ba9-a5d6-81c3abc76e37';

// P2 (PM pack): every Monday, one Task per project owner listing their active
// projects, worst health first. A missed Monday is not repaired: next week's
// review replaces it.
const handler = async () => {
  if (!isPackEnabled(PACK.PM)) {
    return packStandDown(PACK.PM);
  }

  const api = createTwentyApi();
  const now = new Date();
  const week = reviewWeekOf(toDubaiDateString(now));
  const baseUrl = process.env[CRM_BASE_URL_VARIABLE] ?? '';
  const reviews = planWeeklyReviews(
    await listRecords<ReviewProject>(
      api.asApplication,
      OBJECT_NAMES.project,
      `status[eq]:${PROJECT_STATUS.ACTIVE}`,
    ),
  );

  for (const review of reviews) {
    const projectsLink = `${baseUrl.replace(/\/+$/, '')}/objects/projects`;

    await notifyMemberAboutSystem({
      api,
      memberId: review.ownerId,
      message: NOTIFICATION_MESSAGES.weeklyReview({
        subject: `${review.projects.length} active ${review.projects.length === 1 ? 'project' : 'projects'}`,
        link: projectsLink,
      }),
      details: review.projects
        .map(
          (project) =>
            `- ${project.name ?? project.id} (${project.health ?? 'no health'}): ${buildRecordLink(baseUrl, 'project', project.id)}`,
        )
        .join('\n'),
      taskTitle: `Weekly review, week of ${week}`,
      dedupeKey: `weekly-review:${review.ownerId}:${week}`,
      now,
    });
  }

  console.log(`p02 weekly review ${week}: ${reviews.length} owners`);

  return { week, owners: reviews.length };
};

export default defineLogicFunction({
  universalIdentifier: P02_WEEKLY_REVIEW_UNIVERSAL_IDENTIFIER,
  name: 'p02-weekly-review',
  description:
    'P2, PM pack: every Monday morning, a weekly review Task for each project owner listing their active projects, worst health first',
  timeoutSeconds: 120,
  handler,
  cronTriggerSettings: {
    // Monday 08:00 Asia/Dubai
    pattern: '0 4 * * 1',
  },
});
