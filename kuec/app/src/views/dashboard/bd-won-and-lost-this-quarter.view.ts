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
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const BD_WON_AND_LOST_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER = 'e0691a4c-ce2a-4688-a2cf-b7f679137344';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_WON_AND_LOST_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Won and lost this quarter',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '917ee7f9-9862-4da0-870c-4bf8e62999e4', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3edcd611-25e6-42ec-a9b7-20a1cef0e6d1', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '36aca7e2-cf14-42e7-8c0e-c3749e1c917e', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '21ccf747-5b51-4b0a-9ac2-c8cfd890f678', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '25ffa193-3cad-4aaf-9fc6-d0ebee415098', fieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '3cbbf6e5-6e59-4c27-9929-4441fbdf257e', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'cedcf802-154f-4b1e-a658-4fb77d418ba0',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.SIGNED, OPPORTUNITY_STAGE.LOST],
    },
    {
      universalIdentifier: '4a23f257-5efc-434d-9b50-54e5fa16db1e',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_QUARTER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '89b6b65e-0711-41c2-80f6-f7394e1da4e3',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
