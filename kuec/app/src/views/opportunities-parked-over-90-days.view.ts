import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import { LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lost-reason-category-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-on-opportunity.field';
import { PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/parked-lapses-at-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';

export const OPPORTUNITIES_PARKED_OVER_90_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '69a77b6c-52f0-4879-b542-cb4b600635c4';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// The Monday review proposes Lost for every row; Lost reason category is a
// column so the ops coordinator can fill it in the same pass.
export default defineView({
  universalIdentifier: OPPORTUNITIES_PARKED_OVER_90_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Parked over 90 days',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconArchive',
  position: 17,
  fields: [
    { universalIdentifier: 'a8bc1596-d08b-4276-b1ef-043081a9213e', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '4317fd28-093e-4e22-b676-78618bd0be82', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '016b15d4-8f32-4fd3-bae1-ba9cb196e560', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'ca4014ad-bfac-43f9-b2ed-6ef6262518bf', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '800ac821-89cf-462f-8d55-ea3c645b2a70', fieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '210d6db7-8304-4cec-8da6-a15c9716fd52', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '322cd308-17ca-4226-a9f5-16fa3d326239',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.PARKED],
    },
    {
      universalIdentifier: 'bce4a42e-dc01-4344-afb8-12e925388423',
      fieldMetadataUniversalIdentifier: PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'df51c094-4753-4e69-8bfe-de94232a64ac',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
