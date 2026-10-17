import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { CAPABILITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from './capability-on-engagement.field';
import { fieldDescription } from '../i18n/field-guidance';

export const ENGAGEMENTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER = '602b11a0-9b96-434e-9f1b-4c55791031e1';

export default defineField({
  universalIdentifier: ENGAGEMENTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'engagements',
  label: 'Engagements',
  description: fieldDescription('capability.engagements'),
  icon: 'IconMessages',
  relationTargetObjectMetadataUniversalIdentifier:
    ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAPABILITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
