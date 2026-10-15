import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './milestones-on-project.field';

export const PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER = 'c6932dd8-89d4-4b7f-a6f4-206f6b6381b8';

export default defineField({
  universalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'project',
  label: 'Project',
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'projectId',
  },
});
