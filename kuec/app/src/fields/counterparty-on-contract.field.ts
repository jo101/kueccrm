import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from './contracts-on-company.field';
import { fieldDescription } from '../i18n/field-guidance';

export const COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER = 'a6dfde75-2dd8-4e70-9420-b00f52733888';

export default defineField({
  universalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'counterparty',
  label: 'Counterparty',
  description: fieldDescription('contract.counterparty'),
  icon: 'IconBuildingSkyscraper',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'counterpartyId',
  },
});
