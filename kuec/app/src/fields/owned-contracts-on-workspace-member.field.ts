import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-contract.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_CONTRACTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '3bc4046f-6dca-4e4e-803f-0b487f6a4385';

export default defineField({
  universalIdentifier: OWNED_CONTRACTS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedContracts',
  label: 'Owned contracts',
  description: fieldDescription('workspaceMember.ownedContracts'),
  icon: 'IconFileCertificate',
  relationTargetObjectMetadataUniversalIdentifier:
    CONTRACT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
