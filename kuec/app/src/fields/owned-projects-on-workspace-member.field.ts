import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_PROJECTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = 'f3688651-ff33-493e-9c94-754e6c6513d7';

export default defineField({
  universalIdentifier: OWNED_PROJECTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedProjects',
  label: 'Owned projects',
  description: fieldDescription('workspaceMember.ownedProjects'),
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
