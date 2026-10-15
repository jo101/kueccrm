import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '8b4c41bc-22e9-4e19-a82d-0a4634f998db';

export default defineField({
  universalIdentifier: STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'staleFrom',
  label: 'Stale from',
  description: 'Stage entered at plus 30 days, set by the app',
  icon: 'IconHourglassLow',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
