import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '10bf8b83-9a6e-4e03-bbd6-ac4e06813532';

export default defineField({
  universalIdentifier: LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'lostReason',
  label: 'Lost reason',
  description: fieldDescription('opportunity.lostReason'),
  icon: 'IconMoodSad',
});
