import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  NEXT_90_DAYS_FILTER_VALUE,
  TODAY_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/counterparty-on-contract.field';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-contract.field';
import {
  CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../objects/contract.object';

export const BD_CONTRACTS_EXPIRING_IN_90_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '4295729a-af22-4bbb-b88f-bcb289836414';
const BD_CONTRACTS_EXPIRING_IN_90_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = '5ad326c0-581a-4e02-9e20-c1b78b98a575';

export default defineView({
  universalIdentifier: BD_CONTRACTS_EXPIRING_IN_90_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Contracts expiring in 90 days',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '7a6b7629-5783-4f62-a077-e80f979fcc32', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '54a69454-ec96-4c4c-ae1d-c80313388515', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '7294e556-4620-4b4f-87a6-09f21de219ab', fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'a26f385a-9de0-4339-9746-95d788c2211b', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'cc16ade1-75ca-4e50-9324-06d9de961820', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '6b166e00-79d0-4f69-b4ea-46c0d1d07576', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'e07f295f-b81f-4157-a009-a81f6f0410b9',
      fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_STATUS.SIGNED],
    },
    {
      universalIdentifier: 'a3f2e1bc-af5a-4268-827c-211241465375',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_CONTRACTS_EXPIRING_IN_90_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '3cb3d415-94a9-4157-9dbb-4e40b46c8791',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: NEXT_90_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_CONTRACTS_EXPIRING_IN_90_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: BD_CONTRACTS_EXPIRING_IN_90_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: '40fa0fbe-a4f0-4dac-852b-2561c26e6b06',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
