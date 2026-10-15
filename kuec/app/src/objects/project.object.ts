import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';

export const PROJECT_UNIVERSAL_IDENTIFIER = 'd172d5bb-e4cf-4518-b874-13fbd4c4ae65';

export const PROJECT_TYPE = {
  WORKSHOP: 'WORKSHOP',
  PROPOSAL: 'PROPOSAL',
  DELIVERY: 'DELIVERY',
} as const;

export type ProjectType = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];

export const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

export const PROJECT_HEALTH = {
  GREEN: 'GREEN',
  AMBER: 'AMBER',
  RED: 'RED',
} as const;

export type ProjectHealth = (typeof PROJECT_HEALTH)[keyof typeof PROJECT_HEALTH];

export const PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER = '7b4d9322-3655-4d44-8df3-d6491d8270fb';
export const PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER = '6ca1027b-490d-427c-9aac-eb942354cf60';
export const PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER = 'aadf97fa-7759-4c22-9310-dffac316c725';
export const PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER = 'd9ae87e2-fd5f-479e-9c61-d8be140679ef';
export const PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER = '3daef18d-7300-4b2b-8564-8d660b61541c';
export const PROJECT_EVENT_DATE_FIELD_UNIVERSAL_IDENTIFIER = 'adf54f24-c7a6-46bc-9f16-314c54dc49fa';
export const PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER = 'b23b9ccd-2f7f-4c99-9bc1-4454e96345cf';
export const PROJECT_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER = '2efd38a1-e54c-4cb1-a1b7-6f741a9bc7e1';
export const PROJECT_CLOSE_TASK_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER = '403de32b-aff4-4cb6-9c9b-1448c2c6fc8a';

// `type` is a reserved field name in Twenty, hence playbookType.
export default defineObject({
  universalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'project',
  namePlural: 'projects',
  labelSingular: 'Project',
  labelPlural: 'Projects',
  description: 'A workshop, proposal or delivery run as milestones and work packages',
  icon: 'IconBriefcase',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'playbookType',
      label: 'Type',
      icon: 'IconCategory',
      options: [
        { id: '4a6834fb-fcd1-4f04-9e1e-2a7d6985e084', value: PROJECT_TYPE.WORKSHOP, label: 'Workshop', position: 0, color: 'purple' },
        { id: '468e18e9-d786-4e18-9a1f-9aef5eabfbba', value: PROJECT_TYPE.PROPOSAL, label: 'Proposal', position: 1, color: 'blue' },
        { id: 'cf88a3a0-9e7f-48bb-8188-a9774356d9d4', value: PROJECT_TYPE.DELIVERY, label: 'Delivery', position: 2, color: 'green' },
      ],
    },
    {
      universalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${PROJECT_STATUS.ACTIVE}'`,
      options: [
        { id: 'cdccdf5a-450b-4830-b6ad-bb61fbf71b5c', value: PROJECT_STATUS.ACTIVE, label: 'Active', position: 0, color: 'blue' },
        { id: '98d49dbe-f990-462e-adcb-28cceadbb6d2', value: PROJECT_STATUS.ON_HOLD, label: 'On hold', position: 1, color: 'orange' },
        { id: '1af55cb8-550c-46fc-a279-08571f7605ac', value: PROJECT_STATUS.DONE, label: 'Done', position: 2, color: 'green' },
        { id: '78e86aba-45a0-4eb7-b1dd-74348895730b', value: PROJECT_STATUS.CANCELLED, label: 'Cancelled', position: 3, color: 'gray' },
      ],
    },
    {
      universalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'health',
      label: 'Health',
      icon: 'IconHeartbeat',
      isNullable: false,
      defaultValue: `'${PROJECT_HEALTH.GREEN}'`,
      writability: MetadataWritability.APPLICATION,
      options: [
        { id: '5bc341cf-f2a6-4994-9906-52f53c06a570', value: PROJECT_HEALTH.GREEN, label: 'Green', position: 0, color: 'green' },
        { id: 'c7ae26c4-a918-4cc3-87ab-35b42ec7f55b', value: PROJECT_HEALTH.AMBER, label: 'Amber', position: 1, color: 'amber' },
        { id: '9e458a1b-408c-4804-8f0c-2b46049fbe71', value: PROJECT_HEALTH.RED, label: 'Red', position: 2, color: 'red' },
      ],
    },
    {
      universalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'percentComplete',
      label: 'Percent complete',
      icon: 'IconPercentage',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: PROJECT_EVENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'eventDate',
      label: 'Event date',
      description: 'Workshop date; the invitation, logistics and run steps are planned back from it',
      icon: 'IconCalendarEvent',
    },
    {
      universalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'endDate',
      label: 'End date',
      description: 'Planned finish of the project',
      icon: 'IconCalendarCheck',
    },
    {
      universalIdentifier: PROJECT_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'playbookApplied',
      label: 'Playbook applied',
      icon: 'IconRoute',
      isNullable: false,
      defaultValue: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: PROJECT_CLOSE_TASK_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'closeTaskCreatedAt',
      label: 'Close task created at',
      icon: 'IconChecklist',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
  ],
});
