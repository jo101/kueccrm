import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { THIS_YEAR_FILTER_VALUE } from '../../constants/view-filter-values';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/counterparty-on-contract.field';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-contract.field';
import {
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../objects/contract.object';

export const BD_CONTRACTS_SIGNED_THIS_YEAR_VIEW_UNIVERSAL_IDENTIFIER = '3b7475fd-75e1-4f2c-9c2b-680db5e81d51';

export default defineView({
  universalIdentifier: BD_CONTRACTS_SIGNED_THIS_YEAR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Contracts signed this year',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'a28e6625-5fcc-4b47-8a09-f8fd59d7ec60', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'bc54eb60-811e-4f48-8e6b-59cc02eea438', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '341f2390-2865-425a-b266-6f6feb1f433e', fieldMetadataUniversalIdentifier: CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'c17ff883-6fa9-4d9f-978d-00e328760e78', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '9297a999-a192-49f7-a3d6-7039c01ac0c3', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '29a7a000-fcd1-4678-ace7-3a95eea0fc1f', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'a3a8ae68-0f63-467b-8aba-9fb01af18c79',
      fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.EXPIRED, CONTRACT_STATUS.TERMINATED],
    },
    {
      universalIdentifier: '11fdb959-b483-4158-b88e-3d33581e9ed8',
      fieldMetadataUniversalIdentifier: CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_YEAR_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '94ce6ad5-1d2d-49ac-9ff2-19c5763b8c50',
      fieldMetadataUniversalIdentifier: CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
