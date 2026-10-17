import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-document.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_DOCUMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = 'f0ece96c-0faa-44e4-bf23-06185ca50236';

export default defineField({
  universalIdentifier: OWNED_DOCUMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedDocuments',
  label: 'Owned documents',
  description: fieldDescription('workspaceMember.ownedDocuments'),
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
