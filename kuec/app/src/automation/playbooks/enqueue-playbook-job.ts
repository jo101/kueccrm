import { enqueueJobs } from 'twenty-sdk/logic-function';

import { withRetryableErrors } from 'src/automation/api/twenty-api';
import { TIMER_JOB_RETRY_LIMIT } from 'src/automation/timers/enqueue-timer-job';

// Two type changes in quick succession must not instantiate twice. The queue
// holds one job per id, so concurrent triggers collapse into one serialized
// run; that run re-checks the guard.
export const enqueuePlaybookJob = async ({
  logicFunctionUniversalIdentifier,
  caseKind,
  caseId,
}: {
  logicFunctionUniversalIdentifier: string;
  caseKind: 'opportunity' | 'project';
  caseId: string;
}): Promise<string> => {
  const jobId = `playbook-${caseKind}-${caseId}`;

  await withRetryableErrors(`enqueue ${jobId}`, () =>
    enqueueJobs({
      logicFunctionUniversalIdentifier,
      jobs: [{ jobId, payload: { caseId } }],
      retryLimit: TIMER_JOB_RETRY_LIMIT,
    }),
  );

  return jobId;
};
