import {
  defineView,
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
} from '../objects/contract.object';

export const CONTRACTS_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER = '0c9bf274-5163-446e-88da-6117a3e4714b';

export default defineView({
  universalIdentifier: CONTRACTS_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By status',
  objectUniversalIdentifier: CONTRACT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconProgressCheck',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '35413929-bfcb-4b0c-9fa7-d45d779f06a3', fieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3fe2ef20-a819-44fb-99a3-91ec29e96767', fieldMetadataUniversalIdentifier: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '42206620-6c83-4d3f-b72e-3751df0fbdf1', fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '05a2e468-bb8e-4cbf-bdfe-777751e69a98', fieldMetadataUniversalIdentifier: CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '742951df-1e35-41d8-a5ea-f8742acf6d39', fieldMetadataUniversalIdentifier: CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '349005e4-4b57-4f6f-ab5a-60d1c44abac6', fieldMetadataUniversalIdentifier: COUNTERPARTY_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  groups: [
    { universalIdentifier: '58052db6-dc03-48df-813e-3f9428a8d152', fieldValue: CONTRACT_STATUS.DRAFT, position: 0, isVisible: true },
    { universalIdentifier: '1860c73f-4078-455d-a2ce-2031b14f2fc2', fieldValue: CONTRACT_STATUS.IN_NEGOTIATION, position: 1, isVisible: true },
    { universalIdentifier: '1985c6db-7aef-403c-a870-16a4c3d00dec', fieldValue: CONTRACT_STATUS.SIGNED, position: 2, isVisible: true },
    { universalIdentifier: '4bcf35c4-a9e4-43a7-8ff8-926b31f3ad66', fieldValue: CONTRACT_STATUS.EXPIRED, position: 3, isVisible: true },
    { universalIdentifier: 'a44bdd9e-1a96-4e2e-b8c6-d21b39016a6b', fieldValue: CONTRACT_STATUS.TERMINATED, position: 4, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '54d4aa4e-ae71-4106-b74f-a014990f3c8a',
      fieldMetadataUniversalIdentifier: CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
