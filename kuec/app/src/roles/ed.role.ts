import { defineRole, SystemPermissionFlag } from 'twenty-sdk/define';

import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { READ_ONLY, withPreset } from './utils/object-permission-presets';
import { TEAM_MEMBER_TOOL_FLAGS } from './utils/permission-flags';

export const ED_ROLE_UNIVERSAL_IDENTIFIER = 'b2d2354f-fec7-4e6f-a5ed-ccef69ebed96';

// Settings are listed rather than granted wholesale, which would also give
// Impersonate, SSO bypass, Billing, Marketplace apps and AI settings. The
// break-glass Admin keeps those (runbooks/13-roles.md).
export default defineRole({
  universalIdentifier: ED_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'ED',
  description:
    'Executive director. All records: read, write, delete, merge, export. Workspace settings, members, roles, data model, workflows, API keys.',
  icon: 'IconCrown',
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
    SystemPermissionFlag.WORKSPACE,
    SystemPermissionFlag.WORKSPACE_MEMBERS,
    SystemPermissionFlag.ROLES,
    SystemPermissionFlag.SECURITY,
    SystemPermissionFlag.DATA_MODEL,
    SystemPermissionFlag.WORKFLOWS,
    SystemPermissionFlag.API_KEYS_AND_WEBHOOKS,
    SystemPermissionFlag.APPLICATIONS,
    SystemPermissionFlag.LAYOUTS,
    SystemPermissionFlag.VIEWS,
    SystemPermissionFlag.EXPORT_CSV,
    ...TEAM_MEMBER_TOOL_FLAGS,
  ],
  // Capability pointers belong to the uVENTURE feed; a correction is made in
  // uVENTURE (runbooks/21-uventure-readiness.md section 4).
  objectPermissions: withPreset([CAPABILITY_UNIVERSAL_IDENTIFIER], READ_ONLY),
});
