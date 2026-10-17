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

export const CONTRACTS_PAST_EXPIRY_STILL_SIGNED_VIEW_UNIVERSAL_IDENTIFIER = 'dbac3ef5-68a2-4547-ac41-760b760b27ee';

// Nothing moves a contract to Expired on its own, so a Signed contract past its
// expiry date is either renewed (new date) or expired (new status) by hand.
export default defineView({
  universalIdentifier: CONTRACTS_PAST_EXPIRY_STILL_SIGNED_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: past expiry, still Signed',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFileAlert',
  position: 15,
  fields: [
    { universalIdentifier: 'b72710d3-e291-4ef6-8104-d025847ed2b7', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd0bec735-6429-4434-882a-5869dd9bfe46', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'c0acbb12-9693-4ef4-a59e-900f1f289a47', fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '87618313-2c39-4a63-8805-7d7f24e30c0d', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '21501722-fd9c-4542-8583-b0f0def9e9b0', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '5722f8cb-a35e-488a-bd30-c38e8b363cf4', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
  ],
  filters: [
    {
      universalIdentifier: '00d748c4-db3b-48f3-94e1-349060f4211f',
      fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_STATUS.SIGNED],
    },
    {
      universalIdentifier: 'd37ad3d9-590c-4f3c-b9ac-3b80d049b641',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '5d078be3-aba3-4661-b253-3d755a2db72b',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
