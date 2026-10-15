import {
  defineView,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/counterparty-on-contract.field';
import { OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-contract.field';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-contract.field';
import {
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../objects/contract.object';

export const BD_CONTRACTS_IN_NEGOTIATION_VIEW_UNIVERSAL_IDENTIFIER = 'b783130b-1f4d-465a-a6dd-d1fca8221532';

export default defineView({
  universalIdentifier: BD_CONTRACTS_IN_NEGOTIATION_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Contracts in negotiation',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'c1818e28-a14b-4375-94b4-be9297f4287a', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'eb3c498c-7132-4380-a1ee-a1427285d395', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '4c033b4b-9c67-451c-b5ce-fabea49dd7db', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'f6098edc-aa9a-43fb-98a5-df8a7c92b00a', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '7bfa360c-48cc-436f-9a14-49d26ddbb54f', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '9f0e7434-452b-4b24-86e0-24c9d4f0e697', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '87e5d8ff-403c-4c3c-860a-3a4ec9525d02',
      fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CONTRACT_STATUS.IN_NEGOTIATION],
    },
  ],
});
