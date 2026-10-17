import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { REVIEWED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './reviewed-work-packages-on-workspace-member.field';
import { fieldDescription } from '../i18n/field-guidance';

export const REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = '42be5873-e406-4059-9807-e7b43a5352c6';

export default defineField({
  universalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'reviewer',
  label: 'Reviewer',
  description: fieldDescription('workPackage.reviewer'),
  icon: 'IconEyeCheck',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: REVIEWED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'reviewerId',
  },
});
