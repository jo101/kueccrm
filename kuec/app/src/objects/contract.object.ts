import { defineObject, FieldType } from 'twenty-sdk/define';
import {
  DEPARTMENT,
  OTHER_DETAILS_FIELD_DESCRIPTION,
} from '../constants/taxonomy';

export const CONTRACT_UNIVERSAL_IDENTIFIER = '2772a608-8b9f-4b96-bf3c-d0e6c963ccff';

export const CONTRACT_KIND = {
  NDA: 'NDA',
  MOU: 'MOU',
  MSA: 'MSA',
  LICENCE: 'LICENCE',
  TSA: 'TSA',
  JDA: 'JDA',
  SPONSORSHIP: 'SPONSORSHIP',
  LEASING: 'LEASING',
  CONSULTING: 'CONSULTING',
  OPTION: 'OPTION',
  SERVICE: 'SERVICE',
  OTHER: 'OTHER',
} as const;

export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  IN_NEGOTIATION: 'IN_NEGOTIATION',
  SIGNED: 'SIGNED',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
} as const;

export const CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER = '5a1bd926-3d31-4e7b-bb69-9a67ec830ba6';
export const CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER = 'b99b5d8f-cea5-4647-a8ae-22fcca037545';
export const CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '7f4502ab-5493-4b76-b0bc-797792aa49fd';
export const CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER = '8570c6ca-ed9f-4d89-984a-da417433fc86';
export const CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER = 'b469fe7a-c7f1-439d-b8e8-6d5d4906ed22';
export const CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER = '9378d767-b8f4-4555-a22c-c2709d326e02';
export const CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER = '90c8581b-2644-4bdc-9fe2-874b3d334058';
export const CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER = '64b57543-9069-458c-b583-9190619a8d14';
export const CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = '58e0e677-440d-442e-8115-9e9b938cd461';

// Metadata only: the executed document lives on SharePoint, never in Twenty.
export default defineObject({
  universalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'contract',
  namePlural: 'contracts',
  labelSingular: 'Contract',
  labelPlural: 'Contracts',
  description: 'Contract metadata: counterparty, kind, status, key dates, value, owner',
  icon: 'IconFileCertificate',
  labelIdentifierFieldMetadataUniversalIdentifier:
    CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'kind',
      label: 'Kind',
      description: 'What sort of agreement it is',
      icon: 'IconCategory',
      // 2026-10-17: Option and Service deprecated for the KUEC taxonomy
      // (runbooks/18-taxonomy.md); kept so existing contracts keep their value.
      options: [
        { id: 'd8f29e96-2b84-42b3-957e-c4d98b056a40', value: CONTRACT_KIND.NDA, label: 'NDA', position: 0, color: 'gray' },
        { id: 'cef7b051-cece-496b-94e8-76ab5ee23904', value: CONTRACT_KIND.MOU, label: 'MoU', position: 1, color: 'orange' },
        { id: '98a150ad-3e4b-414c-80ba-22c070b5fdce', value: CONTRACT_KIND.MSA, label: 'MSA', position: 2, color: 'turquoise' },
        { id: '99bb4bb4-ae56-4149-a233-5caea773e45c', value: CONTRACT_KIND.LICENCE, label: 'Licence', position: 3, color: 'purple' },
        { id: 'a3da7347-e123-46f1-9601-ecee3aec9b6f', value: CONTRACT_KIND.TSA, label: 'TSA', position: 4, color: 'pink' },
        { id: '766fbd67-fc9b-4df1-ba0d-be0005b448a0', value: CONTRACT_KIND.JDA, label: 'JDA', position: 5, color: 'sky' },
        { id: '60d35cc6-688b-4118-9074-4d5951f5b444', value: CONTRACT_KIND.SPONSORSHIP, label: 'Sponsorship', position: 6, color: 'amber' },
        { id: 'f2fe046f-1c1a-422f-8cab-7a3d950b4c0f', value: CONTRACT_KIND.LEASING, label: 'Leasing', position: 7, color: 'red' },
        { id: 'f0fe67e5-2fad-49e2-9c97-8d8e74af6924', value: CONTRACT_KIND.CONSULTING, label: 'Consulting', position: 8, color: 'violet' },
        { id: '00731062-2da0-469b-906c-5c2922d887b8', value: CONTRACT_KIND.OPTION, label: 'Option (deprecated)', position: 9, color: 'gray' },
        { id: '3edc589c-adec-49a6-9f04-faf95e0b8e93', value: CONTRACT_KIND.SERVICE, label: 'Service (deprecated)', position: 10, color: 'gray' },
        { id: '27bbab6f-1bb8-4dee-a958-d9192e4a5c56', value: CONTRACT_KIND.OTHER, label: 'Other', position: 11, color: 'gray' },
      ],
    },
    {
      universalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${CONTRACT_STATUS.DRAFT}'`,
      options: [
        { id: '6bfd715b-81a7-430f-b78c-36f1daefa41d', value: CONTRACT_STATUS.DRAFT, label: 'Draft', position: 0, color: 'gray' },
        { id: '58cf2daf-1906-4176-b4af-6bc41cd07b16', value: CONTRACT_STATUS.IN_NEGOTIATION, label: 'In negotiation', position: 1, color: 'orange' },
        { id: '6956378b-af64-48fa-b37b-f2f20370ed90', value: CONTRACT_STATUS.SIGNED, label: 'Signed', position: 2, color: 'green' },
        { id: '39ea4c88-c58b-4649-9135-64b8b94728af', value: CONTRACT_STATUS.EXPIRED, label: 'Expired', position: 3, color: 'gray' },
        { id: '3a345ebf-1261-4476-8528-948a5d7bc32d', value: CONTRACT_STATUS.TERMINATED, label: 'Terminated', position: 4, color: 'red' },
      ],
    },
    {
      universalIdentifier: CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'signedOn',
      label: 'Signed on',
      icon: 'IconSignature',
    },
    {
      universalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'expiresOn',
      label: 'Expires on',
      icon: 'IconCalendarX',
    },
    {
      universalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.CURRENCY,
      name: 'value',
      label: 'Value',
      icon: 'IconCurrencyDollar',
    },
    {
      universalIdentifier: CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.LINKS,
      name: 'sharepointFolder',
      label: 'SharePoint folder',
      icon: 'IconFolder',
    },
    {
      universalIdentifier: CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'department',
      label: 'Department',
      description: 'The KUEC department that leads this record',
      icon: 'IconBuildingCommunity',
      options: [
        { id: '44d66470-5ee2-40a6-9ffa-93c26d4b8726', value: DEPARTMENT.BD, label: 'BD', position: 0, color: 'blue' },
        { id: '5fd5ff71-d76b-4562-a098-6f3557b79c18', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
        { id: 'bdbc889d-c5d4-417e-8778-faba65bca1fb', value: DEPARTMENT.IP_OFFICE, label: 'IP office', position: 2, color: 'purple' },
        { id: '1931befd-cd97-49c7-8f1b-cd535810e227', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
        { id: '7016fb4b-c1b9-436d-b121-0d059b401753', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
        { id: 'dc09cf60-802e-4293-afae-13c8d2949ecf', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
        { id: 'bf236a23-8fc0-4526-bc76-74e6f7317332', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: OTHER_DETAILS_FIELD_DESCRIPTION,
      icon: 'IconNotes',
    },
  ],
});
