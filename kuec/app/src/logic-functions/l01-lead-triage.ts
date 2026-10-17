import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { triageLead } from 'src/automation/leads/triage-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';

export const L01_LEAD_TRIAGE_UNIVERSAL_IDENTIFIER = 'eb0b4805-92f4-4873-8a3a-cbbc2f4d154c';

// Creating a lead in the UI fires before it is filled, so triage waits for the
// first edit of its name or source (kuec/CLAUDE.md section 8). Leads the intake
// route creates are triaged by its job; the lead sweep catches the rest.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>,
) => {
  if (event.properties.after.playbookApplied) {
    return { skipped: 'already triaged' };
  }

  const api = createTwentyApi();
  const lead = await getRecord<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, event.recordId);

  if (!isDefined(lead)) {
    return { skipped: 'lead gone' };
  }

  const triaged = await triageLead({
    api,
    lead,
    context: await loadAutomationContext(api),
    now: new Date(),
  });

  return { triaged };
};

export default defineLogicFunction({
  universalIdentifier: L01_LEAD_TRIAGE_UNIVERSAL_IDENTIFIER,
  name: 'l01-lead-triage',
  description:
    'L1: a new lead without an owner goes to the ops coordinator, gets a Triage task due next business day and is marked triaged, once',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['name', 'source'],
  },
});
