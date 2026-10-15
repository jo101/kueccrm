import { defineObject, FieldType } from 'twenty-sdk/define';

export const PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER = '33bc6d9b-d3e5-4ec1-b705-d3941c84cdc8';

// Keys match the roles in playbooks/templates.json.
export const PLAYBOOK_ROLE = {
  ED: 'ED',
  BD_OFFICER: 'BD_OFFICER',
  OPS_COORDINATOR: 'OPS_COORDINATOR',
  DATA_ANALYST: 'DATA_ANALYST',
  DEVELOPER: 'DEVELOPER',
  RESEARCHER: 'RESEARCHER',
  LEGAL: 'LEGAL',
  FINANCE: 'FINANCE',
} as const;

export type PlaybookRole = (typeof PLAYBOOK_ROLE)[keyof typeof PLAYBOOK_ROLE];

export const PLAYBOOK_ROLE_ASSIGNMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER = '4862d88c-966b-4922-bfa7-f7baf68d6107';

export default defineObject({
  universalIdentifier: PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'playbookRoleAssignment',
  namePlural: 'playbookRoleAssignments',
  labelSingular: 'Playbook role assignment',
  labelPlural: 'Playbook role assignments',
  description:
    'Who fills each playbook role. Work packages go to the least-loaded member of the role; the ED and ops coordinator are read from here.',
  icon: 'IconUsersGroup',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PLAYBOOK_ROLE_ASSIGNMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PLAYBOOK_ROLE_ASSIGNMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: 'fc03cd95-9f0a-4978-8777-e9e6f2ff0d91',
      type: FieldType.SELECT,
      name: 'playbookRole',
      label: 'Playbook role',
      icon: 'IconUserCog',
      options: [
        { id: 'ddb07173-d4ce-409c-b01c-401273c897aa', value: PLAYBOOK_ROLE.ED, label: 'ED', position: 0, color: 'red' },
        { id: 'c7657083-3d1b-4c64-8b3f-81d2d1d465f4', value: PLAYBOOK_ROLE.BD_OFFICER, label: 'BD officer', position: 1, color: 'blue' },
        { id: '2976be01-9241-4ed8-a4e4-8985b2af5d18', value: PLAYBOOK_ROLE.OPS_COORDINATOR, label: 'Ops coordinator', position: 2, color: 'orange' },
        { id: 'd713272f-e6a3-453b-8b09-1eddfe6f191d', value: PLAYBOOK_ROLE.DATA_ANALYST, label: 'Data analyst', position: 3, color: 'turquoise' },
        { id: '7231131e-396b-41e4-aaae-61336a84c6a4', value: PLAYBOOK_ROLE.DEVELOPER, label: 'Developer', position: 4, color: 'green' },
        { id: 'aca0d255-52b1-4906-a9d3-a2ecaf3e3ec4', value: PLAYBOOK_ROLE.RESEARCHER, label: 'Researcher', position: 5, color: 'purple' },
        { id: 'fa0e5d91-58d3-4ccd-bcc0-9e52c477b5f7', value: PLAYBOOK_ROLE.LEGAL, label: 'Legal', position: 6, color: 'gray' },
        { id: 'cc3e7080-7bbe-464b-8183-cb60cc012360', value: PLAYBOOK_ROLE.FINANCE, label: 'Finance', position: 7, color: 'yellow' },
      ],
    },
    {
      universalIdentifier: '08b259d2-246f-439a-af9e-352df08fec43',
      type: FieldType.BOOLEAN,
      name: 'isActive',
      label: 'Active',
      icon: 'IconToggleRight',
      isNullable: false,
      defaultValue: true,
    },
  ],
});
