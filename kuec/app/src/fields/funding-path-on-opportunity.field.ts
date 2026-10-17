import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '56083bf8-56b8-48bb-9444-f4533f3d3781';

export const OPPORTUNITY_FUNDING_PATH = {
  CUSTOMER_BUDGET: 'CUSTOMER_BUDGET',
  OFFSET_CREDIT: 'OFFSET_CREDIT',
  ICV: 'ICV',
  GOVERNMENT_GRANT: 'GOVERNMENT_GRANT',
  CO_FUNDING_PROGRAMME: 'CO_FUNDING_PROGRAMME',
  SPONSOR: 'SPONSOR',
  UNKNOWN: 'UNKNOWN',
  OTHER: 'OTHER',
} as const;

export default defineField({
  universalIdentifier: FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'fundingPath',
  label: 'Funding path',
  description: 'Who pays for the work',
  icon: 'IconCoins',
  options: [
    {
      id: 'd1ca457b-b856-46e9-9ae5-5d4210fbe847',
      value: OPPORTUNITY_FUNDING_PATH.CUSTOMER_BUDGET,
      label: 'Customer budget',
      position: 0,
      color: 'blue',
    },
    {
      id: '9e59a18f-391b-443c-80fc-c65385f76cfc',
      value: OPPORTUNITY_FUNDING_PATH.OFFSET_CREDIT,
      label: 'Offset credit',
      position: 1,
      color: 'green',
    },
    {
      id: 'f700741f-b5f8-4dcf-9f24-6dd655ddd7d2',
      value: OPPORTUNITY_FUNDING_PATH.ICV,
      label: 'ICV',
      position: 2,
      color: 'purple',
    },
    {
      id: '0ef6e6ec-429e-49bf-9198-8f1ceec9adb7',
      value: OPPORTUNITY_FUNDING_PATH.GOVERNMENT_GRANT,
      label: 'Government grant',
      position: 3,
      color: 'orange',
    },
    {
      id: '44837b6f-f264-4a23-be94-3f36b3e3a2b5',
      value: OPPORTUNITY_FUNDING_PATH.CO_FUNDING_PROGRAMME,
      label: 'Co-funding programme',
      position: 4,
      color: 'turquoise',
    },
    {
      id: 'a18bf5dc-f267-432f-b6e8-f89083bed48c',
      value: OPPORTUNITY_FUNDING_PATH.SPONSOR,
      label: 'Sponsor',
      position: 5,
      color: 'pink',
    },
    {
      id: '634a130b-f02a-4f27-8d75-e3703010fcce',
      value: OPPORTUNITY_FUNDING_PATH.UNKNOWN,
      label: 'Unknown',
      position: 6,
      color: 'sky',
    },
    {
      id: '14ab2be2-ca43-4fb3-8991-9566e409d780',
      value: OPPORTUNITY_FUNDING_PATH.OTHER,
      label: 'Other',
      position: 7,
      color: 'gray',
    },
  ],
});
