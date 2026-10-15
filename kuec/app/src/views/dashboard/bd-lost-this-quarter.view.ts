import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../../constants/opportunity-stage';
import { THIS_QUARTER_FILTER_VALUE } from '../../constants/view-filter-values';
import { LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/lost-reason-category-on-opportunity.field';
import { LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/lost-reason-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const BD_LOST_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER = 'e1186e7e-00c3-4c1a-b949-eb40ce3bc6bc';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_LOST_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Lost this quarter',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '0b6f11e6-62ba-4ca8-aa69-ec43c64ae1da', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '1ccafddf-fbd8-4890-88b0-2df5cf1d3611', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'e90242cb-0408-4ff4-b45d-64efb2a02022', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'c1f76b4d-dac4-4969-8251-544f9b0aeb0c', fieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'a37e353b-6f6c-4138-be2e-5aa9dd658878', fieldMetadataUniversalIdentifier: LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '9c3c7aac-aefc-4472-81da-511d30c2b9c1', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '6a7fef54-4806-4185-8b58-fff9087571a3',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.LOST],
    },
    {
      universalIdentifier: 'bcbbee5f-06ba-4ae4-b209-d67e16ecb626',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_QUARTER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '90643d3a-a078-4328-98a2-c7dd02fce812',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
