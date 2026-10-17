import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { convertLead } from 'src/automation/leads/convert-lead';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type LeadRecord } from 'src/automation/records/record-types';
import { LEAD_STATUS } from 'src/objects/lead.object';

export const L05_LEAD_CONVERT_UNIVERSAL_IDENTIFIER = '5ec213d1-d84a-476f-9f4b-d0da91392e7b';

// Phase A converts on the status change. The Phase B Convert command
// (design/backlog.md) will call the same convertLead.
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<LeadRecord>>,
) => {
  const { before, after } = event.properties;

  if (after.status !== LEAD_STATUS.CONVERTED || before.status === LEAD_STATUS.CONVERTED) {
    return { skipped: 'not a transition to Converted' };
  }

  const api = createTwentyApi();
  const lead = await getRecord<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, event.recordId);

  if (!isDefined(lead)) {
    return { skipped: 'lead gone' };
  }

  const opportunityId = await convertLead({
    api,
    lead,
    convertedSince: after.updatedAt,
    now: new Date(),
  });

  return { opportunityId };
};

export default defineLogicFunction({
  universalIdentifier: L05_LEAD_CONVERT_UNIVERSAL_IDENTIFIER,
  name: 'l05-lead-convert',
  description:
    'L5: a lead set to Converted becomes a new opportunity at Qualify with its type, source, company, person, need, next action, department and owner, linked both ways; every conversion is a new opportunity',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['status'],
  },
});
