import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = 'd652c626-b9bd-4cf6-a481-00bae7c5ddea';

export const COMPANY_SIZE_CLASS = {
  STARTUP: 'STARTUP',
  SME: 'SME',
  LARGE_ENTERPRISE: 'LARGE_ENTERPRISE',
  GOVERNMENT: 'GOVERNMENT',
} as const;

export default defineField({
  universalIdentifier: SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'sizeClass',
  label: 'Size class',
  description: 'The kind of organisation: startup, SME, large enterprise, or government',
  icon: 'IconBuildingSkyscraper',
  options: [
    {
      id: 'fff4eb50-69db-47d1-a670-d674bda8013d',
      value: COMPANY_SIZE_CLASS.STARTUP,
      label: 'Startup',
      position: 0,
      color: 'turquoise',
    },
    {
      id: '224664f7-eb68-4491-9aea-95af1981ea27',
      value: COMPANY_SIZE_CLASS.SME,
      label: 'SME',
      position: 1,
      color: 'sky',
    },
    {
      id: '32616040-6494-47b9-ab60-8b5680c771ec',
      value: COMPANY_SIZE_CLASS.LARGE_ENTERPRISE,
      label: 'Large enterprise',
      position: 2,
      color: 'blue',
    },
    {
      id: '58791b5c-010a-4bf8-b8c4-1aac570f42ed',
      value: COMPANY_SIZE_CLASS.GOVERNMENT,
      label: 'Government or semi-government',
      position: 3,
      color: 'green',
    },
  ],
});
