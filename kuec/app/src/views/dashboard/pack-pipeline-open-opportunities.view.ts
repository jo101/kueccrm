import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/next-action-date-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';

export const PACK_PIPELINE_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER = '3cb2e4b0-0c52-41b2-b758-15d7a3514f15';

export default defineView({
  universalIdentifier: PACK_PIPELINE_OPEN_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: open opportunities',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '6815af12-878d-4efa-932a-57bb8c8a9256', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'b979ee69-7850-4a1c-b603-f7a5e9771402', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '702dc78d-8030-4efe-bb9b-47256a9dcd54', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '579b9524-9917-488b-bb5a-5e58bed10a40', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.stage.universalIdentifier, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '0d90744c-cd99-4ce7-9119-b049886e8d0c', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'f6209e29-88ca-410a-a75d-0d892f884f09', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.amount.universalIdentifier, position: 5, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: '81491993-6d4f-4724-a109-8f785c345610',
      fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: '4140248c-fc85-442d-8da9-68a2be89d522',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
