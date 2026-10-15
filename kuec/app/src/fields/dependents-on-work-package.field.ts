import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './depends-on-on-work-package.field';

export const DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = '80d306f7-0107-4dff-8380-07d62d764d47';

export default defineField({
  universalIdentifier: DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'dependents',
  label: 'Dependents',
  icon: 'IconArrowBarToRight',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
