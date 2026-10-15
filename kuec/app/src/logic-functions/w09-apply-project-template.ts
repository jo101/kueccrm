import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import {
  createTwentyApi,
  getRecord,
  updateRecord,
} from 'src/automation/api/twenty-api';
import { instantiateCase } from 'src/automation/playbooks/instantiate-case';
import { findProjectTemplate } from 'src/automation/playbooks/playbook-templates';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type ProjectRecord } from 'src/automation/records/record-types';

export const W09_APPLY_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER =
  '550ba7d0-04cd-4fd4-ad6d-3a97c990aaa1';

const handler = async ({ caseId }: { caseId: string }) => {
  const api = createTwentyApi();
  const project = await getRecord<ProjectRecord>(
    api.asApplication,
    OBJECT_NAMES.project,
    caseId,
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
    now: new Date(),
  });

  // Set last: a run that fails before this point is retried and resumes.
  await updateRecord(api.asApplication, OBJECT_NAMES.project, project.id, {
    playbookApplied: true,
  });

  console.log(
    `w09 applied ${caseTemplate.key} to ${project.id}: ${workPackages.length} work packages, ${caseTemplate.milestones.length} milestones`,
  );

  return {
    template: caseTemplate.key,
    workPackages: workPackages.length,
    milestones: caseTemplate.milestones.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: W09_APPLY_PROJECT_TEMPLATE_UNIVERSAL_IDENTIFIER,
  name: 'w09-apply-project-template',
  description:
    "W9 job (playbook-project-<id>): creates the project's milestones and work packages once; enqueued by w09-instantiate-project-template",
  timeoutSeconds: 120,
  handler,
});
