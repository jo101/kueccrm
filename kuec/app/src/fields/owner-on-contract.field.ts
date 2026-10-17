import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { OWNED_CONTRACTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './owned-contracts-on-workspace-member.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER = '6d0a1b0a-4ae4-4740-984c-9fdc60b02a70';

export default defineField({
  universalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'owner',
  label: 'Owner',
  description: fieldDescription('contract.owner'),
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: OWNED_CONTRACTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'ownerId',
  },
});
