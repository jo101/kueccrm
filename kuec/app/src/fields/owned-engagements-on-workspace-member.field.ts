import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-engagement.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_ENGAGEMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '48e033c7-cc6d-4b5c-9e61-8ac28d84e53c';

export default defineField({
  universalIdentifier: OWNED_ENGAGEMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedEngagements',
  label: 'Owned engagements',
  description: fieldDescription('workspaceMember.ownedEngagements'),
  icon: 'IconMessages',
  relationTargetObjectMetadataUniversalIdentifier:
    ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
