import { defineLogicFunction } from 'twenty-sdk/define';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi } from 'src/automation/api/twenty-api';
import { type LeadIntakePayload } from 'src/automation/intake/lead-intake-payload';
import { recordIntakeLead } from 'src/automation/intake/record-intake-lead';

export const LEAD_INTAKE_JOB_UNIVERSAL_IDENTIFIER = '5329baa3-a36c-43d9-b9e7-c2d3f8ad3408';

// Runs as the app, enqueued by lead-intake-route with a job id built from the
// delivery id. Logs counts only, never the contact details.
const handler = async (payload: LeadIntakePayload) => {
  const api = createTwentyApi();
  const now = new Date();
  const context = await loadAutomationContext(api);
  let created = 0;

  for (const submission of payload.submissions) {
    const outcome = await recordIntakeLead({
      api,
      form: payload.form,
      submission,
      context,
      now,
    });

    if (outcome.created) {
      created++;
    }
  }

  console.log(
    `lead intake ${payload.deliveryId} (${payload.form}): ${payload.submissions.length} submissions, ${created} new leads`,
  );

  return { deliveryId: payload.deliveryId, created };
};

export default defineLogicFunction({
  universalIdentifier: LEAD_INTAKE_JOB_UNIVERSAL_IDENTIFIER,
  name: 'lead-intake-job',
  description:
    'Job behind lead-intake-route: each form submission becomes a lead with its source set, matched or created person and company, keyed on externalId, then triaged (L1)',
  timeoutSeconds: 300,
  handler,
});
