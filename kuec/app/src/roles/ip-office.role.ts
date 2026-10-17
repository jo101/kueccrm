import { defineRole } from 'twenty-sdk/define';

import { buildDepartmentRoleConfig } from './utils/build-department-role';

export const IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER = 'b69517ff-b89d-4c6d-bd66-eaf50cca0661';

export default defineRole(
  buildDepartmentRoleConfig({
    universalIdentifier: IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER,
    label: 'IP office',
    icon: 'IconBulb',
  }),
);
