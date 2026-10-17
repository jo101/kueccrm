import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from './documents-on-contract.field';

export const CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = '1f74ec7d-4e07-4c1d-bed2-07ab814c1c04';

export default defineField({
  universalIdentifier: CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'contract',
  label: 'Contract',
  icon: 'IconFileCertificate',
  relationTargetObjectMetadataUniversalIdentifier:
    CONTRACT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: DOCUMENTS_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'contractId',
  },
});
