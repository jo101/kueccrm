import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { OWNED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-work-packages-on-workspace-member.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = '1f167774-2f39-45fa-ac87-fd8438bf2ae3';

export default defineField({
  universalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  description: fieldDescription('workPackage.owner'),
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
