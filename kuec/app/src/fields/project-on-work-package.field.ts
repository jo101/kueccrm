import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './work-packages-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER = 'f7b83ebd-e975-4297-a521-3b8575e4232d';

export default defineField({
  universalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'project',
  label: 'Project',
  description: fieldDescription('workPackage.project'),
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'projectId',
  },
});
