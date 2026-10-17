import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-engagement.field';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENTS_OUTCOME_OVERDUE_VIEW_UNIVERSAL_IDENTIFIER = 'f6c8c7a8-2aa9-4977-8898-2a034fd2df32';

// "More than 2 days ago" is not a view filter in 2.48, so this reads the
// outcomeDueAt the app stores (Date plus 2 days).
export default defineView({
  universalIdentifier: ENGAGEMENTS_OUTCOME_OVERDUE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: outcome overdue',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconClockExclamation',
  position: 15,
  fields: [
    { universalIdentifier: '355c92f9-baae-4ec7-a539-58ca47c6200a', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f1a81183-08c0-4b05-8ce0-0e815dae57fc', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '181c3af6-8178-48f3-a2d4-193522628e88', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'f4588741-4e25-496c-9c48-afb2de7163a1', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'c0033b34-c953-4855-b433-c143356054cb', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '909bd591-31c5-4ffc-82ba-f57e5591dd25', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '7a32a32b-49a8-45b9-96ad-f545337f6acd',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '624c7ec0-cecb-4274-8e4b-065a0a383cce',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '561c7225-882f-47a7-9b8a-982fa88a993a',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
