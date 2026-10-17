import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SystemPermissionFlag,
} from 'twenty-sdk/define';

import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { LOCKED_FIELDS, toUpdateLocks } from './utils/field-locks';
import {
  NO_ACCESS,
  READ_ONLY,
  withPreset,
} from './utils/object-permission-presets';
import {
  HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
} from './utils/system-objects';

export const LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER = 'e9cd5e6f-57b3-4df7-b304-866c6d5e80b4';

const { opportunity, company, dashboard } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// People, engagements, work packages, tasks, notes, mail and timelines stay
// closed. Company and milestone are opened because the BD Executive dashboard
// charts them and an opportunity row shows its company; neither holds people
// or engagement detail. Capability is opened with Opportunity: a case shows
// the technology it sells.
export default defineRole({
  universalIdentifier: LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Leadership viewer',
  description:
    'Read-only: opportunities, projects, milestones, contracts, companies and the dashboards. No people or engagement detail, no export.',
  icon: 'IconEye',
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  permissionFlagUniversalIdentifiers: [SystemPermissionFlag.PROFILE_INFORMATION],
  objectPermissions: [
    ...withPreset(
      [
        opportunity.universalIdentifier,
        PROJECT_UNIVERSAL_IDENTIFIER,
        CONTRACT_UNIVERSAL_IDENTIFIER,
        dashboard.universalIdentifier,
        company.universalIdentifier,
        MILESTONE_UNIVERSAL_IDENTIFIER,
        CAPABILITY_UNIVERSAL_IDENTIFIER,
      ],
      READ_ONLY,
    ),
    ...withPreset(
      [
        ...RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
        ...HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
      ],
      NO_ACCESS,
    ),
  ],
  fieldPermissions: toUpdateLocks(LOCKED_FIELDS),
});
