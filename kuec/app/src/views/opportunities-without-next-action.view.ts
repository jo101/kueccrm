import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';

export const OPPORTUNITIES_WITHOUT_NEXT_ACTION_VIEW_UNIVERSAL_IDENTIFIER = '0567dd1f-cef2-42f5-b79e-297a168eb0cf';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_WITHOUT_NEXT_ACTION_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'No next action',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertTriangle',
  position: 5,
  fields: [
    { universalIdentifier: '6d216eb4-c33c-46e4-86f8-102fb7d94a1e', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '830621cb-21a6-4c84-b0c7-573406027992', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '2c344528-e6a1-4b56-894e-1e80b26b2214', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '74bcc9c6-10a9-4a8f-a91d-8f6de1919b1c', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'a54a6508-98d3-41e5-a507-fb872627bd34', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '98661548-9c7c-467b-909e-6dccfbe84e4e', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '5e4dcae3-5455-43dc-a5e7-3af6dab20453',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: '20b9eba7-e7e3-496b-9637-2d4ea7910051',
      fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'c1870c70-bc63-4248-8500-1967fcc5196b',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
