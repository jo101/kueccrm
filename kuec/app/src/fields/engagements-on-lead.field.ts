import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { LEAD_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from './lead-on-engagement.field';

export const ENGAGEMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = '9c529ca5-b84c-42cc-bfab-f7cc4862e487';

export default defineField({
  universalIdentifier: ENGAGEMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'engagements',
  label: 'Engagements',
  icon: 'IconMessages',
  relationTargetObjectMetadataUniversalIdentifier:
    ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
