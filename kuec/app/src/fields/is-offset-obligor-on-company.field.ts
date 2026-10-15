import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '3b505cda-f7f0-450f-883a-45aaf720dc76';

export default defineField({
  universalIdentifier: IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'isOffsetObligor',
  label: 'Offset obligor',
  description: 'Holds an offset obligation in the UAE',
  icon: 'IconScale',
  isNullable: false,
  defaultValue: false,
});
