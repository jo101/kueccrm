import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'b7506a3b-c19c-4346-8a28-1bc23bd22f34';

export default defineField({
  universalIdentifier: NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'nextActionFlaggedOn',
  label: 'Next action flagged on',
  description: 'Last day the next-action guard flagged this opportunity, in Asia/Dubai',
  icon: 'IconFlag',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
