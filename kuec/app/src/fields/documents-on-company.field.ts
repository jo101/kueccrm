import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './company-on-document.field';
import { fieldDescription } from '../i18n/field-guidance';

export const DOCUMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '98241694-fbab-4eb7-8438-0183470db4a5';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  description: fieldDescription('company.documents'),
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
