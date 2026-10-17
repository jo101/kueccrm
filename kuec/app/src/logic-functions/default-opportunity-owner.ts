import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, updateRecord } from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import { computeDefaultOwnerId } from 'src/automation/rules/default-owner.rule';

export const DEFAULT_OPPORTUNITY_OWNER_UNIVERSAL_IDENTIFIER = 'd8000a42-3d49-4336-88b6-8c96c752f4f6';

// Creating a record in the UI fires before it is filled, so this listens for
// the first edit (the name) rather than the creation (kuec/CLAUDE.md section 8).
const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const ownerId = computeDefaultOwnerId(event.properties.after, new Date());

  if (!isDefined(ownerId)) {
    return { skipped: 'owner set, not created in the UI, or older than a day' };
  }

  await updateRecord(
    createTwentyApi().asApplication,
    OBJECT_NAMES.opportunity,
    event.recordId,
    { ownerId },
  );

  return { ownerId };
};

export default defineLogicFunction({
  universalIdentifier: DEFAULT_OPPORTUNITY_OWNER_UNIVERSAL_IDENTIFIER,
  name: 'default-opportunity-owner',
  description:
    'Gives an opportunity created in the UI without an owner to the person who created it, within its first day',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['name', 'ownerId'],
  },
});
