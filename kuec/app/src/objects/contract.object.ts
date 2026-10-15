import { defineObject, FieldType } from 'twenty-sdk/define';

export const CONTRACT_UNIVERSAL_IDENTIFIER = '2772a608-8b9f-4b96-bf3c-d0e6c963ccff';

export const CONTRACT_KIND = {
  LICENCE: 'LICENCE',
  OPTION: 'OPTION',
  SERVICE: 'SERVICE',
  NDA: 'NDA',
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
      icon: 'IconCategory',
      options: [
        { id: '99bb4bb4-ae56-4149-a233-5caea773e45c', value: CONTRACT_KIND.LICENCE, label: 'Licence', position: 0, color: 'purple' },
        { id: '00731062-2da0-469b-906c-5c2922d887b8', value: CONTRACT_KIND.OPTION, label: 'Option', position: 1, color: 'blue' },
        { id: '3edc589c-adec-49a6-9f04-faf95e0b8e93', value: CONTRACT_KIND.SERVICE, label: 'Service', position: 2, color: 'green' },
        { id: 'd8f29e96-2b84-42b3-957e-c4d98b056a40', value: CONTRACT_KIND.NDA, label: 'NDA', position: 3, color: 'gray' },
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
  ],
});
