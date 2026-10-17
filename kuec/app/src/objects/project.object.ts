import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { fieldDescription, objectDescription } from '../i18n/field-guidance';

export const PROJECT_UNIVERSAL_IDENTIFIER = 'd172d5bb-e4cf-4518-b874-13fbd4c4ae65';

export const PROJECT_TYPE = {
  DELIVERY: 'DELIVERY',
  INITIATIVE: 'INITIATIVE',
  WORKSHOP: 'WORKSHOP',
  PROPOSAL: 'PROPOSAL',
  GTM_CAMPAIGN: 'GTM_CAMPAIGN',
  ACCOUNT_PLAN: 'ACCOUNT_PLAN',
  PROGRAMME_COHORT: 'PROGRAMME_COHORT',
  INTERNAL: 'INTERNAL',
  OTHER: 'OTHER',
} as const;

export type ProjectType = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];

// The types with a template in playbooks/project-templates.json; W9 skips the rest.
export const PROJECT_TEMPLATE_TYPE = {
  WORKSHOP: 'WORKSHOP',
  PROPOSAL: 'PROPOSAL',
  DELIVERY: 'DELIVERY',
} as const;

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
export const PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER = 'ab72807f-922e-4dc1-910c-58fece53d153';
export const PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = 'e57ca1a2-a2cf-456c-80f8-16a01832ce28';

// `type` is a reserved field name in Twenty, hence playbookType.
export default defineObject({
  universalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'project',
  namePlural: 'projects',
  labelSingular: 'Project',
  labelPlural: 'Projects',
  description: objectDescription('project'),
  icon: 'IconBriefcase',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: fieldDescription('project.name'),
      icon: 'IconAbc',
    },
    {
      universalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'playbookType',
      label: 'Type',
      description: fieldDescription('project.playbookType'),
      icon: 'IconCategory',
      options: [
        { id: 'cf88a3a0-9e7f-48bb-8188-a9774356d9d4', value: PROJECT_TYPE.DELIVERY, label: 'Delivery', position: 0, color: 'green' },
        { id: '541fa162-9513-44ea-85be-54996c37bda2', value: PROJECT_TYPE.INITIATIVE, label: 'Initiative', position: 1, color: 'orange' },
        { id: '4a6834fb-fcd1-4f04-9e1e-2a7d6985e084', value: PROJECT_TYPE.WORKSHOP, label: 'Workshop', position: 2, color: 'purple' },
        { id: '468e18e9-d786-4e18-9a1f-9aef5eabfbba', value: PROJECT_TYPE.PROPOSAL, label: 'Proposal', position: 3, color: 'blue' },
        { id: '7251c568-7482-4060-84a2-ef047193bf2f', value: PROJECT_TYPE.GTM_CAMPAIGN, label: 'Go-to-market campaign', position: 4, color: 'turquoise' },
        { id: '75fe3608-2b2c-4cf0-a8d3-0f98a70d895b', value: PROJECT_TYPE.ACCOUNT_PLAN, label: 'Account plan', position: 5, color: 'pink' },
        { id: 'cf8fcf3c-0246-4f82-8655-932d1bd66702', value: PROJECT_TYPE.PROGRAMME_COHORT, label: 'Programme cohort', position: 6, color: 'sky' },
        { id: '5d5d3e17-b7c4-48b1-bfb1-27dd955d0547', value: PROJECT_TYPE.INTERNAL, label: 'Internal', position: 7, color: 'amber' },
        { id: '4c7b6159-0378-41e3-a977-3ede82f39978', value: PROJECT_TYPE.OTHER, label: 'Other', position: 8, color: 'gray' },
      ],
    },
    {
      universalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      description: fieldDescription('project.status'),
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
      description: fieldDescription('project.health'),
      icon: 'IconHeartbeat',
      isNullable: false,
      defaultValue: `'${PROJECT_HEALTH.GREEN}'`,
      writability: MetadataWritability.APPLICATION,
      options: [
        { id: '5bc341cf-f2a6-4994-9906-52f53c06a570', value: PROJECT_HEALTH.GREEN, label: 'Green (on track)', position: 0, color: 'green' },
        { id: 'c7ae26c4-a918-4cc3-87ab-35b42ec7f55b', value: PROJECT_HEALTH.AMBER, label: 'Amber (at risk)', position: 1, color: 'amber' },
        { id: '9e458a1b-408c-4804-8f0c-2b46049fbe71', value: PROJECT_HEALTH.RED, label: 'Red (off track)', position: 2, color: 'red' },
      ],
    },
    {
      universalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'percentComplete',
      label: 'Percent complete',
      description: fieldDescription('project.percentComplete'),
      icon: 'IconPercentage',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: PROJECT_EVENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'eventDate',
      label: 'Event date',
      description: fieldDescription('project.eventDate'),
      icon: 'IconCalendarEvent',
    },
    {
      universalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'endDate',
      label: 'End date',
      description: fieldDescription('project.endDate'),
      icon: 'IconCalendarCheck',
    },
    {
      universalIdentifier: PROJECT_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'playbookApplied',
      label: 'Playbook applied',
      description: fieldDescription('project.playbookApplied'),
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
      description: fieldDescription('project.closeTaskCreatedAt'),
      icon: 'IconChecklist',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
    {
      universalIdentifier: PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'department',
      label: 'Department',
      description: fieldDescription('project.department'),
      icon: 'IconBuildingCommunity',
      options: [
        { id: '6f16a1d8-c411-4d6b-b912-f91406ec30f9', value: DEPARTMENT.BD, label: 'Business development', position: 0, color: 'blue' },
        { id: '29fb9bff-1fe4-4d91-99cf-ed4c0121f4ca', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
        { id: '9e1dcd3b-896a-4aa7-8b52-177b22fe8dd2', value: DEPARTMENT.IP_OFFICE, label: 'Intellectual property office', position: 2, color: 'purple' },
        { id: '3fafa17f-bb74-47b7-a4b4-a08d7373b17b', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
        { id: 'fad80e02-a938-43fb-be0f-e5f2af7b35c5', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
        { id: '65979abb-d261-48df-a372-5c2998a0b48c', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
        { id: 'eb84960e-874d-4296-9932-669f58d58e6c', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: fieldDescription('project.otherDetails'),
      icon: 'IconNotes',
    },
  ],
});
