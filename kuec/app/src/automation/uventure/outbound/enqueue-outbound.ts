import { enqueueJobs } from 'twenty-sdk/logic-function';

import { type OutboundSubject } from 'src/automation/uventure/outbound/plan-outbound-event';
import { isOutboundConfigured } from 'src/automation/uventure/outbound/send-to-uventure';

export const UVENTURE_OUTBOUND_JOB_RETRY_LIMIT = 3;

// The job id carries the change (or the day, for the repair sweep), so a new
// change is sent again while a duplicate event is dropped by the queue.
export const enqueueOutbound = async ({
  jobUniversalIdentifier,
  subjects,
  jobIdSuffix,
}: {
  jobUniversalIdentifier: string;
  subjects: (OutboundSubject & { deliveryId: string })[];
  jobIdSuffix: string;
}): Promise<number> => {
  if (!isOutboundConfigured() || subjects.length === 0) {
    return 0;
  }

  await enqueueJobs({
    logicFunctionUniversalIdentifier: jobUniversalIdentifier,
    jobs: subjects.map(({ type, recordId, deliveryId }) => ({
      jobId: `uventure-out-${deliveryId}-${jobIdSuffix}`,
      payload: { type, recordId },
    })),
    retryLimit: UVENTURE_OUTBOUND_JOB_RETRY_LIMIT,
  });

  return subjects.length;
};
