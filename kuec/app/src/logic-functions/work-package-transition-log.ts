import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { withFailureLog } from 'src/automation/api/log-handler-failure';
import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import {
  isWorkPackageTransition,
  publishWorkPackageTransition,
} from 'src/automation/timeline/publish-work-package-transition';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

export const WORK_PACKAGE_TRANSITION_LOG_UNIVERSAL_IDENTIFIER = 'b84fcf3c-3c4e-4327-b73e-a172e3cc2183';

// offeredAt and completedAt belong to W2 and W6, which act on those transitions.
const STAMP_FIELD_BY_STATUS: Partial<Record<string, keyof WorkPackageRecord>> = {
  [WORK_PACKAGE_STATUS.ACCEPTED]: 'acceptedAt',
  [WORK_PACKAGE_STATUS.SUBMITTED]: 'submittedAt',
  [WORK_PACKAGE_STATUS.BLOCKED]: 'blockedAt',
};

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<WorkPackageRecord>>,
) => {
  const { before, after } = event.properties;

  if (before.status === after.status || !isWorkPackageTransition(after.status)) {
    return { skipped: 'no status transition' };
  }

  const api = createTwentyApi();
  const stampField = STAMP_FIELD_BY_STATUS[after.status];

  if (stampField !== undefined) {
    await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, event.recordId, {
      [stampField]: after.updatedAt,
    });
  }

  await publishWorkPackageTransition({
    workPackage: after,
    transition: after.status,
    happenedAt: after.updatedAt,
    properties: {
      fromStatus: before.status,
      ownerId: after.ownerId,
      ...(after.status === WORK_PACKAGE_STATUS.BLOCKED
        ? { blockedReason: after.blockedReason }
        : {}),
    },
  });

  return { transition: after.status };
};

export default defineLogicFunction({
  universalIdentifier: WORK_PACKAGE_TRANSITION_LOG_UNIVERSAL_IDENTIFIER,
  name: 'work-package-transition-log',
  description:
    'Stamps accepted, submitted and blocked times and writes each work-package transition to the work package and case timelines',
  timeoutSeconds: 60,
  handler: withFailureLog('work-package-transition-log', handler),
  databaseEventTriggerSettings: {
    eventName: 'workPackage.updated',
    updatedFields: ['status'],
  },
});
