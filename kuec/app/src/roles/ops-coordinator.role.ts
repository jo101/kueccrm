import { defineRole, SystemPermissionFlag } from 'twenty-sdk/define';

import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { READ_ONLY, withPreset } from './utils/object-permission-presets';
import { TEAM_MEMBER_TOOL_FLAGS } from './utils/permission-flags';

export const OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER = '68ce3927-3689-436e-9170-c297f3fed980';

export default defineRole({
  universalIdentifier: OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Ops coordinator',
  description:
    'All records: read, write, delete, merge, import, export. No settings, no workflows.',
  icon: 'IconClipboardList',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: true,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  permissionFlagUniversalIdentifiers: [
    SystemPermissionFlag.IMPORT_CSV,
    SystemPermissionFlag.EXPORT_CSV,
    ...TEAM_MEMBER_TOOL_FLAGS,
  ],
  // Capability pointers belong to the uVENTURE feed; a correction is made in
  // uVENTURE (runbooks/21-uventure-readiness.md section 4).
  objectPermissions: withPreset([CAPABILITY_UNIVERSAL_IDENTIFIER], READ_ONLY),
});
