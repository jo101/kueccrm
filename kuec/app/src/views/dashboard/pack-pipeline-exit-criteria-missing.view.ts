import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../../constants/opportunity-stage';
import { FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/funding-path-on-opportunity.field';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/probability-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const PACK_PIPELINE_EXIT_CRITERIA_MISSING_VIEW_UNIVERSAL_IDENTIFIER = '753c3934-7409-4445-bfac-c32c01bc0a5e';
const PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER = 'fad311a1-88b6-4a84-a940-9d3b08ba5d09';

// The late-stage exit criteria (kuec/playbooks/crm-pack.md): a case at Proposal or
// Customer still missing Amount, Close date, Funding path or Probability.
export default defineView({
  universalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: exit criteria missing',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '89bdb5c2-dcec-4600-8b1e-1a37a507eb27', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '42a6e542-5513-47a1-b1cb-78fba139239d', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '37da6166-a8b2-499f-b6d6-082551ce9d23', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'fce86bd9-45c1-457b-8c3e-ccd733e646ef', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.amount.universalIdentifier, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'b687c69e-9134-4072-9777-7a25bf751210', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.closeDate.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '433c5b93-461d-4c93-91d6-14af4dddef75', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
  ],
  filters: [
    {
      universalIdentifier: 'a455a77e-8eec-4531-8abc-b7cdd164644b',
      fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.PROPOSAL, OPPORTUNITY_STAGE.CUSTOMER],
    },
    {
      universalIdentifier: '5c58a2ce-8d19-47fd-8cba-125ce8155803',
      fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.amount.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '4a30fa1b-425a-4300-83e0-847f973c06a7',
      fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.closeDate.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: 'f06cd4a5-6de9-4b1c-af85-cb9792e2a823',
      fieldMetadataUniversalIdentifier: FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
    {
      universalIdentifier: 'd4730b6f-8d34-4451-b3f2-6623b83246f6',
      fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 3,
    },
  ],
  filterGroups: [
    { universalIdentifier: PACK_PIPELINE_EXIT_CRITERIA_MISSING_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'a612200c-87b1-43df-bed7-e70d4a1caaeb',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
