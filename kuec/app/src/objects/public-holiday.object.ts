import { defineObject, FieldType } from 'twenty-sdk/define';

export const PUBLIC_HOLIDAY_UNIVERSAL_IDENTIFIER = '81bc65ae-89c6-4d4b-8bf0-0373fe074882';

export const PUBLIC_HOLIDAY_NAME_FIELD_UNIVERSAL_IDENTIFIER = '854efa3a-d3ec-47f6-ab5b-1facb30de86b';

// UAE holiday dates follow moon sighting, so they are entered as data each year, never coded.
export default defineObject({
  universalIdentifier: PUBLIC_HOLIDAY_UNIVERSAL_IDENTIFIER,
  nameSingular: 'publicHoliday',
  namePlural: 'publicHolidays',
  labelSingular: 'UAE public holiday',
  labelPlural: 'UAE public holidays',
  description: 'Days excluded from business-day counts',
  icon: 'IconBeach',
  labelIdentifierFieldMetadataUniversalIdentifier:
    PUBLIC_HOLIDAY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: PUBLIC_HOLIDAY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: 'f62ff679-22b4-488f-bb89-a3029ce9d143',
      type: FieldType.DATE,
      name: 'date',
      label: 'Date',
      icon: 'IconCalendar',
    },
  ],
});
