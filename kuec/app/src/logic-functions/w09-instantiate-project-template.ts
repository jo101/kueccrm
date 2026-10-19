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
import {
  instantiateCase,
  publishOfferedTransitions,
} from 'src/automation/playbooks/instantiate-case';
import { findProjectTemplate } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type ProjectRecord } from 'src/automation/records/record-types';
import { describeTimelineFailures } from 'src/automation/timeline/publish-work-package-transition';

export const W09_INSTANTIATE_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER = 'f1e1e2bc-9a13-4e93-867b-5e21285433e4';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<ProjectRecord>>,
) => {
  const api = createTwentyApi();
  const project = await getRecord<ProjectRecord>(
    api.asApplication,
    OBJECT_NAMES.project,
    event.recordId,
  );

  if (!isDefined(project) || project.playbookApplied) {
    return { skipped: 'template already applied or project gone' };
  }

  const caseTemplate = isDefined(project.playbookType)
    ? findProjectTemplate(project.playbookType)
    : null;

  if (!isDefined(caseTemplate)) {
    return { skipped: `no template for type ${project.playbookType}` };
  }

  const now = new Date();
  // Creates the milestones and work packages and tells each Offered step's owner.
  const { workPackages } = await instantiateCase({
    api,
    context: await loadAutomationContext(api),
    caseReference: { kind: 'project', id: project.id },
    caseName: project.name ?? 'Project',
    caseTemplate,
    anchors: isDefined(project.eventDate)
      ? { EVENT_DATE: project.eventDate.slice(0, 10) }
      : {},
    caseOwnerMemberId: project.ownerId,
    now,
  });

  // Stamped before the timeline: a run that fails before this point is
  // retried and resumes, and every step above is idempotent.
  await updateRecord(api.asApplication, OBJECT_NAMES.project, project.id, {
    playbookApplied: true,
  });

  console.log(
    `w09 applied ${caseTemplate.key} to ${project.id}: ${workPackages.length} work packages, ${caseTemplate.milestones.length} milestones`,
  );

  // Audit trail last, so a timeline failure cannot swallow the notifications.
  const timelineFailures = await publishOfferedTransitions(workPackages, now);

  if (timelineFailures.length > 0) {
    throw new Error(
      `w09 applied the template to ${project.id} but could not write its timeline: ${describeTimelineFailures(timelineFailures)}`,
    );
  }

  return {
    template: caseTemplate.key,
    workPackages: workPackages.length,
    milestones: caseTemplate.milestones.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: W09_INSTANTIATE_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER,
  name: 'w09-instantiate-project-template',
  description:
    'W9: when a project gets a type (Workshop, Proposal, Delivery), creates its milestones and work packages once',
  timeoutSeconds: 120,
  handler: withFailureLog('w09-instantiate-project-template', handler),
  databaseEventTriggerSettings: {
    eventName: 'project.updated',
    updatedFields: ['playbookType'],
  },
});
