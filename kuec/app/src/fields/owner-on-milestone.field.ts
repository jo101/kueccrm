import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { OWNED_MILESTONES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-milestones-on-workspace-member.field';

export const OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER = 'df84bcf9-45ae-45c6-b86d-82807db1d2e1';

export default defineField({
  universalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_MILESTONES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
