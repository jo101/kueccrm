import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { enqueuePlaybookJob } from 'src/automation/playbooks/enqueue-playbook-job';
import { findOpportunityPlaybook } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import { W01_APPLY_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/w01-apply-opportunity-playbook';

export const W01_INSTANTIATE_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER =
  'efc2be9d-af73-41bd-affa-8a8245727435';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const api = createTwentyApi();
  const opportunity = await getRecord<OpportunityRecord>(
    api.asApplication,
    OBJECT_NAMES.opportunity,
    event.recordId,
  );

  if (!isDefined(opportunity) || opportunity.playbookApplied) {
    return { skipped: 'playbook already applied or opportunity gone' };
  }

  if (
    !isDefined(opportunity.playbookType) ||
    !isDefined(findOpportunityPlaybook(opportunity.playbookType))
  ) {
    return { skipped: `no playbook for type ${opportunity.playbookType}` };
  }

  return {
    enqueued: await enqueuePlaybookJob({
      logicFunctionUniversalIdentifier:
        W01_APPLY_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER,
      caseKind: 'opportunity',
      caseId: opportunity.id,
    }),
  };
};

export default defineLogicFunction({
  universalIdentifier: W01_INSTANTIATE_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER,
  name: 'w01-instantiate-opportunity-playbook',
  description:
    'W1: when an opportunity gets a type, checks the playbookApplied guard and enqueues the one playbook job for it',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['playbookType'],
  },
});
