import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from './work-packages-on-milestone.field';
import { fieldDescription } from '../i18n/field-guidance';

export const MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = 'f9403a95-0a0f-41a2-900d-55466ecfbf4a';

export default defineField({
  universalIdentifier: MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'milestone',
  label: 'Milestone',
  description: fieldDescription('workPackage.milestone'),
  icon: 'IconFlag',
  relationTargetObjectMetadataUniversalIdentifier:
    MILESTONE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'milestoneId',
  },
});
