import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './project-on-document.field';
import { fieldDescription } from '../i18n/field-guidance';

export const DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = '4953dc3f-6c49-4c8c-bf37-cb79bb4563e6';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  description: fieldDescription('project.documents'),
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
