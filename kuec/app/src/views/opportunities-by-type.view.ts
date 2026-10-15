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
  OPPORTUNITY_PLAYBOOK_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/playbook-type-on-opportunity.field';

export const OPPORTUNITIES_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER = '79553127-8e8f-461d-9bc8-30940c80ab59';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By type',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCategory',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '5d6a9d66-37b1-4773-a86c-abf63c80d596', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: '8106a1c1-7df9-446d-a1ae-ce0f62961a89', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '25f3b03e-cafb-4c5f-98ba-92d92b814df6', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0de8ad03-bed2-40f4-8b8a-4144150a871d', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8f390c47-2b35-461b-86fa-021e07cc0c57', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '1b01cc96-1e29-474f-b795-3bed1e879bb8', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: '3ab2f1b0-c25b-469a-9e79-5006ccdfea00', fieldValue: OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING, position: 0, isVisible: true },
    { universalIdentifier: '1b707192-cff3-4b8f-969e-cd4dc328bc46', fieldValue: OPPORTUNITY_PLAYBOOK_TYPE.RFQ_TECHNICAL_SERVICE, position: 1, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '648ca255-9bc9-4ed4-8776-cd9354fba45d',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'ae71ed7d-72da-4da4-b5af-3409683bb66c',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
