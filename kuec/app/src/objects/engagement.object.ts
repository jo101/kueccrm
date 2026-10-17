import { defineObject, FieldType, MetadataWritability } from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { fieldDescription, objectDescription } from '../i18n/field-guidance';

export const ENGAGEMENT_UNIVERSAL_IDENTIFIER = '28836d0c-0ee1-461b-9785-32ae5dfa2d2b';

export const ENGAGEMENT_KIND = {
  INTRO_MEETING: 'INTRO_MEETING',
  DISCOVERY_MEETING: 'DISCOVERY_MEETING',
  SITE_VISIT: 'SITE_VISIT',
  LAB_OR_CAMPUS_VISIT: 'LAB_OR_CAMPUS_VISIT',
  WORKSHOP: 'WORKSHOP',
  EXHIBITION_OR_CONFERENCE: 'EXHIBITION_OR_CONFERENCE',
  GALA_OR_EVENT: 'GALA_OR_EVENT',
  CHALLENGE_SPRINT_SESSION: 'CHALLENGE_SPRINT_SESSION',
  FELLOWSHIP_OR_BOOTCAMP_SESSION: 'FELLOWSHIP_OR_BOOTCAMP_SESSION',
  TECHNICAL_ASSESSMENT_SESSION: 'TECHNICAL_ASSESSMENT_SESSION',
  PROPOSAL_PRESENTATION: 'PROPOSAL_PRESENTATION',
  NEGOTIATION_SESSION: 'NEGOTIATION_SESSION',
  COMMITTEE_OR_STEERING_MEETING: 'COMMITTEE_OR_STEERING_MEETING',
  PILOT_REVIEW: 'PILOT_REVIEW',
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  WEBINAR: 'WEBINAR',
  MEETING: 'MEETING',
  EVENT: 'EVENT',
  OTHER: 'OTHER',
} as const;

export const ENGAGEMENT_OUTCOME_TYPE = {
  OPPORTUNITY_IDENTIFIED: 'OPPORTUNITY_IDENTIFIED',
  LEAD_CREATED: 'LEAD_CREATED',
  INFORMATION_ONLY: 'INFORMATION_ONLY',
  FOLLOW_UP_AGREED: 'FOLLOW_UP_AGREED',
  NO_FIT: 'NO_FIT',
  REFERRAL_RECEIVED: 'REFERRAL_RECEIVED',
  OTHER: 'OTHER',
} as const;

export const ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER = '57eb834b-9641-46e7-9d8a-21d0e92362e3';
export const ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER = 'b86f2c0b-c13e-478d-ae48-4af76d307a6e';
export const ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER = '9441df08-5c1d-4173-b019-46dfa85ecc34';
export const ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER = '83639484-27b0-420a-91c7-0d879a628ef9';
export const ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER = '45993fb6-c3f2-4891-845e-301d35ec5b45';
export const ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER = 'f47e3974-434e-49b6-aae0-66bf18a77ef4';
export const ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER = 'e884cce8-4350-4a84-8742-ca566240ef07';
export const ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER = '4f569fc9-46ff-459a-87c3-e6b60d878a7c';
export const ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = '67ce13b5-4e20-4da9-8d7f-4355d6a7e702';

export default defineObject({
  universalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'engagement',
  namePlural: 'engagements',
  labelSingular: 'Engagement',
  labelPlural: 'Engagements',
  description: objectDescription('engagement'),
  icon: 'IconMessages',
  labelIdentifierFieldMetadataUniversalIdentifier:
    ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Subject',
      description: fieldDescription('engagement.name'),
      icon: 'IconAbc',
    },
    {
      universalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'kind',
      label: 'Kind',
      description: fieldDescription('engagement.kind'),
      icon: 'IconCategory',
      // 2026-10-17: Meeting and Event deprecated for the KUEC taxonomy
      // (runbooks/18-taxonomy.md); kept so existing engagements keep their value.
      options: [
        { id: '88158273-57e6-49c3-8705-88a14224cbf2', value: ENGAGEMENT_KIND.INTRO_MEETING, label: 'Intro meeting', position: 0, color: 'orange' },
        { id: 'acc6b8ac-de05-49e4-be4c-954c4c02c41a', value: ENGAGEMENT_KIND.CALL, label: 'Call', position: 1, color: 'green' },
        { id: 'f859e232-8ee0-48d1-ac38-ba53068a850e', value: ENGAGEMENT_KIND.EMAIL, label: 'Email thread', position: 2, color: 'gray' },
        { id: '05454acb-a2c3-4c3b-b398-a2f8f63850ee', value: ENGAGEMENT_KIND.DISCOVERY_MEETING, label: 'Discovery meeting', position: 3, color: 'turquoise' },
        { id: '6382d1e1-912b-46d7-84ee-227df8e55194', value: ENGAGEMENT_KIND.SITE_VISIT, label: 'Site visit (we go to them)', position: 4, color: 'pink' },
        { id: '56fd1c82-25f3-4df9-b226-eb8c864db5c7', value: ENGAGEMENT_KIND.LAB_OR_CAMPUS_VISIT, label: 'Lab or campus visit (they come to us)', position: 5, color: 'sky' },
        { id: '9d5032da-d25d-4366-8cb8-eebbbfb76022', value: ENGAGEMENT_KIND.PROPOSAL_PRESENTATION, label: 'Proposal presentation', position: 6, color: 'tomato' },
        { id: 'e75933c7-f914-4ba0-a697-d240bfd3b0b3', value: ENGAGEMENT_KIND.NEGOTIATION_SESSION, label: 'Negotiation session', position: 7, color: 'mint' },
        { id: '756cb4ab-60e3-4767-9828-2887c97ca2d3', value: ENGAGEMENT_KIND.TECHNICAL_ASSESSMENT_SESSION, label: 'Technical assessment session', position: 8, color: 'iris' },
        { id: 'a955756b-7398-44c4-8f37-64375870d64e', value: ENGAGEMENT_KIND.WORKSHOP, label: 'Workshop', position: 9, color: 'amber' },
        { id: 'ff006e58-c320-47be-ab2a-e12f3f421e49', value: ENGAGEMENT_KIND.EXHIBITION_OR_CONFERENCE, label: 'Exhibition or conference', position: 10, color: 'red' },
        { id: 'c330d382-6c99-4b2f-8217-5b4975138596', value: ENGAGEMENT_KIND.GALA_OR_EVENT, label: 'Gala or event', position: 11, color: 'violet' },
        { id: '4b5c9838-4eb9-495a-8edf-b828279b84b4', value: ENGAGEMENT_KIND.WEBINAR, label: 'Webinar', position: 12, color: 'lime' },
        { id: '306b562d-568b-4de4-824b-0e69a07692b4', value: ENGAGEMENT_KIND.CHALLENGE_SPRINT_SESSION, label: 'Challenge sprint session', position: 13, color: 'jade' },
        { id: 'aaa38a44-dbe7-443d-8299-3a602a765fcc', value: ENGAGEMENT_KIND.FELLOWSHIP_OR_BOOTCAMP_SESSION, label: 'Fellowship or bootcamp session', position: 14, color: 'gold' },
        { id: '3a4d2c2c-a294-4584-811b-dcc4ce3f6d4f', value: ENGAGEMENT_KIND.COMMITTEE_OR_STEERING_MEETING, label: 'Committee or steering meeting', position: 15, color: 'plum' },
        { id: '0762fa95-f442-4a8d-85f2-3806a80d33de', value: ENGAGEMENT_KIND.PILOT_REVIEW, label: 'Pilot review', position: 16, color: 'cyan' },
        { id: '320cedac-6bf0-45c7-9fe0-a0d940653a35', value: ENGAGEMENT_KIND.MEETING, label: 'Meeting (deprecated)', position: 17, color: 'gray' },
        { id: 'd66ab02b-dc69-452e-997c-28a051b76705', value: ENGAGEMENT_KIND.EVENT, label: 'Event (deprecated)', position: 18, color: 'gray' },
        { id: '6836da7a-4b13-4096-86ec-bf7fd6d833ee', value: ENGAGEMENT_KIND.OTHER, label: 'Other', position: 19, color: 'gray' },
      ],
    },
    {
      universalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'date',
      label: 'Date',
      description: fieldDescription('engagement.date'),
      icon: 'IconCalendar',
    },
    {
      universalIdentifier: ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'nextStep',
      label: 'Next step',
      description: fieldDescription('engagement.nextStep'),
      icon: 'IconArrowRight',
    },
    {
      universalIdentifier: ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'outcome',
      label: 'Outcome',
      description: fieldDescription('engagement.outcome'),
      icon: 'IconClipboardCheck',
    },
    {
      universalIdentifier: ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'outcomeDueAt',
      label: 'Outcome due at',
      description: fieldDescription('engagement.outcomeDueAt'),
      icon: 'IconHourglassLow',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'outcomeType',
      label: 'Outcome type',
      description: fieldDescription('engagement.outcomeType'),
      icon: 'IconTargetArrow',
      options: [
        { id: '72febacb-cba6-42cd-a295-6d19bff50b39', value: ENGAGEMENT_OUTCOME_TYPE.FOLLOW_UP_AGREED, label: 'Follow-up agreed', position: 0, color: 'orange' },
        { id: 'e5fb7222-4148-469b-b444-9f1f2a653320', value: ENGAGEMENT_OUTCOME_TYPE.LEAD_CREATED, label: 'Lead created', position: 1, color: 'green' },
        { id: 'a2237526-b96a-4402-94b6-eec579201496', value: ENGAGEMENT_OUTCOME_TYPE.OPPORTUNITY_IDENTIFIED, label: 'Opportunity identified', position: 2, color: 'blue' },
        { id: 'f305ddf0-8d78-40b9-886d-dfc74b97d9d9', value: ENGAGEMENT_OUTCOME_TYPE.INFORMATION_ONLY, label: 'Information only', position: 3, color: 'purple' },
        { id: '817aa822-1e2c-4fce-b0b2-ec61153b5645', value: ENGAGEMENT_OUTCOME_TYPE.REFERRAL_RECEIVED, label: 'Referral received', position: 4, color: 'pink' },
        { id: '7f2d5f92-7a4d-41a9-9d9c-232000db506b', value: ENGAGEMENT_OUTCOME_TYPE.NO_FIT, label: 'No fit', position: 5, color: 'turquoise' },
        { id: 'd928e0e7-7057-4655-a6fb-9009dc4b6798', value: ENGAGEMENT_OUTCOME_TYPE.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'department',
      label: 'Department',
      description: fieldDescription('engagement.department'),
      icon: 'IconBuildingCommunity',
      options: [
        { id: 'e5895a70-98d2-400c-9ed1-65e36d472a7a', value: DEPARTMENT.BD, label: 'Business development', position: 0, color: 'blue' },
        { id: '0b2cbbef-6cac-43e4-8bd2-8e822dbda237', value: DEPARTMENT.COMMERCIALIZATION, label: 'Commercialization', position: 1, color: 'green' },
        { id: '1d26b026-63a8-4074-9a7c-4b73d40ae3c9', value: DEPARTMENT.IP_OFFICE, label: 'Intellectual property office', position: 2, color: 'purple' },
        { id: '2516e411-a6e5-4b0b-9685-a8f8e0240204', value: DEPARTMENT.LEASING, label: 'Leasing', position: 3, color: 'orange' },
        { id: '5d89aac7-8600-4391-a59b-a7207d8f41f6', value: DEPARTMENT.LAB_ACCESS, label: 'Lab access', position: 4, color: 'turquoise' },
        { id: 'eeaf1186-23da-4624-978e-692faf890f91', value: DEPARTMENT.STARTUPS_AND_INVESTMENT, label: 'Startups and investment', position: 5, color: 'pink' },
        { id: '1cdbc5da-11c9-4c7a-b237-6a68644e976e', value: DEPARTMENT.OTHER, label: 'Other', position: 6, color: 'gray' },
      ],
    },
    {
      universalIdentifier: ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: fieldDescription('engagement.otherDetails'),
      icon: 'IconNotes',
    },
  ],
});
