import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { CONVERTED_FROM_LEADS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './converted-from-leads-on-opportunity.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = '3ff517fe-2ab0-4c6d-ac4c-f3f1d631ad36';

export default defineField({
  universalIdentifier: CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'convertedOpportunity',
  label: 'Converted opportunity',
  description: fieldDescription('lead.convertedOpportunity'),
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: CONVERTED_FROM_LEADS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'convertedOpportunityId',
  },
});
