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
import { STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stale-from-on-opportunity.field';

export const OPPORTUNITIES_IN_QUALIFY_OVER_30_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '95ce314b-38fb-48bb-a035-b79c12926cc1';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// Qualify is the stage with API value NEW (labelled New until the stage
// relabel). Stale from is Stage entered at plus 30 days, stored by W8.
export default defineView({
  universalIdentifier: OPPORTUNITIES_IN_QUALIFY_OVER_30_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: in Qualify over 30 days',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconHourglassHigh',
  position: 16,
  fields: [
    { universalIdentifier: 'd359b67d-e4c0-45f2-bcf9-9d8e6455eeb8', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd90acc2e-6daf-4069-a2bd-448377a88fb8', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '937cc63b-711a-4de6-92a7-d9f8f68b2c33', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'd3ef4ea1-52e7-45b3-be69-e77401ae0fdb', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '5f9e4003-0fbb-4c60-8f3c-0db7b2f89a27', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '0ef41fec-cdcd-4d94-9eb7-9e46b3ea2fc5', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'acfe9930-f9a3-4c3a-a2c1-614633c0e0b5',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_STAGE.NEW],
    },
    {
      universalIdentifier: 'c27a74d1-ee53-4e67-a136-dc32fd0d5d92',
      fieldMetadataUniversalIdentifier: STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'd53ce66b-04c3-410f-9fd1-c55b1a3096db',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
