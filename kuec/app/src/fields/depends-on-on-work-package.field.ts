import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './dependents-on-work-package.field';

export const DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = '1df6bc29-f2f2-4dfe-8adb-3cca45efedc0';

export default defineField({
  universalIdentifier: DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'dependsOn',
  label: 'Depends on',
  icon: 'IconArrowBarToLeft',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'dependsOnId',
  },
});
