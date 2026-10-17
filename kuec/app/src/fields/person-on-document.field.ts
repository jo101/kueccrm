import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from './documents-on-person.field';

export const PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = '405b4ea2-d822-450b-af35-52d2cc2de599';

export default defineField({
  universalIdentifier: PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'person',
  label: 'Person',
  icon: 'IconUser',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: DOCUMENTS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'personId',
  },
});
