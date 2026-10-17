import { defineLogicFunction } from 'twenty-sdk/define';

import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  postToTeamsOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  publishWorkPackageTransition,
  WORK_PACKAGE_TRANSITION,
} from 'src/automation/timeline/publish-work-package-transition';
import { runWorkPackageTimerJob } from 'src/automation/timers/run-timer-job';
import { type TimerJobPayload } from 'src/automation/timers/work-package-timers';

export const W02_ACCEPTANCE_TIMER_UNIVERSAL_IDENTIFIER = '5c4a272c-c3f4-498a-a49e-73d2331584f6';

const handler = async (payload: TimerJobPayload) => {
  const api = createTwentyApi();

  return runWorkPackageTimerJob({
    api,
    payload,
    ownUniversalIdentifier: W02_ACCEPTANCE_TIMER_UNIVERSAL_IDENTIFIER,
    fire: async ({ workPackage, timer, context, now }) => {
      const target = {
        objectNameSingular: OBJECT_NAMES.workPackage.singular,
        recordId: workPackage.id,
      };
      const link = recordLinkFor(target);
      const subject = workPackage.name ?? '';

      if (timer.level === 1) {
        await notifyMembers({
          api,
          memberIds: [workPackage.ownerId, context.edMemberId],
          message: NOTIFICATION_MESSAGES.acceptanceReminder({ subject, link }),
          taskTitle: `Not accepted: ${subject}`,
          target,
          dedupeKey: timer.baseJobId,
          now,
        });
        await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, workPackage.id, {
          acceptReminderSentAt: now.toISOString(),
        });

        return;
      }

      const previousOwnerId = workPackage.ownerId;
      const newOwnerId = context.opsCoordinatorMemberId ?? previousOwnerId;

      if (context.opsCoordinatorMemberId === null) {
        console.error('w02 cannot reassign: no active ops coordinator in playbook role assignments');
      }

      // The escalation is the app's action, and the person whose change
      // started the timer may not be allowed to change owners.
      if (newOwnerId !== previousOwnerId) {
        await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, workPackage.id, {
          ownerId: newOwnerId,
        });
      }

      const message = NOTIFICATION_MESSAGES.reassignedToOpsCoordinator({ subject, link });

      await notifyMembers({
        api,
        memberIds: [previousOwnerId, newOwnerId, context.edMemberId],
        message,
        taskTitle: `Reassigned: ${subject}`,
        target,
        dedupeKey: timer.baseJobId,
        now,
      });
      await postToTeamsOnce({ dedupeKey: timer.baseJobId, line: message });
      await publishWorkPackageTransition({
        workPackage,
        transition: WORK_PACKAGE_TRANSITION.REASSIGNED,
        happenedAt: timer.fireAt.toISOString(),
        properties: { previousOwnerId, newOwnerId },
      });
      await updateRecord(api.asApplication, OBJECT_NAMES.workPackage, workPackage.id, {
        reassignedAt: now.toISOString(),
      });
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: W02_ACCEPTANCE_TIMER_UNIVERSAL_IDENTIFIER,
  name: 'w02-acceptance-timer',
  description:
    'W2 job (wp-accept-*): still Offered after 2 business days notifies owner and ED; after 5 reassigns to the ops coordinator',
  timeoutSeconds: 60,
  handler,
});
