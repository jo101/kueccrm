import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import {
  READ_ONLY,
  READ_WRITE_NO_DELETE,
  withPreset,
} from './utils/object-permission-presets';
import { HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS } from './utils/system-objects';

export const AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER = '41f3a443-1174-463a-9586-b9fd5027cc57';

const { opportunity, company, person, task, note, taskTarget, noteTarget, workspaceMember } =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// runbooks/01-deploy.md section 9. Its first draft also granted a Capability
// object, which was never built: capabilities live in uVENTURE.
export default defineRole({
  universalIdentifier: AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Automation',
  description:
    'Behind the automation API key only. Read and write on BD objects, no delete, no settings, no tools.',
  icon: 'IconRobot',
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canBeAssignedToUsers: false,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: true,
  permissionFlagUniversalIdentifiers: [],
  objectPermissions: [
    ...[
      opportunity.universalIdentifier,
      company.universalIdentifier,
      person.universalIdentifier,
      task.universalIdentifier,
      note.universalIdentifier,
      // without the join objects a created task or note cannot be linked to its record
      taskTarget.universalIdentifier,
      noteTarget.universalIdentifier,
      PROJECT_UNIVERSAL_IDENTIFIER,
      MILESTONE_UNIVERSAL_IDENTIFIER,
      WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      CONTRACT_UNIVERSAL_IDENTIFIER,
      ENGAGEMENT_UNIVERSAL_IDENTIFIER,
      LEAD_UNIVERSAL_IDENTIFIER,
      DOCUMENT_UNIVERSAL_IDENTIFIER,
    ].map((objectUniversalIdentifier) => ({
      objectUniversalIdentifier,
      ...READ_WRITE_NO_DELETE,
    })),
    // owners are workspace members; reading them is needed to assign and notify
    {
      objectUniversalIdentifier: workspaceMember.universalIdentifier,
      ...READ_ONLY,
    },
    // without this the key could delete timeline, files and synced mail
    ...withPreset(HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS, READ_ONLY),
  ],
});
