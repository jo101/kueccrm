import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '370d0955-77a7-4562-8993-d78df9dd3b9a';

export default defineField({
  universalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'nextAction',
  label: 'Next action',
  description: fieldDescription('opportunity.nextAction'),
  icon: 'IconArrowRight',
  isSearchable: true,
});
