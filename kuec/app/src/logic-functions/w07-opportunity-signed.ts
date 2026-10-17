import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createRecord,
  createTwentyApi,
  listRecords,
} from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  notifyMembers,
  postToTeamsOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type ContractRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import {
  CONTRACT_KIND,
  CONTRACT_STATUS,
} from 'src/objects/contract.object';

export const W07_OPPORTUNITY_SIGNED_UNIVERSAL_IDENTIFIER = 'ba3e46fa-8ca7-43f6-876e-23ed0e4d13ca';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const { before, after } = event.properties;

  if (
    after.stage !== OPPORTUNITY_STAGE.SIGNED ||
    before.stage === OPPORTUNITY_STAGE.SIGNED
  ) {
    return { skipped: 'not a transition to Signed' };
  }

  const api = createTwentyApi();
  const now = new Date();
  const context = await loadAutomationContext(api);
  const target = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: event.recordId,
  };
  const message = NOTIFICATION_MESSAGES.opportunitySigned({
    subject: after.name ?? '',
    link: recordLinkFor(target),
  });
  const dedupeKey = `signed:${event.recordId}:${Date.parse(after.updatedAt)}`;

  await notifyMembers({
    api,
    memberIds: [context.edMemberId],
    message,
    taskTitle: `Signed: ${after.name ?? ''}`,
    target,
    dedupeKey,
    now,
  });
  await postToTeamsOnce({ dedupeKey, line: message });

  if (after.playbookType !== OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING) {
    return { contract: 'not a licence opportunity' };
  }

  const licences = await listRecords<ContractRecord>(
    api.asApplication,
    OBJECT_NAMES.contract,
    `and(opportunityId[eq]:"${event.recordId}",kind[eq]:${CONTRACT_KIND.LICENCE})`,
  );

  if (licences.length > 0) {
    return { contract: licences[0]?.id };
  }

  // Created as the app: BD officers and department roles cannot write contracts.
  const contract = await createRecord<ContractRecord>(
    api.asApplication,
    OBJECT_NAMES.contract,
    {
      name: `Licence: ${after.name ?? ''}`,
      kind: CONTRACT_KIND.LICENCE,
      status: CONTRACT_STATUS.SIGNED,
      signedOn: toDubaiDateString(now),
      opportunityId: event.recordId,
      counterpartyId: after.companyId,
      ownerId: after.ownerId,
    },
  );

  console.log(`w07 created licence contract ${contract.id} for ${event.recordId}`);

  return { contract: contract.id };
};

export default defineLogicFunction({
  universalIdentifier: W07_OPPORTUNITY_SIGNED_UNIVERSAL_IDENTIFIER,
  name: 'w07-opportunity-signed',
  description:
    'W7: a Signed opportunity notifies the ED; a Licence opportunity without a licence contract gets one in status Signed',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['stage'],
  },
});
