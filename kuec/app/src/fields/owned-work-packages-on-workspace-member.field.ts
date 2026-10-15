import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-work-package.field';

export const OWNED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '282861ef-d9a3-45cb-8366-31c7df4c5cb9';

export default defineField({
  universalIdentifier: OWNED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedWorkPackages',
  label: 'Owned work packages',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
