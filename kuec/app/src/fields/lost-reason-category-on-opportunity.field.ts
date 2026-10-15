import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '9e423fd4-f6e8-4a5f-ad12-52cd4dcb91f9';

export const LOST_REASON_CATEGORY = {
  PRICE: 'PRICE',
  TIMING: 'TIMING',
  NO_BUDGET: 'NO_BUDGET',
  COMPETITOR: 'COMPETITOR',
  TECHNICAL_FIT: 'TECHNICAL_FIT',
  NO_RESPONSE: 'NO_RESPONSE',
  CAPACITY: 'CAPACITY',
  OTHER: 'OTHER',
} as const;

export default defineField({
  universalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'lostReasonCategory',
  label: 'Lost reason category',
  description: 'Groupable reason; the Lost reason text holds the detail',
  icon: 'IconMoodSad',
  options: [
    {
      id: '18204126-6b67-4596-8314-6aea24b5535d',
      value: LOST_REASON_CATEGORY.PRICE,
      label: 'Price',
      position: 0,
      color: 'red',
    },
    {
      id: 'a76d3903-9b13-4393-8f5d-4e8df8142cf9',
      value: LOST_REASON_CATEGORY.TIMING,
      label: 'Timing',
      position: 1,
      color: 'orange',
    },
    {
      id: '8cfc92b4-7909-43ae-b8da-a804385af148',
      value: LOST_REASON_CATEGORY.NO_BUDGET,
      label: 'No budget',
      position: 2,
      color: 'amber',
    },
    {
      id: 'f0b29cf9-b9fd-433c-a26d-634f843d1efb',
      value: LOST_REASON_CATEGORY.COMPETITOR,
      label: 'Went to a competitor',
      position: 3,
      color: 'purple',
    },
    {
      id: 'd9d46608-d48f-4b0f-a7c8-58d666518406',
      value: LOST_REASON_CATEGORY.TECHNICAL_FIT,
      label: 'Technical fit',
      position: 4,
      color: 'blue',
    },
    {
      id: 'ab317829-787c-427f-8fbe-85a8709723ff',
      value: LOST_REASON_CATEGORY.NO_RESPONSE,
      label: 'No response',
      position: 5,
      color: 'gray',
    },
    {
      id: 'af04b335-3d41-446d-9e4d-8ea418024941',
      value: LOST_REASON_CATEGORY.CAPACITY,
      label: 'Our capacity',
      position: 6,
      color: 'pink',
    },
    {
      id: 'd5c8b815-fc54-4d73-8c3d-666be1615582',
      value: LOST_REASON_CATEGORY.OTHER,
      label: 'Other',
      position: 7,
      color: 'gray',
    },
  ],
});
