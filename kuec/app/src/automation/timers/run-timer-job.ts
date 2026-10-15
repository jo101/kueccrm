import { getRecord, type TwentyApi } from 'src/automation/api/twenty-api';
import {
  loadAutomationContext,
  type AutomationContext,
} from 'src/automation/api/load-automation-context';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { enqueueTimerJob } from 'src/automation/timers/enqueue-timer-job';
import {
  decideTimerRun,
  derivePendingTimer,
  type TimerJobPayload,
  type WorkPackageTimer,
} from 'src/automation/timers/work-package-timers';

export type TimerRunResult = {
  outcome: 'STALE' | 'WAIT' | 'FIRED';
  detail: string;
};

// The job carries only ids; the record is re-read so a timer that lost its
// reason (accepted, done, re-dated, already fired) does nothing.
export const runWorkPackageTimerJob = async ({
  api,
  payload,
  ownUniversalIdentifier,
  fire,
}: {
  api: TwentyApi;
  payload: TimerJobPayload;
  ownUniversalIdentifier: string;
  fire: (input: {
    workPackage: WorkPackageRecord;
    timer: WorkPackageTimer;
    context: AutomationContext;
    now: Date;
  }) => Promise<void>;
}): Promise<TimerRunResult> => {
  const now = new Date();
  const [workPackage, context] = await Promise.all([
    getRecord<WorkPackageRecord>(
      api.asApplication,
      OBJECT_NAMES.workPackage,
      payload.workPackageId,
    ),
    loadAutomationContext(api),
  ]);

  const decision = decideTimerRun({
    workPackage,
    payload,
    now,
    holidays: context.holidays,
  });

  if (decision.action === 'STALE') {
    console.log(`stale timer for ${payload.workPackageId}: ${decision.reason}`);

    return { outcome: 'STALE', detail: decision.reason };
  }

  if (decision.action === 'WAIT') {
    const jobId = await enqueueTimerJob({
      logicFunctionUniversalIdentifier: ownUniversalIdentifier,
      timer: decision.timer,
      now,
    });

    return { outcome: 'WAIT', detail: `chained ${jobId}` };
  }

  if (workPackage === null) {
    return { outcome: 'STALE', detail: 'work package no longer exists' };
  }

  await fire({ workPackage, timer: decision.timer, context, now });

  const refreshed = await getRecord<WorkPackageRecord>(
    api.asApplication,
    OBJECT_NAMES.workPackage,
    payload.workPackageId,
  );
  const nextTimer =
    refreshed === null
      ? null
      : derivePendingTimer(refreshed, payload.kind, context.holidays);

  if (nextTimer !== null) {
    await enqueueTimerJob({
      logicFunctionUniversalIdentifier: ownUniversalIdentifier,
      timer: nextTimer,
      now,
    });
  }

  return { outcome: 'FIRED', detail: decision.timer.baseJobId };
};
