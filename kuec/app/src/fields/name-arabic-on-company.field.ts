import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const NAME_ARABIC_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '13c970f8-ba28-49d9-93c7-82fc0a305dd5';

// Searchable must be declared here: a field made searchable in Settings reverts on the next sync.
export default defineField({
  universalIdentifier: NAME_ARABIC_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'nameArabic',
  label: 'Name (Arabic)',
  description: fieldDescription('company.nameArabic'),
  icon: 'IconLanguage',
  isSearchable: true,
});
