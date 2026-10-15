import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { OWNED_PROJECTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-projects-on-workspace-member.field';

export const OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = '379e432a-325b-404d-9701-8d716bfe6146';

export default defineField({
  universalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_PROJECTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
