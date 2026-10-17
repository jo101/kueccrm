import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { OPPORTUNITIES_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER } from './opportunities-on-capability.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAPABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '52dc727a-bb93-475c-b737-2f48e7097a9a';

export default defineField({
  universalIdentifier: CAPABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'capability',
  label: 'Capability',
  description: fieldDescription('opportunity.capability'),
  icon: 'IconFlask',
  relationTargetObjectMetadataUniversalIdentifier:
    CAPABILITY_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITIES_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'capabilityId',
  },
});
