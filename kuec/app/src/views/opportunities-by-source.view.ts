import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../constants/opportunity-stage';
import {
  OPPORTUNITY_SOURCE,
  SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/source-on-opportunity.field';

export const OPPORTUNITIES_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER = '95fc1c0d-577c-4ed5-b3e4-eb6ea71ef856';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By source',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconArrowFork',
  position: 3,
  mainGroupByFieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'af0b9061-67d3-4460-b268-0c56e27a0334', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'f36526d6-eb25-439c-bf71-386137bc62e9', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '7d76b174-09f8-426a-b101-bd8a5e5039c0', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '88c3482e-6af0-4e22-9d7b-98f602cdab28', fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '9f645d73-c04c-49b8-8876-60f969f18e1f', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '81dffa0c-9eb5-4c57-9ad9-722163f6b31a', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: '2d4d9f0b-a62c-41c4-835b-a4d1aa09e8d9', fieldValue: OPPORTUNITY_SOURCE.INBOUND, position: 0, isVisible: true },
    { universalIdentifier: '7c78e069-f24e-4d20-96af-67c59f2890b5', fieldValue: OPPORTUNITY_SOURCE.REFERRAL, position: 1, isVisible: true },
    { universalIdentifier: '57719483-fa43-4cdf-8e84-a15cb1f09462', fieldValue: OPPORTUNITY_SOURCE.OUTREACH, position: 2, isVisible: true },
    { universalIdentifier: '4e732bdd-2142-45c8-af48-7e4a761a8a9b', fieldValue: OPPORTUNITY_SOURCE.EVENT, position: 3, isVisible: true },
    { universalIdentifier: 'bd6046dc-0286-4f86-b540-22b9b568d89e', fieldValue: OPPORTUNITY_SOURCE.TENDER, position: 4, isVisible: true },
    { universalIdentifier: 'a4efd6f5-9375-45c2-af13-672245ae008e', fieldValue: OPPORTUNITY_SOURCE.FACULTY, position: 5, isVisible: true },
    { universalIdentifier: 'c96ffd3f-766f-4ade-98b2-722cf0e3f6a4', fieldValue: OPPORTUNITY_SOURCE.PARTNER, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'fc8a8894-da09-4c59-a4d9-34156d5b455f',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'beff531e-ded9-42e1-b161-89f079cd999f',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
