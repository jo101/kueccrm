import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './milestone-on-work-package.field';

export const WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER = '0e1407de-c4ba-48c2-b35f-5f3dba58c771';

export default defineField({
  universalIdentifier: WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workPackages',
  label: 'Work packages',
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
