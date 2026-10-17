import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-contract.field';
import {
  CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_KIND,
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
} from '../objects/contract.object';

export const CONTRACTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = '873d9b96-9add-4f89-afd7-ac337d3c8afc';
const CONTRACTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'f1e950d0-dd26-40f9-967a-5467bb71346b';

// Kind or Department set to Other with Other details empty.
export default defineView({
  universalIdentifier: CONTRACTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: '71e4657f-b42d-408c-8bff-c3d3cef2410d', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e32ac56c-b777-4b45-bc96-7a2f7fed6441', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'ce4c2a23-c47b-4d6e-a09a-c7a964ae48c7', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'd0dccd4e-a87b-4a4c-a85d-78c236a79b77', fieldMetadataUniversalIdentifier: CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'e81b8820-41ac-4e11-b2d8-effb97201c3d', fieldMetadataUniversalIdentifier: CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '5ee11470-7e9d-4983-8b02-eb97048584ff',
      fieldMetadataUniversalIdentifier: CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: 'd1539385-3f6b-4192-af18-3120cd48c621',
      fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_KIND.OTHER],
      viewFilterGroupUniversalIdentifier: CONTRACTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '77ae6a42-78d7-4295-b69f-d450e6f6f166',
      fieldMetadataUniversalIdentifier: CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
      viewFilterGroupUniversalIdentifier: CONTRACTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: CONTRACTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
