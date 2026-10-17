import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from './counterparty-on-contract.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '7c77c1bd-62a0-4215-9a6d-df0f464649c1';

export default defineField({
  universalIdentifier: CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'contracts',
  label: 'Contracts',
  description: fieldDescription('company.contracts'),
  icon: 'IconFileCertificate',
  relationTargetObjectMetadataUniversalIdentifier:
    CONTRACT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
