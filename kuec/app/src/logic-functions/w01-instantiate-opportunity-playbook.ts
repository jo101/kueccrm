import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  getRecord,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  postToTeamsOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import { instantiateCase } from 'src/automation/playbooks/instantiate-case';
import { findOpportunityPlaybook } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';

export const W01_INSTANTIATE_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER =
  'efc2be9d-af73-41bd-affa-8a8245727435';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  const api = createTwentyApi();
  const now = new Date();
  const opportunity = await getRecord<OpportunityRecord>(
    api.asApplication,
    OBJECT_NAMES.opportunity,
    event.recordId,
  );

  if (!isDefined(opportunity) || opportunity.playbookApplied) {
    return { skipped: 'playbook already applied or opportunity gone' };
  }

  const caseTemplate = isDefined(opportunity.playbookType)
    ? findOpportunityPlaybook(opportunity.playbookType)
    : null;

  if (!isDefined(caseTemplate)) {
    return { skipped: `no playbook for type ${opportunity.playbookType}` };
  }

  const context = await loadAutomationContext(api);
  const caseName = opportunity.name ?? 'Opportunity';
  const { workPackages } = await instantiateCase({
    api,
    context,
    caseReference: { kind: 'opportunity', id: opportunity.id },
    caseName,
    caseTemplate,
    anchors: isDefined(opportunity.clientDeadline)
      ? { CLIENT_DEADLINE: opportunity.clientDeadline.slice(0, 10) }
      : {},
    caseOwnerMemberId: opportunity.ownerId,
    now,
  });

  const firstWorkPackage = workPackages[0];
  const hasNextAction =
    (opportunity.nextAction ?? '').trim().length > 0 &&
    isDefined(opportunity.nextActionDate);

  if (!hasNextAction && isDefined(firstWorkPackage)) {
    await updateRecord(api.asPerson, OBJECT_NAMES.opportunity, opportunity.id, {
      nextAction: opportunity.nextAction || firstWorkPackage.name,
      nextActionDate:
        opportunity.nextActionDate ??
        (isDefined(firstWorkPackage.dueAt)
          ? toDubaiDateString(new Date(firstWorkPackage.dueAt))
          : null),
    });
  }

  const target = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: opportunity.id,
  };
  const link = recordLinkFor(target);

  if (opportunity.playbookType === OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING) {
    await createTaskOnce({
      api,
      assigneeId: context.edMemberId,
      title: `Confirm plan: ${caseName}`,
      body: `Confirm the licensing plan and its ${workPackages.length} work packages. ${link}`,
      target,
      dedupeKey: `confirm-plan:${opportunity.id}`,
      now,
    });
  }

  await postToTeamsOnce({
    dedupeKey: `playbook-started:${opportunity.id}`,
    line: NOTIFICATION_MESSAGES.playbookStarted({ subject: caseName, link }),
  });

  // Set last: a run that fails before this point is retried and resumes.
  await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
    playbookApplied: true,
  });

  console.log(
    `w01 applied ${caseTemplate.key} to ${opportunity.id}: ${workPackages.length} work packages`,
  );

  return { playbook: caseTemplate.key, workPackages: workPackages.length };
};

export default defineLogicFunction({
  universalIdentifier: W01_INSTANTIATE_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER,
  name: 'w01-instantiate-opportunity-playbook',
  description:
    'W1: when an opportunity gets a type, creates its playbook work packages once',
  timeoutSeconds: 120,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['playbookType'],
  },
});
