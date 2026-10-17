import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-document.field';
import {
  DOCUMENT_CONFIDENTIALITY,
  DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_TYPE,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/document.object';

export const DOCUMENTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = '5574935a-4363-4483-aeb0-98873a60cbb0';
const DOCUMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = '7f5d9a64-f4a7-450c-b93a-87fbaa94a7c9';

// Type, Status or Confidentiality set to Other with Other details empty.
export default defineView({
  universalIdentifier: DOCUMENTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: '6db32249-f459-4bf6-a181-f06bde2bb259', fieldMetadataUniversalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f78f6050-4ddf-4413-ab09-457392caa4f5', fieldMetadataUniversalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '0eb85680-a38b-4b01-a131-de9124f0a4fd', fieldMetadataUniversalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 160 },
    { universalIdentifier: 'a393ec3f-9d64-4bb4-b4bd-6f0785cf1c28', fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '58bc86a9-cf86-40d7-8ebc-c7afd5f139bb', fieldMetadataUniversalIdentifier: DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '61c57d4c-7a83-4efb-929f-e1793efd7870', fieldMetadataUniversalIdentifier: DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: 'b00d2729-844e-4b7d-a18d-7812d9933bf8',
      fieldMetadataUniversalIdentifier: DOCUMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: 'adf43789-760a-42d9-bc82-f4d3f2b7483b',
      fieldMetadataUniversalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DOCUMENT_TYPE.OTHER],
      viewFilterGroupUniversalIdentifier: DOCUMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'be1efc77-f84b-4bf7-a063-0101cb0c86e3',
      fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DOCUMENT_STATUS.OTHER],
      viewFilterGroupUniversalIdentifier: DOCUMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '88a6ddfb-3395-45e2-b2f8-13432270ace9',
      fieldMetadataUniversalIdentifier: DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DOCUMENT_CONFIDENTIALITY.OTHER],
      viewFilterGroupUniversalIdentifier: DOCUMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
  ],
  filterGroups: [
    { universalIdentifier: DOCUMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
