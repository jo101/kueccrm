import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './person-on-document.field';

export const DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = 'e7cd84c4-ca92-4ed9-b1fc-43e93dab7113';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
