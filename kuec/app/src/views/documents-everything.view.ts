import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-document.field';
import { CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/contract-on-document.field';
import { LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lead-on-document.field';
import { OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-document.field';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-document.field';
import { PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/person-on-document.field';
import { PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-document.field';
import {
  DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
  DOCUMENT_VERSION_LABEL_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/document.object';

export const DOCUMENTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '565cbcb9-2520-47f7-af51-b2e122424078';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: DOCUMENTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: 'aa0ff92e-f503-493e-a606-80c902f6afd0', fieldMetadataUniversalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '1238dcd3-ea6e-4dd1-9f9f-66f5504c7fa1', fieldMetadataUniversalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '31bc7f65-0230-4891-824c-a6c391d190f3', fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'c2419f28-58ac-4500-b274-01f5cc63311e', fieldMetadataUniversalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 160 },
    { universalIdentifier: 'fa81bc18-c959-4ae0-bf97-64d8577fe3f5', fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'edc1ed8b-5e7a-4e80-91b3-1077da5f15bf', fieldMetadataUniversalIdentifier: DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
    { universalIdentifier: '34e8e09d-a510-4af1-9d94-f83bd9d4b4aa', fieldMetadataUniversalIdentifier: DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 240 },
    { universalIdentifier: '8dfd16ec-91fd-4f0c-a78d-832e410c77bd', fieldMetadataUniversalIdentifier: DOCUMENT_VERSION_LABEL_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: 'f1edecfc-97a7-41f8-9362-d3de98669c72', fieldMetadataUniversalIdentifier: COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 170 },
    { universalIdentifier: 'dac7fdb6-c424-471d-8439-d6144d065f71', fieldMetadataUniversalIdentifier: PERSON_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 170 },
    { universalIdentifier: '2f9a66a1-44b5-4c96-88db-940fcb0e7d15', fieldMetadataUniversalIdentifier: LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 170 },
    { universalIdentifier: '698e2dc9-0f8b-4491-98fe-3ee6000b9fd5', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 170 },
    { universalIdentifier: 'd4df04ee-43ec-4a46-a419-7f365fc027ab', fieldMetadataUniversalIdentifier: PROJECT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 170 },
    { universalIdentifier: '110c6b7c-2cdc-47e1-83a9-6a9bd808c29e', fieldMetadataUniversalIdentifier: CONTRACT_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 170 },
    { universalIdentifier: 'b51875be-45ac-4ed1-a6e0-ca704c4cff49', fieldMetadataUniversalIdentifier: DOCUMENT_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 140 },
    { universalIdentifier: '54287e90-303b-4682-b13e-82a988137b0e', fieldMetadataUniversalIdentifier: DOCUMENT_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 170 },
    { universalIdentifier: '9d51f089-5718-41b1-b409-eee98b68e515', fieldMetadataUniversalIdentifier: DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 16, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: 'e3cd659d-0f53-4011-bec4-2f7f35cfbad9',
      fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
