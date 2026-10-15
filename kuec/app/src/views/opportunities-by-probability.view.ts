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
  OPPORTUNITY_PROBABILITY,
  PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/probability-on-opportunity.field';

export const OPPORTUNITIES_BY_PROBABILITY_VIEW_UNIVERSAL_IDENTIFIER = '3fbabebe-7ad5-4530-aa8d-198f179c2fe3';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_BY_PROBABILITY_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By probability',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconPercentage',
  position: 4,
  mainGroupByFieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'fdaf80fc-846b-4dd5-8c36-30f831f359d6', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'b3870113-8d69-488b-9485-24347eed527a', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '89aed940-4233-4417-9c7f-1bb835124b6b', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '8d4b579a-2835-4786-bcd1-bcbdc56636ca', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '9069c282-ade5-4db8-9432-46a18e1f3616', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '2e60559e-c69e-4a40-9f91-58ccd8c8fdbe', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: '43a582e5-1037-4ff7-9bc2-f264da641639', fieldValue: OPPORTUNITY_PROBABILITY.PCT_10, position: 0, isVisible: true },
    { universalIdentifier: '7389fea2-d8e4-4454-8509-d6475c41268a', fieldValue: OPPORTUNITY_PROBABILITY.PCT_25, position: 1, isVisible: true },
    { universalIdentifier: '8d087bf0-7731-47e1-9789-7e74d9ba7229', fieldValue: OPPORTUNITY_PROBABILITY.PCT_50, position: 2, isVisible: true },
    { universalIdentifier: 'd8fdf67b-a35c-404b-a114-432129c04f85', fieldValue: OPPORTUNITY_PROBABILITY.PCT_75, position: 3, isVisible: true },
    { universalIdentifier: 'dd15125f-a69c-48d0-9911-5b547b864963', fieldValue: OPPORTUNITY_PROBABILITY.PCT_90, position: 4, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '7158ad43-69f7-48bf-9a12-05abd535dabf',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: '6a04e50d-c46e-45b9-86c1-680d1ee05cc4',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
