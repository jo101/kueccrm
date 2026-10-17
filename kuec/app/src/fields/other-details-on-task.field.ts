import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER = '0b49205b-daa5-4d41-8929-6c69aac4daed';

export default defineField({
  universalIdentifier: OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.TEXT,
  name: 'otherDetails',
  label: 'Other details',
  description: fieldDescription('task.otherDetails'),
  icon: 'IconNotes',
});
