import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type MilestoneRecord,
  type ProjectRecord,
} from 'src/automation/records/record-types';
import {
  areAllMilestonesDone,
  computeDailyHealth,
} from 'src/automation/rules/project-health.rule';
import { PROJECT_STATUS } from 'src/objects/project.object';

export const W10_PROJECT_HEALTH_DAILY_UNIVERSAL_IDENTIFIER = '99429b5a-df45-4586-8d59-af16d966129d';

const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [projects, milestones] = await Promise.all([
    listRecords<ProjectRecord>(
      api.asApplication,
      OBJECT_NAMES.project,
      `status[eq]:${PROJECT_STATUS.ACTIVE}`,
    ),
    listRecords<MilestoneRecord>(
      api.asApplication,
      OBJECT_NAMES.milestone,
      'projectId[is]:NOT_NULL',
    ),
  ]);
  const changed: string[] = [];
  const closeTasks: string[] = [];

  for (const project of projects) {
    const projectMilestones = milestones.filter(
      ({ projectId }) => projectId === project.id,
    );
    const health = computeDailyHealth({
      currentHealth: project.health,
      milestones: projectMilestones,
      now,
    });

    if (health !== project.health) {
      await updateRecord(api.asApplication, OBJECT_NAMES.project, project.id, {
        health,
      });
      changed.push(`${project.id}:${health}`);
    }

    if (areAllMilestonesDone(projectMilestones) && !isDefined(project.closeTaskCreatedAt)) {
      const target = {
        objectNameSingular: OBJECT_NAMES.project.singular,
        recordId: project.id,
      };

      await notifyMembers({
        api,
        memberIds: [project.ownerId],
        message: NOTIFICATION_MESSAGES.closeProject({
          subject: project.name ?? '',
          link: recordLinkFor(target),
        }),
        taskTitle: `Close the project: ${project.name ?? ''}`,
        target,
        dedupeKey: `close-project:${project.id}`,
        now,
      });
      await updateRecord(api.asApplication, OBJECT_NAMES.project, project.id, {
        closeTaskCreatedAt: now.toISOString(),
      });
      closeTasks.push(project.id);
    }
  }

  console.log(
    `w10 daily: ${projects.length} active projects, health changed ${changed.length}, close tasks ${closeTasks.length}`,
  );

  return { healthChanged: changed, closeTasks };
};

export default defineLogicFunction({
  universalIdentifier: W10_PROJECT_HEALTH_DAILY_UNIVERSAL_IDENTIFIER,
  name: 'w10-project-health-daily',
  description:
    'W10 daily: an open milestone due within 7 days turns the project Amber unless Red; all milestones done asks the owner to close it',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // 08:00 Asia/Dubai
    pattern: '0 4 * * *',
  },
});
