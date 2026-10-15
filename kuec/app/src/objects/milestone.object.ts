import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';

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

export default defineObject({
  universalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'milestone',
  namePlural: 'milestones',
  labelSingular: 'Milestone',
  labelPlural: 'Milestones',
  description: 'A dated checkpoint in a project',
  icon: 'IconFlag',
  labelIdentifierFieldMetadataUniversalIdentifier:
    MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
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
      icon: 'IconCalendarDue',
    },
    {
      universalIdentifier: MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'playbookStep',
      label: 'Playbook step',
      icon: 'IconRoute',
      writability: MetadataWritability.APPLICATION,
    },
  ],
});
