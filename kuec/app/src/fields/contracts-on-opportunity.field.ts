import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from './opportunity-on-contract.field';

export const CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '3b7e36bc-0743-4f6d-ad92-77e831ef47af';

export default defineField({
  universalIdentifier: CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'contracts',
  label: 'Contracts',
  icon: 'IconFileCertificate',
  relationTargetObjectMetadataUniversalIdentifier:
    CONTRACT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
