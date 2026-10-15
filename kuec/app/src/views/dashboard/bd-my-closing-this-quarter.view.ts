import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';
import {
  CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
  THIS_QUARTER_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/probability-on-opportunity.field';

export const BD_MY_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER = '3ed4ffff-7f39-4a15-af48-388f51c4155e';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_MY_CLOSING_THIS_QUARTER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: My closing this quarter',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '3dd611a3-e37a-4cbd-9672-5b37d9ba61ca', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'fd805010-558f-478d-bd8f-9ff8e1b885ee', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '7531ef9c-30a1-4dec-9791-5301207468c2', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '83cdd6ab-b52c-49cf-93c5-d923e2bbdcd4', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '6b129aae-c7ea-4df3-bb1b-47609cbc608d', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'c2507602-da21-4bb7-8d0a-1afe73fac383', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'b276bc65-96f5-489a-a709-1b23b02f99bf',
      fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '44a22fa3-91f0-470c-bfcf-1e63309d5bff',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: 'c8452e1f-aedc-46d1-a71b-8469b091ba84',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_QUARTER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'e3c1d7a2-c330-48b2-8c40-a5e496a95b14',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
