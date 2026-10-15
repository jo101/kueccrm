import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';

export const BD_TEAM_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER = '8300ebd9-2d07-428a-967d-855b06dfb08a';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_TEAM_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Team open opportunities',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'ba8038e8-910c-4cac-80bb-a1ea0e099762', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f3d7719a-6c3e-4156-af0a-ed06c6be42d6', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'ccafbbcd-7606-4820-b7d2-04fa862406fb', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '6bfa432f-9f85-475c-b909-dd00fcb0d3f5', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'f3e9fbfa-8bb2-4001-a2ab-6b0c7696a3c2', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'edd62d62-9a7b-4221-91ba-ad604e6d7463', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '1d78e1e2-0946-40fa-bb72-5b7d53f3c7ab',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'b3fefef2-b230-4241-ba8a-b0f8edb71635',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
