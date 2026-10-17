import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '51a5f237-d4de-416e-86fb-8ec608756cb0';

export default defineField({
  universalIdentifier: OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'otherDetails',
  label: 'Other details',
  description: fieldDescription('company.otherDetails'),
  icon: 'IconNotes',
});
