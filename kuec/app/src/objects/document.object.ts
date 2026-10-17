import { defineObject, FieldType } from 'twenty-sdk/define';
import { OTHER_DETAILS_FIELD_DESCRIPTION } from '../constants/taxonomy';

export const DOCUMENT_UNIVERSAL_IDENTIFIER = '95041ec6-2717-4502-912c-fc0bc69b6e0d';

export const DOCUMENT_TYPE = {
  NDA: 'NDA',
  MOU: 'MOU',
  MSA: 'MSA',
  PROPOSAL_OR_SOW: 'PROPOSAL_OR_SOW',
  QUOTE: 'QUOTE',
  RFQ_OR_RFP_RECEIVED: 'RFQ_OR_RFP_RECEIVED',
  TECHNICAL_ASSESSMENT_REPORT: 'TECHNICAL_ASSESSMENT_REPORT',
  TERM_SHEET: 'TERM_SHEET',
  LICENCE_AGREEMENT: 'LICENCE_AGREEMENT',
  TSA: 'TSA',
  JDA: 'JDA',
  SPONSORSHIP_AGREEMENT: 'SPONSORSHIP_AGREEMENT',
  PITCH_DECK: 'PITCH_DECK',
  ONE_PAGER: 'ONE_PAGER',
  WORKSHOP_REPORT: 'WORKSHOP_REPORT',
  SITE_VISIT_REPORT: 'SITE_VISIT_REPORT',
  MEETING_MINUTES: 'MEETING_MINUTES',
  PO_OR_INVOICE: 'PO_OR_INVOICE',
  OFFSET_DOCUMENTATION: 'OFFSET_DOCUMENTATION',
  VENDOR_REGISTRATION_OR_KYC: 'VENDOR_REGISTRATION_OR_KYC',
  FACULTY_PROFILE_OR_CV: 'FACULTY_PROFILE_OR_CV',
  OTHER: 'OTHER',
} as const;

export const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  SHARED: 'SHARED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  SIGNED: 'SIGNED',
  EXPIRED: 'EXPIRED',
  SUPERSEDED: 'SUPERSEDED',
  OTHER: 'OTHER',
} as const;

export const DOCUMENT_CONFIDENTIALITY = {
  INTERNAL: 'INTERNAL',
  CONFIDENTIAL: 'CONFIDENTIAL',
  RESTRICTED: 'RESTRICTED',
  OTHER: 'OTHER',
} as const;

export const DOCUMENT_SOURCE_SYSTEM = {
  UVENTURE: 'UVENTURE',
  SHAREPOINT: 'SHAREPOINT',
} as const;

export const DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER = 'e53392e7-6bc5-4707-927a-03b97ab7736b';
export const DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER = '36321d69-1b5e-4c71-acb0-857ce5edcfdf';
export const DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '4453e70e-8f6d-4fa6-ad6b-0e617bcd6c6a';
export const DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER = '3ece2a6c-5065-4cc8-9ab2-33f1d48a466f';
export const DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER = '536394b1-8a94-42ce-b67a-997b7081d7a3';
export const DOCUMENT_VERSION_LABEL_FIELD_UNIVERSAL_IDENTIFIER = '75ce1659-1ec6-432d-aae8-ed3e7b7af273';
export const DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER = 'd15a2291-aa3d-48d4-8640-8a401fd20a64';
export const DOCUMENT_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER = '98ecf6a8-4e8d-42cd-8a43-1ca8359f7ed7';
export const DOCUMENT_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER = 'f21c2369-118b-40ff-98e8-28ef10b7cf03';
export const DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = '0191c0bd-4073-4ca7-9f5f-c6a5ecbe47ba';

// A document is its link and its metadata: the file stays on SharePoint or in
// uVENTURE and is never uploaded (kuec/CLAUDE.md section 4). `type`, `link` and
// `version` are taken (Twenty reserves the first two, the lock list the third),
// hence kind, documentLink and versionLabel.
export default defineObject({
  universalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'document',
  namePlural: 'documents',
  labelSingular: 'Document',
  labelPlural: 'Documents',
  description: 'A link to a file on SharePoint or in uVENTURE, with its type, status and confidentiality',
  icon: 'IconFileText',
  labelIdentifierFieldMetadataUniversalIdentifier:
    DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'kind',
      label: 'Type',
      description: 'What the document is',
      icon: 'IconCategory',
      options: [
        { id: 'b9a4308c-8e49-4723-b613-b5a5a63d4344', value: DOCUMENT_TYPE.NDA, label: 'NDA', position: 0, color: 'gray' },
        { id: '18a12404-757a-4216-8f05-babf47aadd29', value: DOCUMENT_TYPE.MOU, label: 'MoU', position: 1, color: 'orange' },
        { id: '8c9c88d7-b9b6-4f12-8ba4-bf0c27d6cb0b', value: DOCUMENT_TYPE.MSA, label: 'MSA', position: 2, color: 'turquoise' },
        { id: '66a73faf-f042-43f5-bf30-8aa4d5f31e42', value: DOCUMENT_TYPE.PROPOSAL_OR_SOW, label: 'Proposal or SOW', position: 3, color: 'blue' },
        { id: '86e0ac7b-a278-4741-b4ca-71213fb0ff9b', value: DOCUMENT_TYPE.QUOTE, label: 'Quote', position: 4, color: 'sky' },
        { id: '2cfecffc-e8b0-4a9d-8abe-66a11c62f64e', value: DOCUMENT_TYPE.RFQ_OR_RFP_RECEIVED, label: 'RFQ or RFP received', position: 5, color: 'amber' },
        { id: '9a7719c2-d4c7-4252-a0c6-a7ecfeea3f96', value: DOCUMENT_TYPE.TECHNICAL_ASSESSMENT_REPORT, label: 'Technical assessment report', position: 6, color: 'green' },
        { id: '87531838-d955-4515-9f4a-835badae7e60', value: DOCUMENT_TYPE.TERM_SHEET, label: 'Term sheet', position: 7, color: 'pink' },
        { id: '1d36115d-d3f6-4040-a499-e649c9f9956f', value: DOCUMENT_TYPE.LICENCE_AGREEMENT, label: 'Licence agreement', position: 8, color: 'purple' },
        { id: '97cac8d8-18e6-4afb-baaa-5aff041b4165', value: DOCUMENT_TYPE.TSA, label: 'TSA', position: 9, color: 'red' },
        { id: 'd101fe4c-3616-4dc5-96f4-708d9c302a79', value: DOCUMENT_TYPE.JDA, label: 'JDA', position: 10, color: 'violet' },
        { id: '3a469847-1a64-4010-93e6-2adbe7d015f2', value: DOCUMENT_TYPE.SPONSORSHIP_AGREEMENT, label: 'Sponsorship agreement', position: 11, color: 'gold' },
        { id: '007105cf-3060-4649-bd98-19a6f001bf13', value: DOCUMENT_TYPE.PITCH_DECK, label: 'Pitch deck', position: 12, color: 'iris' },
        { id: '7e048efb-4f4f-4f9f-b106-4ce5f6c0f4e7', value: DOCUMENT_TYPE.ONE_PAGER, label: 'One-pager', position: 13, color: 'jade' },
        { id: '34377f28-1369-4e68-a53d-cf9187282a42', value: DOCUMENT_TYPE.WORKSHOP_REPORT, label: 'Workshop report', position: 14, color: 'tomato' },
        { id: '26403ddd-3630-4eda-acc1-06a9a35ee00c', value: DOCUMENT_TYPE.SITE_VISIT_REPORT, label: 'Site-visit report', position: 15, color: 'mint' },
        { id: 'b8010f65-c125-4505-b3e9-c260aec15f0f', value: DOCUMENT_TYPE.MEETING_MINUTES, label: 'Meeting minutes', position: 16, color: 'plum' },
        { id: '7cf645cf-e50a-4b49-80c5-5f56eabbbdc2', value: DOCUMENT_TYPE.PO_OR_INVOICE, label: 'PO or invoice (finance is the system of record)', position: 17, color: 'cyan' },
        { id: '3da483c0-c5ac-43de-9376-f60b231e7111', value: DOCUMENT_TYPE.OFFSET_DOCUMENTATION, label: 'Offset documentation', position: 18, color: 'lime' },
        { id: 'b10efb21-af19-409b-a382-83409dd25184', value: DOCUMENT_TYPE.VENDOR_REGISTRATION_OR_KYC, label: 'Vendor registration or KYC', position: 19, color: 'bronze' },
        { id: 'c7afa69d-57b9-45de-a6a0-b04ca371d3ac', value: DOCUMENT_TYPE.FACULTY_PROFILE_OR_CV, label: 'Faculty profile or CV', position: 20, color: 'crimson' },
        { id: '655a1462-088c-41e5-9500-a7c15885482c', value: DOCUMENT_TYPE.OTHER, label: 'Other', position: 21, color: 'gray' },
      ],
    },
    {
      universalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${DOCUMENT_STATUS.DRAFT}'`,
      options: [
        { id: '825ef3d7-2b0c-45b1-93f0-d0428a00798f', value: DOCUMENT_STATUS.DRAFT, label: 'Draft', position: 0, color: 'gray' },
        { id: 'f4ff0990-3fa8-4417-809d-1fdef685280b', value: DOCUMENT_STATUS.SHARED, label: 'Shared', position: 1, color: 'sky' },
        { id: '26899c17-9999-4aad-8a77-c4aacf0d9c08', value: DOCUMENT_STATUS.UNDER_REVIEW, label: 'Under review', position: 2, color: 'orange' },
        { id: 'f676f4e6-01a0-46fa-a2a2-fd1c39249e25', value: DOCUMENT_STATUS.SIGNED, label: 'Signed', position: 3, color: 'green' },
        { id: '6df3e2f2-8d91-426e-8a0f-f35d9aafad99', value: DOCUMENT_STATUS.EXPIRED, label: 'Expired', position: 4, color: 'red' },
        { id: '8ef46f28-9757-4043-8b67-e017cf742578', value: DOCUMENT_STATUS.SUPERSEDED, label: 'Superseded', position: 5, color: 'purple' },
        { id: '1143fb75-110b-420f-8648-b1448ea9936f', value: DOCUMENT_STATUS.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'confidentiality',
      label: 'Confidentiality',
      description: 'A label for people; SharePoint or uVENTURE permissions decide who can open the file',
      icon: 'IconLock',
      isNullable: false,
      defaultValue: `'${DOCUMENT_CONFIDENTIALITY.CONFIDENTIAL}'`,
      options: [
        { id: '1cf54c2f-fe75-44d2-b031-8ff90d5a372d', value: DOCUMENT_CONFIDENTIALITY.INTERNAL, label: 'Internal', position: 0, color: 'blue' },
        { id: 'e0aac47c-7042-49e1-94e7-09e87d6505f0', value: DOCUMENT_CONFIDENTIALITY.CONFIDENTIAL, label: 'Confidential', position: 1, color: 'orange' },
        { id: '29b4e836-80fc-40e3-a25e-7bf817103d29', value: DOCUMENT_CONFIDENTIALITY.RESTRICTED, label: 'Restricted', position: 2, color: 'red' },
        { id: 'ed41a4f7-223d-4cec-8ce1-c278d9466f79', value: DOCUMENT_CONFIDENTIALITY.OTHER, label: 'Other', position: 3, color: 'gray' },
      ],
    },
    {
      universalIdentifier: DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.LINKS,
      name: 'documentLink',
      label: 'SharePoint or uVENTURE link',
      description: 'Where the file lives; the file itself is never uploaded to Twenty',
      icon: 'IconLink',
    },
    {
      universalIdentifier: DOCUMENT_VERSION_LABEL_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'versionLabel',
      label: 'Version',
      description: 'As written on the file, e.g. v3 or Final',
      icon: 'IconVersions',
    },
    {
      universalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'expiresAt',
      label: 'Expires on',
      description: 'When the document stops applying, e.g. an NDA term or a quote validity',
      icon: 'IconCalendarX',
    },
    {
      universalIdentifier: DOCUMENT_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'externalId',
      label: 'External id',
      description: 'The id in the system that created the record, prefixed with that system, e.g. uventure:DOC-0042',
      icon: 'IconId',
      isUnique: true,
    },
    {
      universalIdentifier: DOCUMENT_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'sourceSystem',
      label: 'Source system',
      description: 'The system that created the record; empty when a person typed it',
      icon: 'IconDatabaseImport',
      options: [
        { id: '1626dc63-9126-4719-b67e-1c49f5cd5521', value: DOCUMENT_SOURCE_SYSTEM.UVENTURE, label: 'uVENTURE', position: 0, color: 'purple' },
        { id: '38548b78-f66a-49a5-9624-3f52fda89d0c', value: DOCUMENT_SOURCE_SYSTEM.SHAREPOINT, label: 'SharePoint', position: 1, color: 'blue' },
      ],
    },
    {
      universalIdentifier: DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: OTHER_DETAILS_FIELD_DESCRIPTION,
      icon: 'IconNotes',
    },
  ],
});
