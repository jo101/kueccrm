import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { COMPANY_SECTOR } from '../fields/sector-on-company.field';
import { COMPANY_SIZE_CLASS } from '../fields/size-class-on-company.field';
import { OPPORTUNITY_OFFERING } from '../fields/offering-on-opportunity.field';
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

// Mirrors CAMPAIGN_CHANNEL in kuec/playbooks/lookups.json.
export const CAMPAIGN_CHANNEL = {
  EMAIL_SEQUENCE: 'EMAIL_SEQUENCE',
  LINKEDIN: 'LINKEDIN',
  EVENT_OR_EXHIBITION: 'EVENT_OR_EXHIBITION',
  WORKSHOP: 'WORKSHOP',
  WEBSITE: 'WEBSITE',
  DIRECT_VISIT: 'DIRECT_VISIT',
  PARTNER_REFERRAL: 'PARTNER_REFERRAL',
  OTHER: 'OTHER',
} as const;

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
export const PROJECT_TARGET_SECTOR_FIELD_UNIVERSAL_IDENTIFIER = '31d3e99a-03ee-4ad2-b8d4-9801f7fb2e2e';
export const PROJECT_TARGET_SIZE_CLASS_FIELD_UNIVERSAL_IDENTIFIER = '1ab18643-c509-4b27-a831-8c3f437bd2fc';
export const PROJECT_TARGET_OFFERING_FIELD_UNIVERSAL_IDENTIFIER = '71edb372-7128-42ae-9881-222d8fd8779b';
export const PROJECT_CHANNEL_PLAN_FIELD_UNIVERSAL_IDENTIFIER = '5987519e-1b7c-4b63-a467-81b895eadc9f';

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
    // The go-to-market campaign fields (GTM pack, runbooks/21-uventure-readiness.md
    // section 5.3). Sector and offering mirror their lookups.json lists, size
    // class mirrors Company > Size class, so G1 can match companies on them.
    {
      universalIdentifier: PROJECT_TARGET_SECTOR_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'targetSector',
      label: 'Target sector',
      description: fieldDescription('project.targetSector'),
      icon: 'IconBuildingFactory2',
      options: [
        { id: 'f630051b-a92f-4b6c-92ea-2fe7d3be1f98', value: COMPANY_SECTOR.OIL_AND_GAS, label: 'Oil and gas', position: 0, color: 'orange' },
        { id: '00ad7571-0e6b-43f6-9a73-7e07aafe9ffd', value: COMPANY_SECTOR.ENERGY_AND_UTILITIES, label: 'Energy and utilities', position: 1, color: 'yellow' },
        { id: '9a0fb2d3-b71e-436c-9fa4-55dbc0facf4a', value: COMPANY_SECTOR.DEFENCE_AND_SECURITY, label: 'Defence and security', position: 2, color: 'red' },
        { id: '87e988f6-cad6-4d39-a793-1f2dacbdbdca', value: COMPANY_SECTOR.AEROSPACE, label: 'Aerospace', position: 3, color: 'sky' },
        { id: 'e06aa8b5-8e3c-4288-9238-71b27c312e8a', value: COMPANY_SECTOR.HEALTHCARE, label: 'Healthcare and life sciences', position: 4, color: 'green' },
        { id: '981f38d8-b811-4f37-b1db-43aa1bf3dc36', value: COMPANY_SECTOR.ICT, label: 'Information technology, telecoms and digital', position: 5, color: 'blue' },
        { id: '4c636a72-7d60-43e0-9829-d66082f83dc4', value: COMPANY_SECTOR.MANUFACTURING, label: 'Advanced manufacturing', position: 6, color: 'purple' },
        { id: '44ceb2fb-4d0d-4ff9-84a6-ec7bcca86f96', value: COMPANY_SECTOR.TRANSPORT_AND_LOGISTICS, label: 'Transport and logistics', position: 7, color: 'turquoise' },
        { id: 'f7c9b583-6ba4-47dd-9a00-7c5636fd7a02', value: COMPANY_SECTOR.GOVERNMENT, label: 'Government', position: 8, color: 'pink' },
        { id: '1f0ddcbe-a770-4c27-9217-2cb45f10e58e', value: COMPANY_SECTOR.OTHER, label: 'Other', position: 9, color: 'gray' },
      ],
    },
    {
      universalIdentifier: PROJECT_TARGET_SIZE_CLASS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'targetSizeClass',
      label: 'Target size class',
      description: fieldDescription('project.targetSizeClass'),
      icon: 'IconRuler2',
      options: [
        { id: '7b012e88-6a41-4748-bc4c-6e23939d2db3', value: COMPANY_SIZE_CLASS.STARTUP, label: 'Startup', position: 0, color: 'pink' },
        { id: 'f31cedb8-cca3-45fb-acb3-6c0026ed86ad', value: COMPANY_SIZE_CLASS.SME, label: 'Small or medium business', position: 1, color: 'blue' },
        { id: 'ae29d4da-2200-45ec-b2c6-ef696872cbe0', value: COMPANY_SIZE_CLASS.LARGE_ENTERPRISE, label: 'Large enterprise', position: 2, color: 'purple' },
        { id: '64787e76-f56d-4e7e-b9d8-1d3ab05bbdf5', value: COMPANY_SIZE_CLASS.GOVERNMENT, label: 'Government or semi-government', position: 3, color: 'green' },
      ],
    },
    {
      universalIdentifier: PROJECT_TARGET_OFFERING_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.MULTI_SELECT,
      name: 'targetOffering',
      label: 'Offering promoted',
      description: fieldDescription('project.targetOffering'),
      icon: 'IconPackages',
      options: [
        { id: '865ec15d-7b54-4a5f-83fe-c72ce44aa659', value: OPPORTUNITY_OFFERING.IP_LICENCE, label: 'Intellectual property licence', position: 0, color: 'blue' },
        { id: '4aa65944-c7d2-4a94-93c1-aabedd0b144a', value: OPPORTUNITY_OFFERING.TECHNICAL_SERVICE, label: 'Technical service', position: 1, color: 'green' },
        { id: '4d78fd78-016c-4a00-a71e-dde515711a75', value: OPPORTUNITY_OFFERING.LAB_TESTING, label: 'Lab testing', position: 2, color: 'purple' },
        { id: 'a64d590e-2fef-48a8-a477-e6b6b63bb49e', value: OPPORTUNITY_OFFERING.EQUIPMENT_ACCESS, label: 'Equipment access', position: 3, color: 'orange' },
        { id: '0eab5fa6-1f04-4b2b-81ef-e4d55ed3fd39', value: OPPORTUNITY_OFFERING.RESEARCH_COLLABORATION, label: 'Research collaboration', position: 4, color: 'turquoise' },
        { id: 'cce1b44c-1f6c-483e-9b51-22f4448999f6', value: OPPORTUNITY_OFFERING.STARTUP_PRODUCT, label: 'Startup product', position: 5, color: 'pink' },
        { id: 'acb2bb71-e73a-410f-aa89-fc99aa899924', value: OPPORTUNITY_OFFERING.SUBSIDIARY_SERVICE, label: 'Subsidiary service', position: 6, color: 'sky' },
        { id: '873cda04-216d-4b08-9731-a481d9f7739b', value: OPPORTUNITY_OFFERING.SPONSORED_CHAIR, label: 'Sponsored chair', position: 7, color: 'amber' },
        { id: 'ea029004-6109-4f1a-bf63-73d929b64988', value: OPPORTUNITY_OFFERING.LEASING, label: 'Leasing', position: 8, color: 'red' },
        { id: '36a5609f-990a-4d50-8c75-979b1ac8081b', value: OPPORTUNITY_OFFERING.TRAINING, label: 'Training', position: 9, color: 'violet' },
        { id: '3bff3a8a-783d-47f4-ba45-adeb45cd5bcc', value: OPPORTUNITY_OFFERING.ADVISORY, label: 'Advisory', position: 10, color: 'jade' },
        { id: '9478041b-b4c6-43cf-be32-cfed19db93ad', value: OPPORTUNITY_OFFERING.OTHER, label: 'Other', position: 11, color: 'gray' },
      ],
    },
    {
      universalIdentifier: PROJECT_CHANNEL_PLAN_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.MULTI_SELECT,
      name: 'channelPlan',
      label: 'Channel plan',
      description: fieldDescription('project.channelPlan'),
      icon: 'IconSpeakerphone',
      options: [
        { id: '73ed11c1-e068-4179-98f7-612948d8650d', value: CAMPAIGN_CHANNEL.EMAIL_SEQUENCE, label: 'Email sequence', position: 0, color: 'blue' },
        { id: 'f14ba733-bcf7-444c-aa29-5fc13fbda989', value: CAMPAIGN_CHANNEL.LINKEDIN, label: 'LinkedIn', position: 1, color: 'sky' },
        { id: 'c374ee71-b957-41e2-b1b9-e35c2cdbdd8b', value: CAMPAIGN_CHANNEL.EVENT_OR_EXHIBITION, label: 'Event or exhibition', position: 2, color: 'red' },
        { id: '82ec8995-c05e-4413-839a-6779f32d9e43', value: CAMPAIGN_CHANNEL.WORKSHOP, label: 'Workshop', position: 3, color: 'amber' },
        { id: 'cd40ac77-6def-4871-8ae9-cddf065316da', value: CAMPAIGN_CHANNEL.WEBSITE, label: 'Website', position: 4, color: 'green' },
        { id: '76c170ca-47f4-4422-ac7e-fa34e1fa8d94', value: CAMPAIGN_CHANNEL.DIRECT_VISIT, label: 'Direct visit', position: 5, color: 'purple' },
        { id: '529d5162-4964-4cb1-a2d8-4dbb145957ae', value: CAMPAIGN_CHANNEL.PARTNER_REFERRAL, label: 'Partner referral', position: 6, color: 'pink' },
        { id: '363c5442-2839-4019-aace-3458376f2a2c', value: CAMPAIGN_CHANNEL.OTHER, label: 'Other', position: 7, color: 'gray' },
      ],
    },
  ],
});
