import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-milestone.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_MILESTONES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '5f0fbe0a-d562-4623-abac-7a3ee7c8eca1';

export default defineField({
  universalIdentifier: OWNED_MILESTONES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedMilestones',
  label: 'Owned milestones',
  description: fieldDescription('workspaceMember.ownedMilestones'),
  icon: 'IconFlag',
  relationTargetObjectMetadataUniversalIdentifier:
    MILESTONE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
