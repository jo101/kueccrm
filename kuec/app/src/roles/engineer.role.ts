import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SystemPermissionFlag,
} from 'twenty-sdk/define';

import { LOCKED_FIELDS, toUpdateLocks } from './utils/field-locks';
import {
  READ_ONLY,
  READ_WRITE_NO_DELETE,
  withPreset,
} from './utils/object-permission-presets';
import { TEAM_MEMBER_TOOL_FLAGS } from './utils/permission-flags';
import {
  HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
} from './utils/system-objects';

export const ENGINEER_ROLE_UNIVERSAL_IDENTIFIER = '6aee78fc-1d03-4428-a948-7fb653d3f5ca';

// No Roles, Members, API keys or Security: each of them lets the holder give
// themselves or a key business-data write. Tests that need writes run on the
// staging instance (runbooks/01-deploy.md section 11).
export default defineRole({
  universalIdentifier: ENGINEER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Engineer',
  description:
    'Data model, workflows, apps, layouts and views. Reads all records, writes none in production; tests run on staging.',
  icon: 'IconCode',
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
    SystemPermissionFlag.WORKSPACE,
    SystemPermissionFlag.DATA_MODEL,
    SystemPermissionFlag.WORKFLOWS,
    SystemPermissionFlag.APPLICATIONS,
    SystemPermissionFlag.LAYOUTS,
    SystemPermissionFlag.VIEWS,
    // publishing the app uploads its build
    SystemPermissionFlag.UPLOAD_FILE,
    ...TEAM_MEMBER_TOOL_FLAGS,
  ],
  objectPermissions: [
    // dashboards are layout, not business data
    ...withPreset(
      [STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard.universalIdentifier],
      READ_WRITE_NO_DELETE,
    ),
    ...withPreset(
      [
        ...RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
        ...HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
      ],
      READ_ONLY,
    ),
  ],
  fieldPermissions: toUpdateLocks(LOCKED_FIELDS),
});
