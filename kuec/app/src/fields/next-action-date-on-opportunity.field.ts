import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'a0da101e-b702-4c9e-aa9a-5d9b5287a0e0';

export default defineField({
  universalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'nextActionDate',
  label: 'Next action date',
  description: fieldDescription('opportunity.nextActionDate'),
  icon: 'IconCalendarDue',
});
