import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const DESCRIPTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'cae440e9-6e3e-4c1a-a29b-10d90030b58a';

export default defineField({
  universalIdentifier: DESCRIPTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'description',
  label: 'Description',
  description: fieldDescription('opportunity.description'),
  icon: 'IconFileDescription',
  isSearchable: true,
});
