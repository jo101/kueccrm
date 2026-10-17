import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SystemPermissionFlag,
} from 'twenty-sdk/define';

import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../../objects/engagement.object';
import { LOCKED_FIELDS, toUpdateLocks } from './field-locks';
import {
  READ_ONLY,
  READ_WRITE_DELETE,
  READ_WRITE_NO_DELETE,
  withPreset,
} from './object-permission-presets';
import { TEAM_MEMBER_TOOL_FLAGS } from './permission-flags';
import {
  HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
} from './system-objects';

const { opportunity, task, note } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// The commercialization departments share one permission set and keep a role
// each, so they can diverge without moving anyone. Lead and Document are not
// objects yet; add them here when they are (runbooks/13-roles.md section 4).
export const DEPARTMENT_WRITABLE_OBJECT_UNIVERSAL_IDENTIFIERS = [
  opportunity.universalIdentifier,
  task.universalIdentifier,
  note.universalIdentifier,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
];

export const buildDepartmentRoleConfig = ({
  universalIdentifier,
  label,
  icon,
}: {
  universalIdentifier: string;
  label: string;
  icon: string;
}) => ({
  universalIdentifier,
  label,
  description: `${label} department. Reads everything. Writes opportunities, engagements, tasks and notes. No delete, no import, no settings, no workflows.`,
  icon,
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
    ...withPreset(DEPARTMENT_WRITABLE_OBJECT_UNIVERSAL_IDENTIFIERS, READ_WRITE_NO_DELETE),
    ...withPreset(RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS, READ_WRITE_DELETE),
    ...withPreset(HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS, READ_ONLY),
  ],
  fieldPermissions: toUpdateLocks(LOCKED_FIELDS),
});
