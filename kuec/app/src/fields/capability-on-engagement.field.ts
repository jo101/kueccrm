import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { ENGAGEMENTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER } from './engagements-on-capability.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAPABILITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER = '266fa8d1-a3bc-413d-aeb9-6e13c85717a9';

export default defineField({
  universalIdentifier: CAPABILITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'capability',
  label: 'Capability',
  description: fieldDescription('engagement.capability'),
  icon: 'IconFlask',
  relationTargetObjectMetadataUniversalIdentifier:
    CAPABILITY_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: ENGAGEMENTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'capabilityId',
  },
});
