import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import {
  createTwentyApi,
  listRecords,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type MilestoneRecord } from 'src/automation/records/record-types';
import {
  computePercentComplete,
  hasMissedMilestone,
} from 'src/automation/rules/project-health.rule';
import { MILESTONE_STATUS } from 'src/objects/milestone.object';
import { PROJECT_HEALTH } from 'src/objects/project.object';

export const W10_MILESTONE_STATUS_UNIVERSAL_IDENTIFIER = '4f55923e-dabc-45c6-a96d-cd4bb25f3790';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<MilestoneRecord>>,
) => {
  const { after } = event.properties;

  if (!isDefined(after.projectId)) {
    return { skipped: 'milestone has no project' };
  }

  const api = createTwentyApi();
  const milestones = await listRecords<MilestoneRecord>(
    api.asApplication,
    OBJECT_NAMES.milestone,
    `projectId[eq]:"${after.projectId}"`,
  );
  const percentComplete = computePercentComplete(milestones);

  await updateRecord(api.asApplication, OBJECT_NAMES.project, after.projectId, {
    percentComplete,
    ...(after.status === MILESTONE_STATUS.MISSED || hasMissedMilestone(milestones)
      ? { health: PROJECT_HEALTH.RED }
      : {}),
  });

  return { projectId: after.projectId, percentComplete };
};

export default defineLogicFunction({
  universalIdentifier: W10_MILESTONE_STATUS_UNIVERSAL_IDENTIFIER,
  name: 'w10-milestone-status',
  description:
    'W10: a Missed milestone turns its project Red; every status change recomputes percent complete as done over total',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'milestone.updated',
    updatedFields: ['status'],
  },
});
