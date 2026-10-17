import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '67778937-5501-480a-9f19-afb877c5bb17';

export const OPPORTUNITY_OFFERING = {
  IP_LICENCE: 'IP_LICENCE',
  TECHNICAL_SERVICE: 'TECHNICAL_SERVICE',
  LAB_TESTING: 'LAB_TESTING',
  EQUIPMENT_ACCESS: 'EQUIPMENT_ACCESS',
  RESEARCH_COLLABORATION: 'RESEARCH_COLLABORATION',
  STARTUP_PRODUCT: 'STARTUP_PRODUCT',
  SUBSIDIARY_SERVICE: 'SUBSIDIARY_SERVICE',
  SPONSORED_CHAIR: 'SPONSORED_CHAIR',
  LEASING: 'LEASING',
  TRAINING: 'TRAINING',
  ADVISORY: 'ADVISORY',
  OTHER: 'OTHER',
} as const;

export default defineField({
  universalIdentifier: OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'offering',
  label: 'Offering',
  description: 'Every KUEC offering in the deal; pick all that apply',
  icon: 'IconPackages',
  options: [
    {
      id: 'd1296e9f-5fe3-4753-b7f0-883198121e2a',
      value: OPPORTUNITY_OFFERING.IP_LICENCE,
      label: 'IP licence',
      position: 0,
      color: 'blue',
    },
    {
      id: 'b275ec01-4141-46bb-b0a7-7383e8d2644a',
      value: OPPORTUNITY_OFFERING.TECHNICAL_SERVICE,
      label: 'Technical service',
      position: 1,
      color: 'green',
    },
    {
      id: '8cdc0855-b003-425e-a9d7-3b00fbe0b263',
      value: OPPORTUNITY_OFFERING.LAB_TESTING,
      label: 'Lab testing',
      position: 2,
      color: 'purple',
    },
    {
      id: '644b5e7e-d61f-4438-b9b0-6949ba3b99b7',
      value: OPPORTUNITY_OFFERING.EQUIPMENT_ACCESS,
      label: 'Equipment access',
      position: 3,
      color: 'orange',
    },
    {
      id: '18cc42b1-5e8b-454f-af28-fa8850fd3367',
      value: OPPORTUNITY_OFFERING.RESEARCH_COLLABORATION,
      label: 'Research collaboration',
      position: 4,
      color: 'turquoise',
    },
    {
      id: '13f2b097-5f23-418a-9f03-cb7c9e4af7fd',
      value: OPPORTUNITY_OFFERING.STARTUP_PRODUCT,
      label: 'Startup product',
      position: 5,
      color: 'pink',
    },
    {
      id: 'da74dcf0-7511-4846-a81b-4db339095f42',
      value: OPPORTUNITY_OFFERING.SUBSIDIARY_SERVICE,
      label: 'Subsidiary service',
      position: 6,
      color: 'sky',
    },
    {
      id: '44274be1-282b-452c-8aa0-5e8f218aec88',
      value: OPPORTUNITY_OFFERING.SPONSORED_CHAIR,
      label: 'Sponsored chair',
      position: 7,
      color: 'amber',
    },
    {
      id: '4d9b4b53-150c-47a4-adc2-c0db9188b54f',
      value: OPPORTUNITY_OFFERING.LEASING,
      label: 'Leasing',
      position: 8,
      color: 'red',
    },
    {
      id: '33a5a753-0d79-431d-9015-4732dfe66d53',
      value: OPPORTUNITY_OFFERING.TRAINING,
      label: 'Training',
      position: 9,
      color: 'violet',
    },
    {
      id: '4aabe842-d7e3-415a-bf06-2292d0387b35',
      value: OPPORTUNITY_OFFERING.ADVISORY,
      label: 'Advisory',
      position: 10,
      color: 'jade',
    },
    {
      id: 'bf576783-be6b-43e8-a200-84c402736894',
      value: OPPORTUNITY_OFFERING.OTHER,
      label: 'Other',
      position: 11,
      color: 'gray',
    },
  ],
});
