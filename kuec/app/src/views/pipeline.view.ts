import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';

export const PIPELINE_VIEW_UNIVERSAL_IDENTIFIER = 'ccb61b9d-9d75-4290-b353-3c8305d740e0';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// A kanban column shows one aggregate; the grouped tables carry count and sum together.
export default defineView({
  universalIdentifier: PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
  kanbanAggregateOperation: AggregateOperations.SUM,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier,
  fields: [
    { universalIdentifier: '5fe3d8d1-83d2-424d-b9cd-2cc23c46d5ba', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'fe6a4810-1af4-4845-8ae7-70575b4b2650', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9b875b22-7438-4359-853f-0c294252f534', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '738a3ebd-60b7-42d7-a852-c2014404225f', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: 'dc993d65-4e2c-4142-aec1-5afd2fbd8efa', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '3ad406a1-7742-41f8-9c6e-8f5b7cab4240', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
  ],
  groups: [
    { universalIdentifier: 'beb31d33-9d73-43ca-997e-0f511561176b', fieldValue: OPPORTUNITY_STAGE.NEW, position: 0, isVisible: true },
    { universalIdentifier: 'a53bca55-94fe-49e8-a805-fcf6fc34a85b', fieldValue: OPPORTUNITY_STAGE.SCREENING, position: 1, isVisible: true },
    { universalIdentifier: 'b7991dd6-e73b-46a6-9379-691458e0cc2c', fieldValue: OPPORTUNITY_STAGE.MEETING, position: 2, isVisible: true },
    { universalIdentifier: '7ef13fab-e239-45bd-a910-b7e79108fb76', fieldValue: OPPORTUNITY_STAGE.PROPOSAL, position: 3, isVisible: true },
    { universalIdentifier: '1dc69cce-7c61-4184-87cc-badba19945cb', fieldValue: OPPORTUNITY_STAGE.CUSTOMER, position: 4, isVisible: true },
    { universalIdentifier: 'c8e53d0c-e9fd-49c3-85a0-8e4b312335cc', fieldValue: OPPORTUNITY_STAGE.SIGNED, position: 5, isVisible: true },
    { universalIdentifier: '8f816827-e5a0-4f20-a4fb-11f4cad95a28', fieldValue: OPPORTUNITY_STAGE.LOST, position: 6, isVisible: false },
    { universalIdentifier: 'd15209ad-8227-4976-9f0f-b99ee4e3805d', fieldValue: OPPORTUNITY_STAGE.PARKED, position: 7, isVisible: false },
  ],
  sorts: [
    {
      universalIdentifier: 'c6c8a173-4eaa-4871-ada8-e64f908b9d9d',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
