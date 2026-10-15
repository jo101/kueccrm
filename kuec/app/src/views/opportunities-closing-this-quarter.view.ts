import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../constants/opportunity-stage';
import { THIS_QUARTER_FILTER_VALUE } from '../constants/view-filter-values';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/probability-on-opportunity.field';

export const OPPORTUNITIES_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER = '5da4c665-e1ea-431c-b392-be14d8e2816e';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Closing this quarter',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCalendarDue',
  position: 7,
  fields: [
    { universalIdentifier: '9a5e2482-40ab-4355-b4a5-10cba3958bd3', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'cddf6430-b66a-4c7d-8a3e-9c4592940dfb', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9879e1d8-38b7-43af-94ee-0c40cca6f8a1', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '338f6a39-f396-4419-a5fa-763f39dd8a6e', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '57b11455-debf-479d-b9d2-9d2204cfd60c', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '265ffb05-bec5-4b3d-995f-09b4dc38cf67', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  filters: [
    {
      universalIdentifier: '6a8d7b33-a426-41b1-a33d-4487c79a521c',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: '748ea9f8-32ea-433b-9f5f-a540bd6d91e9',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_QUARTER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '15b10d01-6a1c-4303-8ecb-522adf7de574',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
