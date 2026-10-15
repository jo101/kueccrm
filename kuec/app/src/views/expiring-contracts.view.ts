import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/counterparty-on-contract.field';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-contract.field';
import {
  CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/contract.object';

export const EXPIRING_CONTRACTS_VIEW_UNIVERSAL_IDENTIFIER = 'd0017804-9e12-4005-8bc5-739cf3a8539c';

export default defineView({
  universalIdentifier: EXPIRING_CONTRACTS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Expiring',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarX',
  position: 1,
  fields: [
    { universalIdentifier: '86f0e2a1-3c31-4fbb-9887-fb18435a4e79', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '2fe0cbb9-d08a-4bc3-9138-f19cfbfac0bc', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '4f1b2ac7-b193-434a-9ebf-2a302599b93a', fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'ca972371-33cd-4c0c-92a4-33c331bd44d7', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '28447e2b-279a-4021-8251-857285fec390', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '7cda2bea-d02f-46a8-83c4-7d6a3a46eb6c', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
  ],
  filters: [
    {
      universalIdentifier: 'd12c19d8-8b70-4693-b5bd-ef061d2ce794',
      fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_STATUS.SIGNED],
    },
    {
      universalIdentifier: 'cc9e2ef4-6373-4bf7-a848-3642e37362e7',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '795f7723-2a8a-4af4-a420-b2882f6a8ce9',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
