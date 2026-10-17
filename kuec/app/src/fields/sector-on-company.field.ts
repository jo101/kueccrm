import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '5306e386-af98-4ac0-8fd5-f88b5658aaf7';

export const COMPANY_SECTOR = {
  OIL_AND_GAS: 'OIL_AND_GAS',
  ENERGY_AND_UTILITIES: 'ENERGY_AND_UTILITIES',
  DEFENCE_AND_SECURITY: 'DEFENCE_AND_SECURITY',
  AEROSPACE: 'AEROSPACE',
  HEALTHCARE: 'HEALTHCARE',
  ICT: 'ICT',
  MANUFACTURING: 'MANUFACTURING',
  TRANSPORT_AND_LOGISTICS: 'TRANSPORT_AND_LOGISTICS',
  GOVERNMENT: 'GOVERNMENT',
  OTHER: 'OTHER',
} as const;

export default defineField({
  universalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'sector',
  label: 'Sector',
  description: 'The company\'s main industry',
  icon: 'IconBuildingFactory2',
  options: [
    {
      id: '61a397e6-3c04-4a51-a226-ce27783c1504',
      value: COMPANY_SECTOR.OIL_AND_GAS,
      label: 'Oil and gas',
      position: 0,
      color: 'amber',
    },
    {
      id: 'fc2a85ad-1169-400d-8f0f-4f9acee50a1a',
      value: COMPANY_SECTOR.ENERGY_AND_UTILITIES,
      label: 'Energy and utilities',
      position: 1,
      color: 'yellow',
    },
    {
      id: '12134ea2-12ca-435a-910a-ef206fada6ca',
      value: COMPANY_SECTOR.DEFENCE_AND_SECURITY,
      label: 'Defence and security',
      position: 2,
      color: 'red',
    },
    {
      id: 'f33ad3c6-9156-442a-85c8-a1d5f77fd1d4',
      value: COMPANY_SECTOR.AEROSPACE,
      label: 'Aerospace',
      position: 3,
      color: 'sky',
    },
    {
      id: '8f791745-83cd-4f2d-ba90-185881714451',
      value: COMPANY_SECTOR.HEALTHCARE,
      label: 'Healthcare and life sciences',
      position: 4,
      color: 'pink',
    },
    {
      id: 'aff91be0-d8d8-497b-9850-bfc6a5dfc4f7',
      value: COMPANY_SECTOR.ICT,
      label: 'ICT and digital',
      position: 5,
      color: 'blue',
    },
    {
      id: 'de688525-3571-490f-8cc0-478144a92a3e',
      value: COMPANY_SECTOR.MANUFACTURING,
      label: 'Advanced manufacturing',
      position: 6,
      color: 'purple',
    },
    {
      id: '2dc094ee-5286-41f6-b35a-84a77893cc11',
      value: COMPANY_SECTOR.TRANSPORT_AND_LOGISTICS,
      label: 'Transport and logistics',
      position: 7,
      color: 'turquoise',
    },
    {
      id: '73fc1c72-a402-45aa-8283-e646a8a5b513',
      value: COMPANY_SECTOR.GOVERNMENT,
      label: 'Government',
      position: 8,
      color: 'green',
    },
    {
      id: 'b387b140-c5ab-4501-a092-0c0a527f2d1e',
      value: COMPANY_SECTOR.OTHER,
      label: 'Other',
      position: 9,
      color: 'gray',
    },
  ],
});
