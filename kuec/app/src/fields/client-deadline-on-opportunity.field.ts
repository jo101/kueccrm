import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const CLIENT_DEADLINE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '34e83c5c-0032-410d-8ff1-87c33ad5d150';

export default defineField({
  universalIdentifier: CLIENT_DEADLINE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'clientDeadline',
  label: 'Client deadline',
  description: fieldDescription('opportunity.clientDeadline'),
  icon: 'IconCalendarExclamation',
});
