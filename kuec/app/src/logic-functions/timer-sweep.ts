import { defineLogicFunction } from 'twenty-sdk/define';
import { getJobs, type JobStatusResult } from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  listRecords,
  quoteFilterValues,
  withRetryableErrors,
} from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type WorkPackageRecord } from 'src/automation/records/record-types';
import { enqueueTimerJob } from 'src/automation/timers/enqueue-timer-job';
import { TIMER_FUNCTION_BY_KIND } from 'src/automation/timers/schedule-work-package-timers';
import {
  buildSweepRetryJobId,
  derivePendingTimers,
  MAX_JOB_DELAY_MS,
  STATUSES_WITH_DUE_TIMER,
  TIMER_FIRE_TOLERANCE_MS,
  type WorkPackageTimer,
} from 'src/automation/timers/work-package-timers';

export const TIMER_SWEEP_UNIVERSAL_IDENTIFIER = '75b832b6-c8f9-4df4-a0d8-f31f111dabb9';

const MAX_JOBS_PER_STATUS_READ = 200;

const PENDING_JOB_STATES: JobStatusResult['state'][] = [
  'WAITING',
  'DELAYED',
  'ACTIVE',
  'PRIORITIZED',
  'WAITING_CHILDREN',
];

type Repair = { jobId: string; reason: string };

const readJobStates = async (
  jobIds: string[],
): Promise<Map<string, JobStatusResult['state']>> => {
  const states = new Map<string, JobStatusResult['state']>();

  for (let start = 0; start < jobIds.length; start += MAX_JOBS_PER_STATUS_READ) {
    const chunk = jobIds.slice(start, start + MAX_JOBS_PER_STATUS_READ);
    const statuses = await withRetryableErrors('read job states', () =>
      getJobs(chunk),
    );

    for (const status of statuses) {
      states.set(status.jobId, status.state);
    }
  }

  return states;
};

const isPending = (state: JobStatusResult['state'] | undefined): boolean =>
  state !== undefined && PENDING_JOB_STATES.includes(state);

// Event handlers are the fast path; this re-derives every timer from record
// state alone, because a database event can be lost on a restart or throttled.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const [workPackages, context] = await Promise.all([
    listRecords<WorkPackageRecord>(
      api.asApplication,
      OBJECT_NAMES.workPackage,
      `status[in]:${quoteFilterValues(STATUSES_WITH_DUE_TIMER)}`,
    ),
    loadAutomationContext(api),
  ]);

  // Timers further out are reached by the hop chain; a later sweep picks
  // them up once they are within one job delay.
  const timers: WorkPackageTimer[] = workPackages
    .flatMap((workPackage) => derivePendingTimers(workPackage, context.holidays))
    .filter((timer) => timer.fireAt.getTime() - now.getTime() <= MAX_JOB_DELAY_MS);

  const states = await readJobStates(
    timers.flatMap((timer) => [
      timer.baseJobId,
      buildSweepRetryJobId(timer.baseJobId, now),
    ]),
  );
  const repairs: Repair[] = [];

  for (const timer of timers) {
    const baseState = states.get(timer.baseJobId);
    const retryJobId = buildSweepRetryJobId(timer.baseJobId, now);

    if (isPending(baseState) || isPending(states.get(retryJobId))) {
      continue;
    }

    const logicFunctionUniversalIdentifier = TIMER_FUNCTION_BY_KIND[timer.kind];

    if (baseState === undefined) {
      await enqueueTimerJob({ logicFunctionUniversalIdentifier, timer, now });
      repairs.push({ jobId: timer.baseJobId, reason: 'no job found' });
      continue;
    }

    // The queue keeps a finished job's id for a while and ignores a re-enqueue
    // under it, so an overdue timer whose job finished without firing (failed
    // after its retries) is retried under an hourly id.
    if (timer.fireAt.getTime() <= now.getTime() - TIMER_FIRE_TOLERANCE_MS) {
      await enqueueTimerJob({
        logicFunctionUniversalIdentifier,
        timer,
        now,
        jobIdOverride: retryJobId,
      });
      repairs.push({
        jobId: retryJobId,
        reason: `${timer.baseJobId} is ${baseState} but the escalation has not fired`,
      });
    }
  }

  for (const repair of repairs) {
    console.log(`sweep repaired ${repair.jobId}: ${repair.reason}`);
  }

  console.log(
    `sweep checked ${workPackages.length} open work packages, ${timers.length} timers due within 7 days, repaired ${repairs.length}`,
  );

  return {
    checkedWorkPackages: workPackages.length,
    checkedTimers: timers.length,
    repaired: repairs,
  };
};

export default defineLogicFunction({
  universalIdentifier: TIMER_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'timer-sweep',
  description:
    'Hourly: re-derives every acceptance and overdue timer from work-package state and enqueues any job that is missing',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // Every hour at minute 0, UTC (Asia/Dubai has the same minute)
    pattern: '0 * * * *',
  },
});
