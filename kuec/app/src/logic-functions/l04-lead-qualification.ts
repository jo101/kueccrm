import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { qualifyLead } from 'src/automation/leads/qualify-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { QUALIFICATION_CHECK_FIELD_NAMES } from 'src/automation/rules/lead-qualification.rule';

export const L04_LEAD_QUALIFICATION_UNIVERSAL_IDENTIFIER = '2fad39c3-c924-4e8f-a7fe-c9993c5bf430';

// Re-reads the lead: two checks ticked in quick succession arrive as two
// events, and the score must count both.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>,
) => {
  const api = createTwentyApi();
  const lead = await getRecord<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, event.recordId);

  if (!isDefined(lead)) {
    return { skipped: 'lead gone' };
  }

  const plan = await qualifyLead({
    api,
    lead,
    context: await loadAutomationContext(api),
    now: new Date(),
  });

  return plan;
};

export default defineLogicFunction({
  universalIdentifier: L04_LEAD_QUALIFICATION_UNIVERSAL_IDENTIFIER,
  name: 'l04-lead-qualification',
  description:
    'L4: any of the five checks changing sets qualificationScore; at 4 or more an open lead becomes Qualified with a Convert or park task for the owner, and a licence-grade lead notifies the ED',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: [...QUALIFICATION_CHECK_FIELD_NAMES],
  },
});
