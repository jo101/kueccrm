import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../../constants/opportunity-stage';
import { THIS_YEAR_FILTER_VALUE } from '../../constants/view-filter-values';
import {
  OPPORTUNITY_PLAYBOOK_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../fields/playbook-type-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const BD_SIGNED_LICENCES_THIS_YEAR_VIEW_UNIVERSAL_IDENTIFIER = '059949c5-21d7-4f37-b22b-2a135aaede12';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_SIGNED_LICENCES_THIS_YEAR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Signed licences this year',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '44894f3d-c427-485b-9f03-9e28f575f2dd', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '35de3e15-42a3-40c0-8585-4f0d1ce81855', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'af2dc399-9741-4a58-98b7-635ea36333d3', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'd649ebe4-229c-4410-8793-4d636a4e9571', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '1a856ef3-666d-47e0-9057-48835ba431d9', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 4, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '7c4ac4b6-58a1-43e4-8c11-937701d4ffc8',
      fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING],
    },
    {
      universalIdentifier: '9812a6cf-5fc1-4f34-ab9b-d5c3d4254f78',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.SIGNED],
    },
    {
      universalIdentifier: 'ec928d97-dc27-4083-b0fd-e738fc3463b1',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_YEAR_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '5bb43e60-5a21-4af0-8723-5d49f3fb0064',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
