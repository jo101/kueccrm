import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import {
  LOST_REASON_CATEGORY,
  LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/lost-reason-category-on-opportunity.field';
import { LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lost-reason-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';

export const LOST_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER = '7f6ac9b0-6f8d-49f1-bcfc-4aa723c734d5';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: LOST_OPPORTUNITIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Lost with reasons',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconMoodSad',
  position: 8,
  mainGroupByFieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'ce34f1f0-97ff-45d4-9739-24e651111595', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: '110b87b0-ce99-47df-bc87-f9c3dde50090', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '8e2712f7-ecb5-42ba-b637-6b525522f89e', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '4e986f67-666d-4373-af82-e8d784dae195', fieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'e35709d6-5987-4fe5-b966-2174f519860d', fieldMetadataUniversalIdentifier: LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '7d8b3572-ca9f-467f-b4d5-4d3fd393fbbe', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: 'ddc6a57d-a197-4379-81bb-c26c3cf07ec3', fieldValue: LOST_REASON_CATEGORY.PRICE, position: 0, isVisible: true },
    { universalIdentifier: '79f1108b-6f0f-4744-982a-9d2eb05d5eee', fieldValue: LOST_REASON_CATEGORY.TIMING, position: 1, isVisible: true },
    { universalIdentifier: '63c3523b-a36c-4c6f-a8a5-efd409b4511b', fieldValue: LOST_REASON_CATEGORY.NO_BUDGET, position: 2, isVisible: true },
    { universalIdentifier: '62c90888-bfde-48e0-b1d9-f00b18acdd06', fieldValue: LOST_REASON_CATEGORY.COMPETITOR, position: 3, isVisible: true },
    { universalIdentifier: 'b7c382fd-9bce-46b4-946d-52b240b60a06', fieldValue: LOST_REASON_CATEGORY.TECHNICAL_FIT, position: 4, isVisible: true },
    { universalIdentifier: 'c5b04ac3-5993-428e-9451-91537839d677', fieldValue: LOST_REASON_CATEGORY.NO_RESPONSE, position: 5, isVisible: true },
    { universalIdentifier: 'e27aee99-c305-4db9-b4b4-58ff9e9bdd18', fieldValue: LOST_REASON_CATEGORY.CAPACITY, position: 6, isVisible: true },
    { universalIdentifier: '00c88de4-f9df-4a3e-a9a7-7af683071240', fieldValue: LOST_REASON_CATEGORY.OTHER, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '21657741-2d8d-41ba-88f7-0ced3f8f16fd',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.LOST],
    },
  ],
  sorts: [
    {
      universalIdentifier: '1fa3cd35-4cb4-4375-a06d-3f09b60af629',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
