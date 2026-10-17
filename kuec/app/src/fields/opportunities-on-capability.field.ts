import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CAPABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './capability-on-opportunity.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OPPORTUNITIES_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER = 'badd1725-b38f-46ba-8b99-a59357baf0b2';

export default defineField({
  universalIdentifier: OPPORTUNITIES_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunities',
  label: 'Opportunities',
  description: fieldDescription('capability.opportunities'),
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: CAPABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
