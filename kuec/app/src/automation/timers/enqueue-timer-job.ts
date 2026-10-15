import { enqueueJobs } from 'twenty-sdk/logic-function';

import { withRetryableErrors } from 'src/automation/api/twenty-api';
import {
  planTimerJob,
  type WorkPackageTimer,
} from 'src/automation/timers/work-package-timers';

export const TIMER_JOB_RETRY_LIMIT = 3;

// A job id the queue still holds makes the enqueue a no-op, so repeating
// this for the same timer is safe.
export const enqueueTimerJob = async ({
  logicFunctionUniversalIdentifier,
  timer,
  now,
  jobIdOverride,
}: {
  logicFunctionUniversalIdentifier: string;
  timer: WorkPackageTimer;
  now: Date;
  jobIdOverride?: string;
}): Promise<string> => {
  const plannedJob = planTimerJob(timer, now);
  const jobId = jobIdOverride ?? plannedJob.jobId;

  await withRetryableErrors(`enqueue ${jobId}`, () =>
    enqueueJobs({
      logicFunctionUniversalIdentifier,
      jobs: [{ jobId, payload: plannedJob.payload }],
      delayMs: plannedJob.delayMs,
      retryLimit: TIMER_JOB_RETRY_LIMIT,
    }),
  );

  console.log(
    `enqueued ${jobId} to run in ${Math.round(plannedJob.delayMs / 60000)} min`,
  );

  return jobId;
};
