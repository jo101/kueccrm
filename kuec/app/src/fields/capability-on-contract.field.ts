import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { CONTRACTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER } from './contracts-on-capability.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAPABILITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER = '2200b3ef-57cc-4948-8a17-839d78b98ec4';

export default defineField({
  universalIdentifier: CAPABILITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'capability',
  label: 'Capability',
  description: fieldDescription('contract.capability'),
  icon: 'IconFlask',
  relationTargetObjectMetadataUniversalIdentifier:
    CAPABILITY_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CONTRACTS_ON_CAPABILITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'capabilityId',
  },
});
