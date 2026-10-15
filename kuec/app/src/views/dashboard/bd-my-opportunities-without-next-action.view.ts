import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../../constants/view-filter-values';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/next-action-date-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/next-action-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const BD_MY_OPPORTUNITIES_WITHOUT_NEXT_ACTION_VIEW_UNIVERSAL_IDENTIFIER = '6b563feb-87b0-4603-a654-b67ee2d417a9';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_MY_OPPORTUNITIES_WITHOUT_NEXT_ACTION_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: My opportunities without next action',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'dee1f99a-d308-4254-ab24-2c93b83c77e6', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e28fb832-af3e-4bac-9ed0-30acb7033203', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '87727580-4647-4598-b86a-8cff40141ecd', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'c4eb9ca2-a102-41d5-8e9b-c6e1243360ad', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'a59d4653-8a18-4bb0-bcba-07dd9d9dd158', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '8595d4a0-a1d2-49ed-89bd-39d5ae08a6b8', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'e091ef2e-58ac-422b-a680-c42cf4f9667f',
      fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: 'e23510d3-edd3-477c-b0e2-2f5201710e1d',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: '8f817b9b-f4f6-4248-a42d-2c356303d439',
      fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'b94ffbd7-4d33-46f7-a976-edb23d9d1f69',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
