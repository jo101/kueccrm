import { defineLogicFunction } from 'twenty-sdk/define';

import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { runWorkPackageTimerJob } from 'src/automation/timers/run-timer-job';
import { type TimerJobPayload } from 'src/automation/timers/work-package-timers';

export const W03_OVERDUE_TIMER_UNIVERSAL_IDENTIFIER = '629847d7-e9f2-4c62-ad17-aac7a7767f35';

const handler = async (payload: TimerJobPayload) => {
  const api = createTwentyApi();

  return runWorkPackageTimerJob({
    api,
    payload,
    ownUniversalIdentifier: W03_OVERDUE_TIMER_UNIVERSAL_IDENTIFIER,
    fire: async ({ workPackage, timer, context, now }) => {
      const target = {
        objectNameSingular: OBJECT_NAMES.workPackage.singular,
        recordId: workPackage.id,
      };
      const link = recordLinkFor(target);
      const subject = workPackage.name ?? '';
      const isOwnerLevel = timer.level === 1;

      await notifyMembers({
        api,
        memberIds: isOwnerLevel ? [workPackage.ownerId] : [context.edMemberId],
        message: isOwnerLevel
          ? NOTIFICATION_MESSAGES.overdueOwner({ subject, link })
          : NOTIFICATION_MESSAGES.overdueEd({ subject, link }),
        taskTitle: `Overdue: ${subject}`,
        target,
        dedupeKey: timer.baseJobId,
        now,
      });
      await updateRecord(
        api.asApplication,
        OBJECT_NAMES.workPackage,
        workPackage.id,
        isOwnerLevel
          ? { overdueOwnerNotifiedAt: now.toISOString() }
          : { overdueEdNotifiedAt: now.toISOString() },
      );
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: W03_OVERDUE_TIMER_UNIVERSAL_IDENTIFIER,
  name: 'w03-overdue-timer',
  description:
    'W3 job (wp-due-*): open at its due date notifies the owner; 2 business days later the ED',
  timeoutSeconds: 60,
  handler,
});
