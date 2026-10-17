import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER } from '../objects/playbook-role-assignment.object';
import { PLAYBOOK_ROLE_ASSIGNMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './playbook-role-assignments-on-workspace-member.field';
import { fieldDescription } from '../i18n/field-guidance';

export const MEMBER_ON_PLAYBOOK_ROLE_ASSIGNMENT_FIELD_UNIVERSAL_IDENTIFIER = '9535a0ad-6765-434f-91c4-253f0a436d3d';

export default defineField({
  universalIdentifier: MEMBER_ON_PLAYBOOK_ROLE_ASSIGNMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'member',
  label: 'Member',
  description: fieldDescription('playbookRoleAssignment.member'),
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: PLAYBOOK_ROLE_ASSIGNMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'memberId',
  },
});
