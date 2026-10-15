import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';
import { THIS_QUARTER_FILTER_VALUE } from '../../constants/view-filter-values';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/probability-on-opportunity.field';

export const BD_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER = '22892eb5-ca99-4a43-925b-8295292376fa';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Closing this quarter',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '80e3648a-5aa7-4411-ad7a-82408ccb4ae0', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '0b0bba79-1ea2-4fa9-a3b0-bd9869d3075f', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '45c6a647-73ed-45ae-a536-5cfd8024a49e', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '72ea0b13-59ce-4080-8d91-ec58837c5d69', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '77581bc9-dafd-4357-a6c4-a007d4f41ad3', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '7bff4445-abc9-46ad-8423-f14e19912293', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '0c6968c0-2263-4651-9c85-4455404d35cb',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: 'e5fd8c26-32e0-4059-b1d7-01ac0a36c9df',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_QUARTER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'ea8f0aa3-6f1e-401b-8c95-f91f82ca00d4',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
