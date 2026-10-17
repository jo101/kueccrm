import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './converted-opportunity-on-lead.field';

export const CONVERTED_FROM_LEADS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'e7ab5554-3050-467d-843d-397f41f90ade';

export default defineField({
  universalIdentifier: CONVERTED_FROM_LEADS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'convertedFromLeads',
  label: 'Latest conversion of',
  description: 'Leads whose latest conversion is this opportunity',
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
