import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { OWNED_ENGAGEMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-engagements-on-workspace-member.field';

export const OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER = '675ec2c9-70e5-4399-9a2b-c47695724b9a';

export default defineField({
  universalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_ENGAGEMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
