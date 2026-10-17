import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'bd8d4960-bd42-43ec-a129-65475a719d0c';

export const OPPORTUNITY_SOURCE = {
  INBOUND: 'INBOUND',
  REFERRAL: 'REFERRAL',
  OUTREACH: 'OUTREACH',
  EVENT: 'EVENT',
  TENDER: 'TENDER',
  FACULTY: 'FACULTY',
  PARTNER: 'PARTNER',
} as const;

export default defineField({
  universalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'source',
  label: 'Source',
  description: 'Where the opportunity came from',
  icon: 'IconArrowFork',
  defaultValue: `'${OPPORTUNITY_SOURCE.INBOUND}'`,
  options: [
    {
      id: 'f2847582-721b-42a0-867f-7a44fed82449',
      value: OPPORTUNITY_SOURCE.INBOUND,
      label: 'Inbound enquiry',
      position: 0,
      color: 'green',
    },
    {
      id: '394c9a9d-c403-4dbb-93ea-6b9a872591c3',
      value: OPPORTUNITY_SOURCE.REFERRAL,
      label: 'Referral',
      position: 1,
      color: 'turquoise',
    },
    {
      id: 'dbbd15a9-af2f-4db6-a622-d08a8408a214',
      value: OPPORTUNITY_SOURCE.OUTREACH,
      label: 'Outreach',
      position: 2,
      color: 'blue',
    },
    {
      id: 'd04564b6-58e0-4860-bd0c-746fbb82828f',
      value: OPPORTUNITY_SOURCE.EVENT,
      label: 'Event or workshop',
      position: 3,
      color: 'purple',
    },
    {
      id: '500e3fde-66a9-4468-9ee8-4e9dd58823fa',
      value: OPPORTUNITY_SOURCE.TENDER,
      label: 'Tender or RFQ portal',
      position: 4,
      color: 'orange',
    },
    {
      id: '3f032642-e86e-451a-8676-661a26e15228',
      value: OPPORTUNITY_SOURCE.FACULTY,
      label: 'Faculty or researcher',
      position: 5,
      color: 'sky',
    },
    {
      id: '82553b69-9183-4a83-8b04-b8558bcb4332',
      value: OPPORTUNITY_SOURCE.PARTNER,
      label: 'Partner',
      position: 6,
      color: 'pink',
    },
  ],
});
