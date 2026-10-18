import { defineApplicationRole } from 'twenty-sdk/define';

export const SPIKE_DEFAULT_ROLE_UNIVERSAL_IDENTIFIER = 'a6c4e8b2-3d1f-4f9a-8e7c-5b2d0a9f6c13';

export default defineApplicationRole({
  universalIdentifier: SPIKE_DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'KUEC Mantine spike role',
  description: 'Default role of the throwaway spike app',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canBeAssignedToAgents: false,
  canBeAssignedToUsers: false,
  canBeAssignedToApiKeys: false,
});
