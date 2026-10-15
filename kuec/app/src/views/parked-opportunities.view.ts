import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';

export const PARKED_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER = 'cfc7f78f-6f2f-4ab8-88c7-e56bd0997230';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: PARKED_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Parked',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconPlayerPause',
  position: 9,
  fields: [
    { universalIdentifier: '46684cdb-fd47-4c93-a4a4-40b6eee7a3bc', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '22233ecf-eb92-4234-9665-151beeac6d7c', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'a4243954-4ef3-4ee8-abf3-b580d51d06b0', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'fc73694f-acc2-4e74-b6f9-f00adcd659dc', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'd6573648-22ee-4ee3-836a-86b1390f4517', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '8f785476-2d99-4f91-b370-1003cdcb2dd9', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'a5a32e3b-9b37-45fc-a907-997e676b3638',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.PARKED],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'e4fb0bd4-cfcb-442c-b679-5ac8d9c00fdc',
      fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
