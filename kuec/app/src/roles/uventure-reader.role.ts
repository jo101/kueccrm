import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
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

export const UVENTURE_READER_ROLE_UNIVERSAL_IDENTIFIER = '23cf7a97-7e47-4866-a0b6-6761539d596d';

const { opportunity, company, person } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// Behind the uVENTURE API key: the nightly read of signed licence
// opportunities, converted IP licence leads and technology engagements
// (runbooks/21-uventure-readiness.md section 4.3). It writes nothing.
export default defineRole({
  universalIdentifier: UVENTURE_READER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'uVENTURE reader',
  description:
    'Behind the uVENTURE API key only. Reads opportunities, leads, engagements, contracts, capabilities, companies and people. Writes nothing.',
  icon: 'IconPlug',
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
    ...withPreset(
      [
        opportunity.universalIdentifier,
        company.universalIdentifier,
        person.universalIdentifier,
        LEAD_UNIVERSAL_IDENTIFIER,
        ENGAGEMENT_UNIVERSAL_IDENTIFIER,
        CONTRACT_UNIVERSAL_IDENTIFIER,
        CAPABILITY_UNIVERSAL_IDENTIFIER,
      ],
      READ_ONLY,
    ),
    // system objects are open to every role unless closed explicitly
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
