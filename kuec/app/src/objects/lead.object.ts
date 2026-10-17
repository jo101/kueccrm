import {
  defineObject,
  FieldType,
  getFieldUniversalIdentifier,
  MetadataWritability,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import {
  DEPARTMENT,
  OTHER_DETAILS_FIELD_DESCRIPTION,
} from '../constants/taxonomy';
import { OPPORTUNITY_OFFERING } from '../fields/offering-on-opportunity.field';
import { OPPORTUNITY_SOURCE } from '../fields/source-on-opportunity.field';

export const LEAD_UNIVERSAL_IDENTIFIER = '363e9fc9-3856-414b-978d-1212e416e6d6';

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  ENGAGED: 'ENGAGED',
  QUALIFIED: 'QUALIFIED',
  NURTURE: 'NURTURE',
  DEAD: 'DEAD',
  CONVERTED: 'CONVERTED',
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const LEAD_DEAD_REASON = {
  NO_RESPONSE: 'NO_RESPONSE',
  NO_FIT: 'NO_FIT',
  NO_BUDGET: 'NO_BUDGET',
  DUPLICATE: 'DUPLICATE',
  COMPETITOR: 'COMPETITOR',
  TIMING: 'TIMING',
  NOT_DECISION_MAKER: 'NOT_DECISION_MAKER',
  OTHER: 'OTHER',
} as const;

// The systems that create leads without a person typing them (runbooks/19-leads.md section 6).
export const LEAD_SOURCE_SYSTEM = {
  WEBSITE_FORM: 'WEBSITE_FORM',
  GALA_QR_FORM: 'GALA_QR_FORM',
  WORKSHOP_SIGNUP_FORM: 'WORKSHOP_SIGNUP_FORM',
  APOLLO: 'APOLLO',
  UVENTURE: 'UVENTURE',
  REGISTRY: 'REGISTRY',
} as const;

export type LeadSourceSystem =
  (typeof LEAD_SOURCE_SYSTEM)[keyof typeof LEAD_SOURCE_SYSTEM];

export const LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER = 'b82191c8-a544-4165-9bf6-76251cbcd066';
export const LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '104dd56d-9239-4aac-ae7c-618eab4b0747';
export const LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER = 'c0d4335e-ac6d-4b8d-9248-7c4a7d13a80e';
export const LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER = '7dc62bcc-640c-4724-b2f8-ccd95e06097a';
export const LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER = 'd554946e-54f1-4598-9fe9-6d54dbc1a46f';
export const LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER = '40e82145-adef-4ec3-b387-a018d195074d';
export const LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER = 'cd47de6f-6151-40d0-8e94-420c32a0da62';
export const LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER = '593f2aff-3573-47d9-a4d6-86a0f7edd174';
export const LEAD_REFERRAL_NOTE_FIELD_UNIVERSAL_IDENTIFIER = '6dda1a57-b30a-47a1-bb86-fed46d324e8c';
export const LEAD_NEED_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER = '404172e0-8033-4b96-bed2-8460662cc454';
export const LEAD_DECISION_MAKER_REACHED_FIELD_UNIVERSAL_IDENTIFIER = 'fed7b19b-8af4-4bf0-bea4-a0cb8218ce64';
export const LEAD_CAPABILITY_MATCHED_FIELD_UNIVERSAL_IDENTIFIER = '34e7dc66-93ec-410c-a9ad-a83a00d073a6';
export const LEAD_FUNDING_PATH_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER = '0db43eb6-44b2-438d-87f6-e1b5725cc56e';
export const LEAD_TIMING_KNOWN_FIELD_UNIVERSAL_IDENTIFIER = '1d1866ca-2349-4c03-b7b9-f2362e1da0a0';
export const LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER = '9dd4dc97-f0fb-4692-8fd2-fc99c5d4ac75';
export const LEAD_ESTIMATED_VALUE_FIELD_UNIVERSAL_IDENTIFIER = '41b37d2b-f482-4ec8-b93c-b5264dfa38eb';
export const LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER = 'dcb9b984-436f-44ea-9c4d-442067bd5d79';
export const LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER = 'aaef94d7-9d50-4871-ac2f-4c46dce32a07';
export const LEAD_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER = '0abde774-ffe3-45c5-8f47-2641e2a9e631';
export const LEAD_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER = '77189717-0d49-4273-a843-ecd5e8f70945';
export const LEAD_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER = '9359d1ae-15ad-40e9-9b3d-e9b5b4401d37';
export const LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER = '992a948d-c977-4e64-af5b-bdfb08f31281';
export const LEAD_LAST_ENGAGEMENT_AT_FIELD_UNIVERSAL_IDENTIFIER = '1e6fe295-8b86-41bd-882c-d08b155d3755';
export const LEAD_CONTACT_NUDGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER = '68003ad5-07aa-4e20-bf4d-78f4bb42949c';
export const LEAD_CONTACT_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER = '12f02ec8-fc0c-4534-ab6e-95c95413c37d';
export const LEAD_QUALIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER = 'e1bda955-2a3a-483d-992d-e5f8a3345b3a';
export const LEAD_AUTO_CLOSED_AT_FIELD_UNIVERSAL_IDENTIFIER = '32b006ed-6a52-4584-9525-41971e9a3a0a';
export const LEAD_LAST_CONVERTED_AT_FIELD_UNIVERSAL_IDENTIFIER = 'bb8866a1-ed5a-45b0-8c22-ec7457fb5243';
export const LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER = 'a33f73d8-f917-4b92-aaf5-edf1ea68f537';
export const LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = '2c11332e-527c-46b5-b3b9-7393983fa922';

// Twenty adds createdAt to every object; its identifier is derived from the
// app, the object and the name, never declared.
export const LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER = getFieldUniversalIdentifier({
  applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  name: 'createdAt',
});

// A lead is a contact with a possible need, before it is a defined case. It
// becomes an opportunity at Converted (runbooks/19-leads.md).
export default defineObject({
  universalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  nameSingular: 'lead',
  namePlural: 'leads',
  labelSingular: 'Lead',
  labelPlural: 'Leads',
  description: 'A contact with a possible need, to triage, qualify and convert into an opportunity',
  icon: 'IconUserSearch',
  labelIdentifierFieldMetadataUniversalIdentifier:
    LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${LEAD_STATUS.NEW}'`,
      options: [
        { id: '593421a8-46e3-46d7-ad96-146e92d071fc', value: LEAD_STATUS.NEW, label: 'New', position: 0, color: 'sky' },
        { id: 'cd0aa3b6-dd61-405e-9c7d-90bfb86be356', value: LEAD_STATUS.CONTACTED, label: 'Contacted', position: 1, color: 'blue' },
        { id: '7ad485bf-25c4-4af3-bd50-4643fc7ef261', value: LEAD_STATUS.ENGAGED, label: 'Engaged', position: 2, color: 'purple' },
        { id: '885fdb39-fa1b-4eda-873d-a5baaa850580', value: LEAD_STATUS.QUALIFIED, label: 'Qualified', position: 3, color: 'green' },
        { id: 'f8e48b63-64ed-4f17-ae1c-1b9fe28cfbf2', value: LEAD_STATUS.NURTURE, label: 'Nurture', position: 4, color: 'amber' },
        { id: '91d825bb-00f0-4a34-a3d9-bbeddafd59ec', value: LEAD_STATUS.DEAD, label: 'Dead', position: 5, color: 'gray' },
        { id: '4fa22182-11d1-45c7-86ff-c020466bc029', value: LEAD_STATUS.CONVERTED, label: 'Converted', position: 6, color: 'turquoise' },
      ],
    },
    {
      universalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'source',
      label: 'Source',
      description: 'Where the lead came from; copied to the opportunity at conversion',
      icon: 'IconArrowFork',
      // Mirrors Opportunity > Source, deprecated options included, so a
      // conversion copies the value as it is (runbooks/18-taxonomy.md).
      options: [
        { id: 'beb1b23f-3926-4399-a905-2be4799dab67', value: OPPORTUNITY_SOURCE.INBOUND, label: 'Inbound (web, email, phone)', position: 0, color: 'green' },
        { id: '6cef88bc-3f3b-4eea-a171-a3cd738166bc', value: OPPORTUNITY_SOURCE.WORKSHOP, label: 'Workshop', position: 1, color: 'amber' },
        { id: 'd7dca493-453a-4d06-ad99-37717e6aa313', value: OPPORTUNITY_SOURCE.EXHIBITION, label: 'Exhibition', position: 2, color: 'red' },
        { id: '20dd08e6-16ad-4fd6-bf70-06b101dc2113', value: OPPORTUNITY_SOURCE.GALA_QR, label: 'Gala QR', position: 3, color: 'violet' },
        { id: 'cbfc8eef-271b-4627-915e-b848e1fc8607', value: OPPORTUNITY_SOURCE.CHALLENGE_SPRINT, label: 'Challenge Sprint', position: 4, color: 'jade' },
        { id: '13882982-8086-468d-a201-5bfd27ade6b9', value: OPPORTUNITY_SOURCE.TRL_BRIDGING_PROGRAM, label: 'TRL Bridging Program', position: 5, color: 'gold' },
        { id: '3a65e9ff-fdb6-427f-b643-52db5e0a6461', value: OPPORTUNITY_SOURCE.TECHNOLOGY_FELLOWS, label: 'Technology Fellows', position: 6, color: 'iris' },
        { id: '97695c70-b1dd-4223-947e-a5622017c6c2', value: OPPORTUNITY_SOURCE.TECHNICAL_COMMITTEE, label: 'Technical committee', position: 7, color: 'tomato' },
        { id: '9e4bcf4a-3532-4683-9151-42654f15dd92', value: OPPORTUNITY_SOURCE.FACULTY, label: 'Referral: faculty', position: 8, color: 'sky' },
        { id: '4f73448d-75d2-4218-8212-91a84d25e752', value: OPPORTUNITY_SOURCE.REFERRAL_KU_LEADERSHIP, label: 'Referral: KU leadership', position: 9, color: 'mint' },
        { id: '62dbd6c3-a01e-4c5d-892e-755a735b6362', value: OPPORTUNITY_SOURCE.REFERRAL_CEO_OR_BOARD, label: 'Referral: CEO or board', position: 10, color: 'plum' },
        { id: '74f4ac70-c05f-465d-be06-a9dcc47b33d4', value: OPPORTUNITY_SOURCE.PARTNER, label: 'Referral: partner', position: 11, color: 'pink' },
        { id: 'df8da2f3-a7a2-4d2b-9b4d-96e7f2ea1d2a', value: OPPORTUNITY_SOURCE.REFERRAL_COLLEAGUE, label: 'Referral: colleague', position: 12, color: 'cyan' },
        { id: '08219cff-f821-43c8-b86a-a907f3e545c0', value: OPPORTUNITY_SOURCE.GOVERNMENT_REQUEST, label: 'Government request', position: 13, color: 'lime' },
        { id: '56cee2bf-95c4-4545-ba96-293d80df6db3', value: OPPORTUNITY_SOURCE.REGISTRY_OUTREACH, label: 'Registry outreach', position: 14, color: 'bronze' },
        { id: '1672ab66-6bd0-42b2-8404-1fc53711dab1', value: OPPORTUNITY_SOURCE.OUTBOUND_SEQUENCE, label: 'Outbound sequence', position: 15, color: 'crimson' },
        { id: '2f2eae6e-257b-4355-8c7c-9172ca91ea42', value: OPPORTUNITY_SOURCE.LINKEDIN, label: 'LinkedIn', position: 16, color: 'grass' },
        { id: '4ff66609-f026-4168-ae30-b6bd900e3b2c', value: OPPORTUNITY_SOURCE.TENDER, label: 'Tender or RFQ portal', position: 17, color: 'orange' },
        { id: 'f392f33a-6889-4bd5-a6f9-8deb98c9701f', value: OPPORTUNITY_SOURCE.EXISTING_CUSTOMER, label: 'Existing customer', position: 18, color: 'brown' },
        { id: '55ed27b6-993e-4d41-882f-68d0d84e4786', value: OPPORTUNITY_SOURCE.OFFSET_MANAGER, label: 'Offset manager', position: 19, color: 'ruby' },
        { id: 'cabf5378-6cb2-412b-ab61-b3ca5ebb24e0', value: OPPORTUNITY_SOURCE.STARTUP_PORTFOLIO, label: 'Startup portfolio', position: 20, color: 'yellow' },
        { id: '50082658-1b17-42a0-8479-e0a40e980975', value: OPPORTUNITY_SOURCE.REFERRAL, label: 'Referral (deprecated)', position: 21, color: 'gray' },
        { id: '4c901bbd-9f49-422a-a4bd-6a1249f47566', value: OPPORTUNITY_SOURCE.OUTREACH, label: 'Outreach (deprecated)', position: 22, color: 'gray' },
        { id: 'bdc64a65-dc7d-4880-97a9-078855cebb35', value: OPPORTUNITY_SOURCE.EVENT, label: 'Event or workshop (deprecated)', position: 23, color: 'gray' },
        { id: '7da72a2a-87dc-4770-b9ac-d3d54cdf9bd7', value: OPPORTUNITY_SOURCE.OTHER, label: 'Other', position: 24, color: 'gray' },
      ],
    },
    {
      universalIdentifier: LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'need',
      label: 'Need',
      description: 'What they want, in their words; becomes the opportunity description',
      icon: 'IconBulb',
      isSearchable: true,
    },
    {
      universalIdentifier: LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.MULTI_SELECT,
      name: 'offeringInterest',
      label: 'Offering interest',
      description: 'The KUEC offerings they asked about; the first sets the opportunity type',
      icon: 'IconPackages',
      options: [
        { id: '881ca9d9-7593-44ee-85d6-6cd48e631e7a', value: OPPORTUNITY_OFFERING.IP_LICENCE, label: 'IP licence', position: 0, color: 'blue' },
        { id: 'a45198d2-0ab7-46ad-8eaa-2a565a786f6a', value: OPPORTUNITY_OFFERING.TECHNICAL_SERVICE, label: 'Technical service', position: 1, color: 'green' },
        { id: '5f468ae7-ffab-4959-a5bc-ca8dfee215c0', value: OPPORTUNITY_OFFERING.LAB_TESTING, label: 'Lab testing', position: 2, color: 'purple' },
        { id: '76ccb497-1a3f-4ecf-97f6-cf049831cc8f', value: OPPORTUNITY_OFFERING.EQUIPMENT_ACCESS, label: 'Equipment access', position: 3, color: 'orange' },
        { id: '4bdffa27-4e3c-4d44-89ae-2dc6fc9255c9', value: OPPORTUNITY_OFFERING.RESEARCH_COLLABORATION, label: 'Research collaboration', position: 4, color: 'turquoise' },
        { id: '314d77d2-cb83-4595-bc17-17fe990e6946', value: OPPORTUNITY_OFFERING.STARTUP_PRODUCT, label: 'Startup product', position: 5, color: 'pink' },
        { id: '5286336c-d70e-4bf1-bef1-84f068152c73', value: OPPORTUNITY_OFFERING.SUBSIDIARY_SERVICE, label: 'Subsidiary service', position: 6, color: 'sky' },
        { id: '92a2cdc9-fcc3-4706-81ad-182309fc98b8', value: OPPORTUNITY_OFFERING.SPONSORED_CHAIR, label: 'Sponsored chair', position: 7, color: 'amber' },
        { id: '51727a00-0cfb-4877-8fc4-5ff2fd65adf3', value: OPPORTUNITY_OFFERING.LEASING, label: 'Leasing', position: 8, color: 'red' },
        { id: '21466afe-3dce-4fb2-a81a-1436a7980234', value: OPPORTUNITY_OFFERING.TRAINING, label: 'Training', position: 9, color: 'violet' },
        { id: '2efde5ce-ed94-4a26-87d4-17e5bb1272ab', value: OPPORTUNITY_OFFERING.ADVISORY, label: 'Advisory', position: 10, color: 'jade' },
        { id: 'abb7b3bb-3698-4254-b2f7-0fa94434a8ec', value: OPPORTUNITY_OFFERING.OTHER, label: 'Other', position: 11, color: 'gray' },
      ],
    },
    {
      universalIdentifier: LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'department',
      label: 'Department',
      description: 'The KUEC department that leads this record',
      icon: 'IconBuildingCommunity',
      options: [
        { id: '27583d53-9523-48b4-ae5c-00d7dec6a26d', value: DEPARTMENT.BD, label: 'BD', position: 0, color: 'blue' },
        { id: '87d67506-1633-42c2-b5c0-795f30141547', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
        { id: 'c78ea7e8-14ab-43ef-bcd2-8cf6f888d8f5', value: DEPARTMENT.IP_OFFICE, label: 'IP office', position: 2, color: 'purple' },
        { id: '105aacf9-542c-40db-9727-8bc2c1ee2899', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
        { id: 'c4440a14-9ba9-463d-9e2f-38b32c8a7d3a', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
        { id: 'a91dd6bb-2e3b-42b6-9803-f5040f37751c', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
        { id: '4d246810-1e5c-4f92-adff-342d1a9578c7', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'deadReason',
      label: 'Dead reason',
      description: 'Why the lead went nowhere; required when Status is Dead',
      icon: 'IconCircleX',
      options: [
        { id: 'b9c92c43-38c0-4994-92fd-85343c939b21', value: LEAD_DEAD_REASON.NO_RESPONSE, label: 'No response', position: 0, color: 'gray' },
        { id: '62fdf2c5-63b7-4ad8-b11b-26e2ea6cb589', value: LEAD_DEAD_REASON.NO_FIT, label: 'No fit', position: 1, color: 'orange' },
        { id: 'af454732-2f07-4704-8ce1-b068c9e186b8', value: LEAD_DEAD_REASON.NO_BUDGET, label: 'No budget', position: 2, color: 'red' },
        { id: '7067d1ba-dccd-42c5-a001-0a49817b86da', value: LEAD_DEAD_REASON.DUPLICATE, label: 'Duplicate', position: 3, color: 'sky' },
        { id: '6cd32056-0640-480b-8e73-bee4e5a44a6d', value: LEAD_DEAD_REASON.COMPETITOR, label: 'Competitor', position: 4, color: 'pink' },
        { id: '57dfdddc-4c95-4c2c-bd75-9c474a4104bb', value: LEAD_DEAD_REASON.TIMING, label: 'Timing', position: 5, color: 'amber' },
        { id: 'ef2bf67e-08a1-45fe-b6d1-e11fa9f7c120', value: LEAD_DEAD_REASON.NOT_DECISION_MAKER, label: 'Not decision maker', position: 6, color: 'purple' },
        { id: '3d572877-c791-4b4d-99a2-14b6c5a81d9a', value: LEAD_DEAD_REASON.OTHER, label: 'Other', position: 7, color: 'gray' },
      ],
    },
    {
      universalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'nurtureReviewDate',
      label: 'Nurture review date',
      description: 'When to look at a Nurture lead again; 90 days out if left empty',
      icon: 'IconCalendarRepeat',
    },
    {
      universalIdentifier: LEAD_REFERRAL_NOTE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'referralNote',
      label: 'Referral note',
      description: 'How the referral came about and what was promised to the referrer',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: LEAD_NEED_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'needIdentified',
      label: 'Need identified',
      description: 'They named a concrete problem or request KUEC could answer',
      icon: 'IconCheckbox',
      isNullable: false,
      defaultValue: false,
    },
    {
      universalIdentifier: LEAD_DECISION_MAKER_REACHED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'decisionMakerReached',
      label: 'Decision maker reached',
      description: 'We have spoken to the person who can say yes and sign, or they are in the conversation',
      icon: 'IconCheckbox',
      isNullable: false,
      defaultValue: false,
    },
    {
      universalIdentifier: LEAD_CAPABILITY_MATCHED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'capabilityMatched',
      label: 'Capability matched',
      description: 'A named KU technology, lab, service or team can meet the need',
      icon: 'IconCheckbox',
      isNullable: false,
      defaultValue: false,
    },
    {
      universalIdentifier: LEAD_FUNDING_PATH_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'fundingPathIdentified',
      label: 'Funding path identified',
      description: 'We know who would pay: their budget, a grant, an offset obligation or a sponsor',
      icon: 'IconCheckbox',
      isNullable: false,
      defaultValue: false,
    },
    {
      universalIdentifier: LEAD_TIMING_KNOWN_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'timingKnown',
      label: 'Timing known',
      description: 'They gave a date or a window by which they need it',
      icon: 'IconCheckbox',
      isNullable: false,
      defaultValue: false,
    },
    {
      universalIdentifier: LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'qualificationScore',
      label: 'Qualification score',
      description: 'How many of the five checks are ticked, set by the app; 4 or more is Qualified',
      icon: 'IconChecks',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_ESTIMATED_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.CURRENCY,
      name: 'estimatedValue',
      label: 'Estimated value',
      description: 'A first guess at the deal size; becomes the opportunity amount',
      icon: 'IconCurrencyDollar',
    },
    {
      universalIdentifier: LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'nextAction',
      label: 'Next action',
      icon: 'IconArrowRight',
      isSearchable: true,
    },
    {
      universalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE,
      name: 'nextActionDate',
      label: 'Next action date',
      icon: 'IconCalendarDue',
    },
    // Integration identity (runbooks/16-integration-map.md section 2.2): OPEN
    // so the app and an integration key can write them, locked for people in
    // roles/utils/field-locks.ts.
    {
      universalIdentifier: LEAD_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'externalId',
      label: 'External id',
      description: 'The id in the system that created the lead, prefixed with that system, e.g. web:4711',
      icon: 'IconId',
      isUnique: true,
    },
    {
      universalIdentifier: LEAD_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'sourceSystem',
      label: 'Source system',
      description: 'The system that created the lead; empty when a person typed it',
      icon: 'IconDatabaseImport',
      options: [
        { id: '9aeab241-8e00-4dbd-a74a-7b3d78966ae9', value: LEAD_SOURCE_SYSTEM.WEBSITE_FORM, label: 'Website form', position: 0, color: 'green' },
        { id: '82f41f13-8ddd-401e-9691-b5154ac61337', value: LEAD_SOURCE_SYSTEM.GALA_QR_FORM, label: 'Gala QR form', position: 1, color: 'violet' },
        { id: '3aabc1b6-d5de-4b25-a952-d598c5f42a8e', value: LEAD_SOURCE_SYSTEM.WORKSHOP_SIGNUP_FORM, label: 'Workshop sign-up form', position: 2, color: 'amber' },
        { id: '269bbe9d-3e22-479e-af2e-c37aace27838', value: LEAD_SOURCE_SYSTEM.APOLLO, label: 'Apollo', position: 3, color: 'blue' },
        { id: 'dd209b2d-8815-409d-a96f-516f4dea4cf0', value: LEAD_SOURCE_SYSTEM.UVENTURE, label: 'uVENTURE', position: 4, color: 'purple' },
        { id: 'ce50762a-ec8a-4ea3-8586-ee987d03c646', value: LEAD_SOURCE_SYSTEM.REGISTRY, label: 'Industrial registry', position: 5, color: 'gray' },
      ],
    },
    {
      universalIdentifier: LEAD_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.BOOLEAN,
      name: 'playbookApplied',
      label: 'Triaged',
      description: 'Set by the app once triage ran (L1), so it runs once',
      icon: 'IconRoute',
      isNullable: false,
      defaultValue: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'statusEnteredAt',
      label: 'Status entered at',
      description: 'When the lead entered its current status, set by the app',
      icon: 'IconCalendarClock',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_LAST_ENGAGEMENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'lastEngagementAt',
      label: 'Last engagement',
      description: 'Date of the latest engagement linked to this lead, set by the app',
      icon: 'IconCalendarEvent',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_CONTACT_NUDGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'contactNudgeSentAt',
      label: 'Contact nudge sent at',
      description: 'L2: the owner was nudged after 3 business days in New',
      icon: 'IconBellRinging',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_CONTACT_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'contactEdNotifiedAt',
      label: 'Contact ED notified at',
      description: 'L2: the ED was told after 7 business days in New',
      icon: 'IconBellRinging',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_QUALIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'qualifiedAt',
      label: 'Qualified at',
      description: 'L4: when the score first reached 4 and the app set Qualified',
      icon: 'IconCircleCheck',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_AUTO_CLOSED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'autoClosedAt',
      label: 'Closed for no response at',
      description: 'L3: when the app set Dead after 30 quiet days',
      icon: 'IconMessageCircleOff',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_LAST_CONVERTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'lastConvertedAt',
      label: 'Last converted at',
      description: 'L5: when the latest opportunity was created from this lead',
      icon: 'IconTransform',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'referralCreditedAt',
      label: 'Referral credited at',
      description: 'L6: when an opportunity from this lead reached Signed and the referrer got the credit',
      icon: 'IconTrophy',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: OTHER_DETAILS_FIELD_DESCRIPTION,
      icon: 'IconNotes',
    },
  ],
});
