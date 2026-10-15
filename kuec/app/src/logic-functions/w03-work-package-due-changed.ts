import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { scheduleWorkPackageTimers } from 'src/automation/timers/schedule-work-package-timers';
import { TIMER_KIND } from 'src/automation/timers/work-package-timers';

export const W03_WORK_PACKAGE_DUE_CHANGED_UNIVERSAL_IDENTIFIER = '9595d152-84ca-481a-b40d-522b974a19d9';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<WorkPackageRecord>>,
) => {
  const api = createTwentyApi();
  const [workPackage, context] = await Promise.all([
    getRecord<WorkPackageRecord>(
      api.asApplication,
      OBJECT_NAMES.workPackage,
      event.recordId,
    ),
    loadAutomationContext(api),
  ]);

  if (!isDefined(workPackage)) {
    return { skipped: 'work package gone' };
  }

  // The job id carries the due date, so a moved due date gets its own job and
  // the old one finds itself stale when it runs.
  const jobIds = await scheduleWorkPackageTimers({
    workPackage,
    kinds: [TIMER_KIND.DUE],
    holidays: context.holidays,
    now: new Date(),
  });

  return { jobIds };
};

export default defineLogicFunction({
  universalIdentifier: W03_WORK_PACKAGE_DUE_CHANGED_UNIVERSAL_IDENTIFIER,
  name: 'w03-work-package-due-changed',
  description:
    'W3: when a due date or status changes, schedules the overdue timer for the open work package',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'workPackage.updated',
    updatedFields: ['dueAt', 'status'],
  },
});
