import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './documents-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = '246f7a3c-f507-419c-8fdd-264c7fa85c60';

export default defineField({
  universalIdentifier: PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'project',
  label: 'Project',
  description: fieldDescription('document.project'),
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projectId',
  },
});
