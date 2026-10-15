import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  PAST_11_MONTHS_FILTER_VALUE,
  THIS_MONTH_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/source-on-opportunity.field';

export const BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_VIEW_UNIVERSAL_IDENTIFIER = '6629e1f8-8810-470c-9509-7d01b12e79ec';
const BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'c73a554a-759b-412d-bc51-4c1cd99b847a';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Opportunities created, past 12 months',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'dd7b5af7-d11f-41de-9314-19ec399d872d', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'bf154c20-0b75-4e83-8c85-314fdebc5c70', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'db20201c-7fe6-4a72-9c66-5bc396e39fa1', fieldMetadataUniversalIdentifier: opportunityFields.createdAt.universalIdentifier, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'b954d9da-bb31-431f-af5a-fefe032869ba', fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '29ff0d7d-02ec-44f9-839a-2f79836c3a91', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '509230f9-3cb7-41d1-86b2-520ae42ec887', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'b324909c-ea50-494a-86e3-9578df09a4e9',
      fieldMetadataUniversalIdentifier: opportunityFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: PAST_11_MONTHS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'a21d72da-3b8a-409e-8bbd-bdd9195c2bc0',
      fieldMetadataUniversalIdentifier: opportunityFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_MONTH_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: BD_OPPORTUNITIES_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: '0a24a2ac-dfed-4ea8-8ada-7f785a4d600a',
      fieldMetadataUniversalIdentifier: opportunityFields.createdAt.universalIdentifier,
      direction: ViewSortDirection.DESC,
    },
  ],
});
