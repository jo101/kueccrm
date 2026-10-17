import { defineRole } from 'twenty-sdk/define';

import { buildDepartmentRoleConfig } from './utils/build-department-role';

export const COMMERCIALIZATION_ROLE_UNIVERSAL_IDENTIFIER = 'd7171bd7-af0c-4aad-8350-6c8354b92841';

// The team that takes KU technologies to market and works mostly in uVENTURE;
// its uVENTURE role is in kuec/config/roles/uventure-role-map.json.
export default defineRole(
  buildDepartmentRoleConfig({
    universalIdentifier: COMMERCIALIZATION_ROLE_UNIVERSAL_IDENTIFIER,
    label: 'Commercialization',
    icon: 'IconRocket',
  }),
);
