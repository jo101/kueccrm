import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'e6b85f62-3fbb-4abd-bdb7-c76f1e8b9458';

export default defineField({
  universalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'stageEnteredAt',
  label: 'Stage entered at',
  description: fieldDescription('opportunity.stageEnteredAt'),
  icon: 'IconClockPlay',
  writability: MetadataWritability.APPLICATION,
});
