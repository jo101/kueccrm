import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './project-on-work-package.field';
import { fieldDescription } from '../i18n/field-guidance';

export const WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = 'a354fada-1274-4977-a154-c7e309f6ec8f';

export default defineField({
  universalIdentifier: WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workPackages',
  label: 'Work packages',
  description: fieldDescription('project.workPackages'),
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
