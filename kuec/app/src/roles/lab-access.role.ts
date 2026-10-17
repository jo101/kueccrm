import { defineRole } from 'twenty-sdk/define';

import { buildDepartmentRoleConfig } from './utils/build-department-role';

export const LAB_ACCESS_ROLE_UNIVERSAL_IDENTIFIER = '3c966902-6644-429c-b98e-0f92a1633a95';

export default defineRole(
  buildDepartmentRoleConfig({
    universalIdentifier: LAB_ACCESS_ROLE_UNIVERSAL_IDENTIFIER,
    label: 'Lab access',
    icon: 'IconFlask',
  }),
);
