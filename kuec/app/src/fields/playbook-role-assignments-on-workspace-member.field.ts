import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER } from '../objects/playbook-role-assignment.object';
import { MEMBER_ON_PLAYBOOK_ROLE_ASSIGNMENT_FIELD_UNIVERSAL_IDENTIFIER } from './member-on-playbook-role-assignment.field';
import { fieldDescription } from '../i18n/field-guidance';

export const PLAYBOOK_ROLE_ASSIGNMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = 'f215ff99-905e-48b3-a476-b58ff045850f';

export default defineField({
  universalIdentifier: PLAYBOOK_ROLE_ASSIGNMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'playbookRoleAssignments',
  label: 'Playbook roles',
  description: fieldDescription('workspaceMember.playbookRoleAssignments'),
  icon: 'IconUsersGroup',
  relationTargetObjectMetadataUniversalIdentifier:
    PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: MEMBER_ON_PLAYBOOK_ROLE_ASSIGNMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
