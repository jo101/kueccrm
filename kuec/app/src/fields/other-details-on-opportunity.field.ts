import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'b93c1d5b-9ea5-44a2-a097-12c1f36769d6';

export default defineField({
  universalIdentifier: OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'otherDetails',
  label: 'Other details',
  description: fieldDescription('opportunity.otherDetails'),
  icon: 'IconNotes',
});
