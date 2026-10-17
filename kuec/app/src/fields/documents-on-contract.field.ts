import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './contract-on-document.field';

export const DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER = 'a19199fe-da18-426b-8e74-58c31715a4ea';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
