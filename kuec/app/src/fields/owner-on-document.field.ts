import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { OWNED_DOCUMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-documents-on-workspace-member.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = '2cb0d54d-8e41-4f17-8c1d-1c85bb5d232b';

export default defineField({
  universalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  description: fieldDescription('document.owner'),
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_DOCUMENTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
