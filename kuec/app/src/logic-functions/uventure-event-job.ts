import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi } from 'src/automation/api/twenty-api';
import {
  applyUventureEvent,
  type UventureEventOutcome,
} from 'src/automation/uventure/apply-uventure-event';
import { type UventureDelivery } from 'src/automation/uventure/uventure-payload';
import { recordRunPage } from 'src/automation/uventure/uventure-run-ledger';

export const UVENTURE_EVENT_JOB_UNIVERSAL_IDENTIFIER = '2048097e-12a4-446a-8217-7437430af7f8';

// Runs as the app, enqueued by uventure-route with a job id built from the
// delivery id. Events apply in the order sent; a transient failure retries the
// whole delivery, which is safe because every write is keyed on the uVENTURE id.
// Logs counts only, never record contents.
const handler = async (payload: UventureDelivery) => {
  const api = createTwentyApi();
  const now = new Date();
  const context = await loadAutomationContext(api);
  const counts: Record<UventureEventOutcome, number> = {
    created: 0,
    updated: 0,
    unchanged: 0,
    stale: 0,
  };

  for (const event of payload.events) {
    counts[await applyUventureEvent({ api, event, context, now })]++;
  }

  const runComplete = isDefined(payload.run) ? await recordRunPage(payload.run, now) : false;

  console.log(
    `uventure delivery ${payload.deliveryId}${isDefined(payload.run) ? ` (run ${payload.run.runId} page ${payload.run.page}/${payload.run.pageCount}${runComplete ? ', run complete' : ''})` : ''}: ${payload.events.length} events, ${counts.created} created, ${counts.updated} updated, ${counts.unchanged} unchanged, ${counts.stale} stale`,
  );

  return { deliveryId: payload.deliveryId, ...counts, runComplete };
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_EVENT_JOB_UNIVERSAL_IDENTIFIER,
  name: 'uventure-event-job',
  description:
    'Job behind uventure-route: upserts Capability pointers, challenge and sign-up leads and signed contracts keyed on externalId, skips events older than the last one applied, and records nightly snapshot pages',
  timeoutSeconds: 300,
  handler,
});
