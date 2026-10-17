import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const NAME_ARABIC_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '7a93c061-e67b-4fec-927d-ecf9b857d5d9';

// Searchable must be declared here: a field made searchable in Settings reverts on the next sync.
export default defineField({
  universalIdentifier: NAME_ARABIC_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'nameArabic',
  label: 'Name (Arabic)',
  description: fieldDescription('person.nameArabic'),
  icon: 'IconLanguage',
  isSearchable: true,
});
