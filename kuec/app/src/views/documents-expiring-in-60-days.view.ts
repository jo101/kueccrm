import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  NEXT_60_DAYS_FILTER_VALUE,
  TODAY_FILTER_VALUE,
} from '../constants/view-filter-values';
import { COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-document.field';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-document.field';
import {
  DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/document.object';

export const DOCUMENTS_EXPIRING_IN_60_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '7a875fa2-9216-4632-a73e-4f1de121e795';
const DOCUMENTS_EXPIRING_IN_60_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = '07539d5d-b490-4869-916a-72c07a6a781b';

// Expires on today or in the next 60 days, Asia/Dubai; expired and superseded documents are done with.
export default defineView({
  universalIdentifier: DOCUMENTS_EXPIRING_IN_60_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Documents expiring in 60 days',
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarX',
  position: 1,
  fields: [
    { universalIdentifier: 'e83ec11b-2448-4f85-b45a-bafd2740658e', fieldMetadataUniversalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '1f3a6810-f795-48c9-86e5-a4a125dce5fe', fieldMetadataUniversalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '52455f3a-25f8-4efb-a4b7-9cb8bf5484ae', fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '4b64b924-c734-49c7-9f3c-496b455b8f32', fieldMetadataUniversalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 160 },
    { universalIdentifier: 'db946f9b-f734-4426-8bf0-16880e24b83d', fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '291c7f43-ad53-4da7-b51b-f63cf5f12e0d', fieldMetadataUniversalIdentifier: DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 240 },
    { universalIdentifier: 'cad67966-4ff9-4c7f-b6b0-c75206ed8cfb', fieldMetadataUniversalIdentifier: COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: false, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '17d409ed-af17-4275-8cdc-f96ee929aa71',
      fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: [DOCUMENT_STATUS.EXPIRED, DOCUMENT_STATUS.SUPERSEDED],
    },
    {
      universalIdentifier: 'e3e61c49-2e36-4024-9fbe-5b7d1e3ff3b8',
      fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: DOCUMENTS_EXPIRING_IN_60_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '338fa5d3-d80a-40ad-83cf-1c244136ddc0',
      fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: NEXT_60_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: DOCUMENTS_EXPIRING_IN_60_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: DOCUMENTS_EXPIRING_IN_60_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'e07261cd-a87f-4bbe-abaa-2fa90abdf62c',
      fieldMetadataUniversalIdentifier: DOCUMENT_EXPIRES_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
