import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { fieldDescription } from '../i18n/field-guidance';

export const DEPARTMENT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '242b828b-4399-4a37-8c41-da9d4fa26f41';

// runbooks/16-integration-map.md section 11.2, item 10; a lead's department
// is copied here at conversion.
export default defineField({
  universalIdentifier: DEPARTMENT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'department',
  label: 'Department',
  description: fieldDescription('opportunity.department'),
  icon: 'IconBuildingCommunity',
  options: [
    { id: '50dba102-b979-426f-89b4-661b26238275', value: DEPARTMENT.BD, label: 'Business development', position: 0, color: 'blue' },
    { id: '99212028-5091-433f-9e81-7f3622c3ddb4', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
    { id: '64f0158d-7bb0-4e39-88a9-b056ee25205d', value: DEPARTMENT.IP_OFFICE, label: 'Intellectual property office', position: 2, color: 'purple' },
    { id: '03f5bd29-6b7d-42b8-ba88-1fe03df92fb3', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
    { id: 'e4243299-1ac2-48b4-bd1d-c90744bbc55e', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
    { id: 'd2e303c1-6f1d-4028-9cd3-29ff343dbbd3', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
    { id: 'b51027bb-89dd-4e2c-acc0-6be5a350ea19', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
  ],
});
