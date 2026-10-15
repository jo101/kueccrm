import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './reviewer-on-work-package.field';

export const REVIEWED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '4ccf4080-c181-42d0-b127-ebbcc39ebbc7';

export default defineField({
  universalIdentifier: REVIEWED_WORK_PACKAGES_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'reviewedWorkPackages',
  label: 'Work packages to review',
  icon: 'IconEyeCheck',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
