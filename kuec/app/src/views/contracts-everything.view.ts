import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/counterparty-on-contract.field';
import { OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-contract.field';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-contract.field';
import {
  CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/contract.object';

export const CONTRACTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '084b27fe-7a25-4b10-b3bd-8dfc8c6f0246';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: CONTRACTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '9ae563fb-0ae2-44d4-a309-0e1e7f3ff741', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f73c38d4-306d-46c9-b74d-56bd4a60e447', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'b35d9d07-4bea-40c6-b174-2b3a6f8c8ef4', fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0812e447-b6f1-4ecd-aade-8d188ac313d5', fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '0ae15bd1-b44b-448b-8bee-cb9f97ea1ea8', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '48872a48-16fc-4251-a593-59c28efc7d17', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: 'e72e2b26-57f3-4ae3-aefe-8d2c56555368', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 170 },
    { universalIdentifier: 'd8c5b4f3-9b9c-4556-9ee5-db779c9ebed0', fieldMetadataUniversalIdentifier: CONTRACT_SIGNED_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 140 },
    { universalIdentifier: '3c4a7691-c126-48eb-8df2-c1869ddebb67', fieldMetadataUniversalIdentifier: CONTRACT_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 130 },
    { universalIdentifier: 'ae23d20a-b0eb-4989-be1b-1085fc85ada8', fieldMetadataUniversalIdentifier: CONTRACT_SHAREPOINT_FOLDER_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 220 },
    { universalIdentifier: 'ad381af2-13f5-4e54-858b-3407c121b071', fieldMetadataUniversalIdentifier: CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 140 },
    { universalIdentifier: 'fc2a0b3f-6650-4794-9167-3591b66e11f8', fieldMetadataUniversalIdentifier: CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: '92a09dfd-95b6-4ce5-9ac4-ffc2c1fcb70b',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
