import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { enqueuePlaybookJob } from 'src/automation/playbooks/enqueue-playbook-job';
import { findProjectTemplate } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type ProjectRecord } from 'src/automation/records/record-types';
import { W09_APPLY_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/w09-apply-project-template';

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

  if (
    !isDefined(project.playbookType) ||
    !isDefined(findProjectTemplate(project.playbookType))
  ) {
    return { skipped: `no template for type ${project.playbookType}` };
  }

  return {
    enqueued: await enqueuePlaybookJob({
      logicFunctionUniversalIdentifier:
        W09_APPLY_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER,
      caseKind: 'project',
      caseId: project.id,
    }),
  };
};

export default defineLogicFunction({
  universalIdentifier: W09_INSTANTIATE_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER,
  name: 'w09-instantiate-project-template',
  description:
    'W9: when a project gets a type (Workshop, Proposal, Delivery), checks the playbookApplied guard and enqueues the one template job for it',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'project.updated',
    updatedFields: ['playbookType'],
  },
});
