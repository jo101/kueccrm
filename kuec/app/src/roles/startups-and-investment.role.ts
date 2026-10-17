import { defineRole } from 'twenty-sdk/define';

import { buildDepartmentRoleConfig } from './utils/build-department-role';

export const STARTUPS_AND_INVESTMENT_ROLE_UNIVERSAL_IDENTIFIER = '4d069939-dbea-4965-a3eb-b62f7c3d7a06';

export default defineRole(
  buildDepartmentRoleConfig({
    universalIdentifier: STARTUPS_AND_INVESTMENT_ROLE_UNIVERSAL_IDENTIFIER,
    label: 'Startups and investment',
    icon: 'IconRocket',
  }),
);
