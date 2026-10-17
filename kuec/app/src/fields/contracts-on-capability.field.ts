import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { CAPABILITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from './capability-on-contract.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CONTRACTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER = '27172d36-2d4b-48ce-a4bd-2ffc0fae0c39';

export default defineField({
  universalIdentifier: CONTRACTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'contracts',
  label: 'Contracts',
  description: fieldDescription('capability.contracts'),
  icon: 'IconFileCertificate',
  relationTargetObjectMetadataUniversalIdentifier:
    CONTRACT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAPABILITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
