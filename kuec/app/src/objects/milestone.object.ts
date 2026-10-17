import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { fieldDescription, objectDescription } from '../i18n/field-guidance';

export const MILESTONE_UNIVERSAL_IDENTIFIER = '73630005-f4b3-420f-b36b-194de27c0561';

export const MILESTONE_STATUS = {
  OPEN: 'OPEN',
  DONE: 'DONE',
  MISSED: 'MISSED',
} as const;

export type MilestoneStatus =
  (typeof MILESTONE_STATUS)[keyof typeof MILESTONE_STATUS];

export const MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER = '54e47163-9cf6-4a58-b98a-a125a2f3acf6';
export const MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER = 'f9bca525-1873-4a45-aaa5-0fc279b2f55e';
export const MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER = '23e3fafe-99cb-4d9e-b62b-9e6b7d626f3c';
export const MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER = '1e9a7463-8568-4a1c-9344-3c90bcd80398';
export const MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER = '3c335f63-26c1-4b5f-ba71-187f24d39e81';
export const MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = 'b7bf8876-fddb-42d5-8105-f2e25a4ac32e';

export default defineObject({
  universalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'milestone',
  namePlural: 'milestones',
  labelSingular: 'Milestone',
  labelPlural: 'Milestones',
  description: objectDescription('milestone'),
  icon: 'IconFlag',
  labelIdentifierFieldMetadataUniversalIdentifier:
    MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: fieldDescription('milestone.name'),
      icon: 'IconAbc',
    },
    {
      universalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      description: fieldDescription('milestone.status'),
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${MILESTONE_STATUS.OPEN}'`,
      options: [
        { id: 'c5201d0b-e072-4045-9a01-17ea7379aa1b', value: MILESTONE_STATUS.OPEN, label: 'Open', position: 0, color: 'blue' },
        { id: 'd9300027-28e2-4009-8f5b-e3b42d4eb85e', value: MILESTONE_STATUS.DONE, label: 'Done', position: 1, color: 'green' },
        { id: '805e44ac-6442-4fde-8dd5-e36649229b48', value: MILESTONE_STATUS.MISSED, label: 'Missed', position: 2, color: 'red' },
      ],
    },
    {
      universalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'dueAt',
      label: 'Due',
      description: fieldDescription('milestone.dueAt'),
      icon: 'IconCalendarDue',
    },
    {
      universalIdentifier: MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'playbookStep',
      label: 'Playbook step',
      description: fieldDescription('milestone.playbookStep'),
      icon: 'IconRoute',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'department',
      label: 'Department',
      description: fieldDescription('milestone.department'),
      icon: 'IconBuildingCommunity',
      options: [
        { id: 'ec60dfcc-a4eb-4e15-aaca-2847cc02b7cb', value: DEPARTMENT.BD, label: 'Business development', position: 0, color: 'blue' },
        { id: '9316742d-8a11-441f-9f6e-6ab9069f47f0', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
        { id: 'efaa53e2-6c59-4d08-82a2-3c401fd40057', value: DEPARTMENT.IP_OFFICE, label: 'Intellectual property office', position: 2, color: 'purple' },
        { id: '1bc70508-d4cd-43b2-b944-c93ebe57a0fe', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
        { id: '157a5d65-b300-433a-bf80-5a2b696e0082', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
        { id: '3194ff82-2522-4098-b4dd-d32acd78d26b', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
        { id: '761b47a8-d482-4792-bf17-511ab72411ac', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: fieldDescription('milestone.otherDetails'),
      icon: 'IconNotes',
    },
  ],
});
