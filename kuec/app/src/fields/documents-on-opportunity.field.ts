import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './opportunity-on-document.field';

export const DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '496ce5aa-ea85-4e42-9624-f83cfa66342a';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
