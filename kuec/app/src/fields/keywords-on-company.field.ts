import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const KEYWORDS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = 'a4d69fb7-5242-4db1-9489-7012a943f0ad';

// Search matches only the start of a word and does not normalise Arabic, so
// this field carries the forms people type. Filling rule: runbooks/12-global-features.md.
export default defineField({
  universalIdentifier: KEYWORDS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'keywords',
  label: 'Search keywords',
  description: fieldDescription('company.keywords'),
  icon: 'IconTags',
  isSearchable: true,
});
