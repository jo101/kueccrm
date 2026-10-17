import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '8a2d006a-b219-448b-a250-6d8905a703d0';

export const COMPANY_RELATIONSHIP_TYPE = {
  PROSPECT: 'PROSPECT',
  CUSTOMER: 'CUSTOMER',
  PARTNER: 'PARTNER',
  SPONSOR: 'SPONSOR',
  GOVERNMENT: 'GOVERNMENT',
  INVESTOR: 'INVESTOR',
  PORTFOLIO_COMPANY: 'PORTFOLIO_COMPANY',
  SUPPLIER: 'SUPPLIER',
  UNIVERSITY_UNIT: 'UNIVERSITY_UNIT',
  OTHER: 'OTHER',
} as const;

export default defineField({
  universalIdentifier: RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'relationshipType',
  label: 'Relationship type',
  description: 'The main relationship KUEC has with this company',
  icon: 'IconHeartHandshake',
  options: [
    {
      id: 'afa4942b-1b69-45a8-8469-10b471394024',
      value: COMPANY_RELATIONSHIP_TYPE.PROSPECT,
      label: 'Prospect',
      position: 0,
      color: 'blue',
    },
    {
      id: '74eed8b0-05f9-41c6-9d5b-52b628fb4faf',
      value: COMPANY_RELATIONSHIP_TYPE.CUSTOMER,
      label: 'Customer',
      position: 1,
      color: 'green',
    },
    {
      id: 'bd58f23f-6a33-449a-a80a-861696ad2347',
      value: COMPANY_RELATIONSHIP_TYPE.PARTNER,
      label: 'Partner',
      position: 2,
      color: 'purple',
    },
    {
      id: '7ef4292f-a3ef-444a-a65b-120fd5a95ef5',
      value: COMPANY_RELATIONSHIP_TYPE.SPONSOR,
      label: 'Sponsor',
      position: 3,
      color: 'orange',
    },
    {
      id: '9544442d-f76c-4fdf-ae2f-649a1d1a06c6',
      value: COMPANY_RELATIONSHIP_TYPE.GOVERNMENT,
      label: 'Government',
      position: 4,
      color: 'turquoise',
    },
    {
      id: '99e65600-1f4c-4c66-8969-6882c48e0a77',
      value: COMPANY_RELATIONSHIP_TYPE.INVESTOR,
      label: 'Investor',
      position: 5,
      color: 'pink',
    },
    {
      id: '761ac561-451c-47bf-88f5-ee326bb3fc1e',
      value: COMPANY_RELATIONSHIP_TYPE.PORTFOLIO_COMPANY,
      label: 'Portfolio company',
      position: 6,
      color: 'sky',
    },
    {
      id: '32e174e7-92b8-4912-944e-50539d556a51',
      value: COMPANY_RELATIONSHIP_TYPE.SUPPLIER,
      label: 'Supplier',
      position: 7,
      color: 'amber',
    },
    {
      id: 'b15626e9-ee04-4c84-92e9-52fc41e67a51',
      value: COMPANY_RELATIONSHIP_TYPE.UNIVERSITY_UNIT,
      label: 'University unit',
      position: 8,
      color: 'red',
    },
    {
      id: '8093e291-6e44-4e6d-9dd5-a686585ee4a4',
      value: COMPANY_RELATIONSHIP_TYPE.OTHER,
      label: 'Other',
      position: 9,
      color: 'gray',
    },
  ],
});
