import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '79d90b92-46ae-4df7-8eb5-02c230ddedaf';

export default defineField({
  universalIdentifier: IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'isChampion',
  label: 'Champion',
  description: 'Argues for KUEC inside their organisation',
  icon: 'IconStar',
  isNullable: false,
  defaultValue: false,
});
