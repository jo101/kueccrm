import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'b7506a3b-c19c-4346-8a28-1bc23bd22f34';

export default defineField({
  universalIdentifier: NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'nextActionFlaggedOn',
  label: 'Next action flagged on',
  description: fieldDescription('opportunity.nextActionFlaggedOn'),
  icon: 'IconFlag',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
