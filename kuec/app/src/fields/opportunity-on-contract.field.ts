import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './contracts-on-opportunity.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER = 'e71edaa7-005d-4e0e-ab7e-d90da1c3650d';

export default defineField({
  universalIdentifier: OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  description: fieldDescription('contract.opportunity'),
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
