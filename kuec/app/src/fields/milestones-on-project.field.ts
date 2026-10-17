import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from './project-on-milestone.field';
import { fieldDescription } from '../i18n/field-guidance';

export const MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = '0c34718a-d13c-4fe1-8bf8-141297a4fc27';

export default defineField({
  universalIdentifier: MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'milestones',
  label: 'Milestones',
  description: fieldDescription('project.milestones'),
  icon: 'IconFlag',
  relationTargetObjectMetadataUniversalIdentifier:
    MILESTONE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
