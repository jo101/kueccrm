import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-on-opportunity.field';

export const PROPOSALS_OUT_VIEW_UNIVERSAL_IDENTIFIER = '2a666237-c282-4c44-9a89-da0d472a3fdd';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: PROPOSALS_OUT_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Proposals out',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconFileText',
  position: 6,
  fields: [
    { universalIdentifier: '2fa587c3-b2ac-4d18-82f6-4e404d899946', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'e11a5e80-8cb3-41fa-a884-cc5d9412c144', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'bab2f9d1-030c-4810-9275-64db877fe827', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '57562725-c0e9-4e86-9dd7-caa3b7f03d99', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '8ad582c1-4a92-4b29-803c-2535c87fccb7', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 4, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
    { universalIdentifier: 'd36753cb-1eb2-46fe-9b2e-a9698fe646e2', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '945eaa35-9390-4612-8f4c-38db5489e685',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.PROPOSAL],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'a8c8dc3c-bffc-4f16-9d4c-52089f1970a6',
      fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
