import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { OPPORTUNITIES_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './opportunities-on-lead.field';
import { fieldDescription } from '../i18n/field-guidance';

export const LEAD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '38dd5fa7-2faf-4157-a5a8-6075ead8b1c6';

export default defineField({
  universalIdentifier: LEAD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  description: fieldDescription('opportunity.lead'),
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITIES_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'leadId',
  },
});
