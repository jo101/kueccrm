import { defineObject, FieldType, MetadataWritability } from 'twenty-sdk/define';

export const ENGAGEMENT_UNIVERSAL_IDENTIFIER = '28836d0c-0ee1-461b-9785-32ae5dfa2d2b';

export const ENGAGEMENT_KIND = {
  MEETING: 'MEETING',
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  EVENT: 'EVENT',
} as const;

export const ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER = '57eb834b-9641-46e7-9d8a-21d0e92362e3';
export const ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER = 'b86f2c0b-c13e-478d-ae48-4af76d307a6e';
export const ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER = '9441df08-5c1d-4173-b019-46dfa85ecc34';
export const ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER = '83639484-27b0-420a-91c7-0d879a628ef9';
export const ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER = '45993fb6-c3f2-4891-845e-301d35ec5b45';
export const ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER = 'f47e3974-434e-49b6-aae0-66bf18a77ef4';

export default defineObject({
  universalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'engagement',
  namePlural: 'engagements',
  labelSingular: 'Engagement',
  labelPlural: 'Engagements',
  description: 'A logged contact with a company: meeting, call, email or event',
  icon: 'IconMessages',
  labelIdentifierFieldMetadataUniversalIdentifier:
    ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Subject',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'kind',
      label: 'Kind',
      icon: 'IconCategory',
      options: [
        { id: '320cedac-6bf0-45c7-9fe0-a0d940653a35', value: ENGAGEMENT_KIND.MEETING, label: 'Meeting', position: 0, color: 'blue' },
        { id: 'acc6b8ac-de05-49e4-be4c-954c4c02c41a', value: ENGAGEMENT_KIND.CALL, label: 'Call', position: 1, color: 'green' },
        { id: 'f859e232-8ee0-48d1-ac38-ba53068a850e', value: ENGAGEMENT_KIND.EMAIL, label: 'Email', position: 2, color: 'gray' },
        { id: 'd66ab02b-dc69-452e-997c-28a051b76705', value: ENGAGEMENT_KIND.EVENT, label: 'Event', position: 3, color: 'purple' },
      ],
    },
    {
      universalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'date',
      label: 'Date',
      icon: 'IconCalendar',
    },
    {
      universalIdentifier: ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'nextStep',
      label: 'Next step',
      description: 'Copied into the linked opportunity as its next action',
      icon: 'IconArrowRight',
    },
    {
      universalIdentifier: ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'outcome',
      label: 'Outcome',
      description: 'What was agreed or learned; empty means not yet written up',
      icon: 'IconClipboardCheck',
    },
    {
      universalIdentifier: ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'outcomeDueAt',
      label: 'Outcome due at',
      description: 'Date plus 2 days, set by the app',
      icon: 'IconHourglassLow',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
  ],
});
