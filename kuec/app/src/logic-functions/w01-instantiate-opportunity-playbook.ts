import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { withFailureLog } from 'src/automation/api/log-handler-failure';
import {
  createTwentyApi,
  getRecord,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import {
  createTaskOnce,
  postToTeamsOnce,
  recordLinkFor,
} from 'src/automation/notifications/notify';
import {
  instantiateCase,
  publishOfferedTransitions,
} from 'src/automation/playbooks/instantiate-case';
import { findOpportunityPlaybook } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type OpportunityRecord } from 'src/automation/records/record-types';
import { planOpportunityPlaybookFollowUp } from 'src/automation/rules/playbook-follow-up.rule';
import { describeTimelineFailures } from 'src/automation/timeline/publish-work-package-transition';

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
  // Creates the work packages and tells each Offered step's owner.
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

  const target = {
    objectNameSingular: OBJECT_NAMES.opportunity.singular,
    recordId: opportunity.id,
  };
  const link = recordLinkFor(target);
  const { nextActionPatch, confirmPlanTask } = planOpportunityPlaybookFollowUp({
    opportunity,
    workPackages,
    caseName,
    link,
  });

  if (isDefined(nextActionPatch)) {
    await updateRecord(
      api.asPerson,
      OBJECT_NAMES.opportunity,
      opportunity.id,
      nextActionPatch,
    );
  }

  if (isDefined(confirmPlanTask)) {
    await createTaskOnce({
      api,
      assigneeId: context.edMemberId,
      title: confirmPlanTask.title,
      body: confirmPlanTask.body,
      target,
      dedupeKey: `confirm-plan:${opportunity.id}`,
      now,
    });
  }

  await postToTeamsOnce({
    dedupeKey: `playbook-started:${opportunity.id}`,
    line: NOTIFICATION_MESSAGES.playbookStarted({ subject: caseName, link }),
  });

  // Stamped once everyone is told: a run that fails before this point is
  // retried and resumes, and every step above is idempotent.
  await updateRecord(api.asApplication, OBJECT_NAMES.opportunity, opportunity.id, {
    playbookApplied: true,
  });

  console.log(
    `w01 applied ${caseTemplate.key} to ${opportunity.id}: ${workPackages.length} work packages`,
  );

  // Audit trail last, so a timeline failure cannot swallow the notifications.
  // The playbook is applied by now; failing the run still puts it in the logs.
  const timelineFailures = await publishOfferedTransitions(workPackages, now);

  if (timelineFailures.length > 0) {
    throw new Error(
      `w01 applied the playbook to ${opportunity.id} but could not write its timeline: ${describeTimelineFailures(timelineFailures)}`,
    );
  }

  return { playbook: caseTemplate.key, workPackages: workPackages.length };
};

export default defineLogicFunction({
  universalIdentifier: W01_INSTANTIATE_OPPORTUNITY_PLAYBOOK_UNIVERSAL_IDENTIFIER,
  name: 'w01-instantiate-opportunity-playbook',
  description:
    'W1: when an opportunity gets a type, creates its playbook work packages once',
  timeoutSeconds: 120,
  handler: withFailureLog('w01-instantiate-opportunity-playbook', handler),
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['playbookType'],
  },
});
