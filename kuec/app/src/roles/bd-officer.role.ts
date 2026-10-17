import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SystemPermissionFlag,
} from 'twenty-sdk/define';

import { DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/depends-on-on-work-package.field';
import { MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/milestone-on-work-package.field';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-work-package.field';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/reviewer-on-work-package.field';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import {
  WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';
import { LOCKED_FIELDS, toUpdateLocks } from './utils/field-locks';
import {
  READ_ONLY,
  READ_WRITE_DELETE,
  READ_WRITE_NO_DELETE,
  withPreset,
} from './utils/object-permission-presets';
import { TEAM_MEMBER_TOOL_FLAGS } from './utils/permission-flags';
import {
  HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
} from './utils/system-objects';

export const BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER = '076a7c33-d5fe-4944-9a31-77eabc22ee18';

const { opportunity, company, person, task, note } =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// On a work package a BD officer changes Status (accept, submit, block,
// decline, done), the reasons that go with it and Accepted at, which the work
// package card writes with Accepted. Notes are attached through Notes, not a
// field. Everything else is planned by the playbook or the ops coordinator.
export const BD_OFFICER_LOCKED_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIERS = [
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
];

export default defineRole({
  universalIdentifier: BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'BD officer',
  description:
    'Reads everything. Writes opportunities, engagements, companies, people, tasks, notes, and the status of work packages. No delete, no merge, no import, no settings, no workflows.',
  icon: 'IconBriefcase',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  permissionFlagUniversalIdentifiers: [
    SystemPermissionFlag.EXPORT_CSV,
    ...TEAM_MEMBER_TOOL_FLAGS,
  ],
  objectPermissions: [
    ...withPreset(
      [
        opportunity.universalIdentifier,
        company.universalIdentifier,
        person.universalIdentifier,
        task.universalIdentifier,
        note.universalIdentifier,
        ENGAGEMENT_UNIVERSAL_IDENTIFIER,
        WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      ],
      READ_WRITE_NO_DELETE,
    ),
    ...withPreset(RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS, READ_WRITE_DELETE),
    ...withPreset(HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS, READ_ONLY),
  ],
  fieldPermissions: [
    ...toUpdateLocks(LOCKED_FIELDS),
    ...toUpdateLocks(
      BD_OFFICER_LOCKED_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIERS.map(
        (fieldUniversalIdentifier) => ({
          objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
          fieldUniversalIdentifier,
        }),
      ),
    ),
  ],
});
