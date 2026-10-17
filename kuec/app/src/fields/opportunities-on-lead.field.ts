import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { LEAD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './lead-on-opportunity.field';

export const OPPORTUNITIES_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = 'dee273ac-987b-4b3b-b789-cc5cd7b369fa';

export default defineField({
  universalIdentifier: OPPORTUNITIES_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunities',
  label: 'Opportunities',
  description: 'Every opportunity converted from this lead, cross-sell included',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
