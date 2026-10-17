import { defineRole } from 'twenty-sdk/define';

import { buildDepartmentRoleConfig } from './utils/build-department-role';

export const LEASING_ROLE_UNIVERSAL_IDENTIFIER = 'dc924d87-981a-4ce0-bafc-ee1a03483f06';

export default defineRole(
  buildDepartmentRoleConfig({
    universalIdentifier: LEASING_ROLE_UNIVERSAL_IDENTIFIER,
    label: 'Leasing',
    icon: 'IconBuildingWarehouse',
  }),
);
