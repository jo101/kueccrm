import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_QUALIFIED_NOT_CONVERTED_VIEW_UNIVERSAL_IDENTIFIER = '17024d00-e65f-4b4a-8d90-d10bb117cac5';

// Longest waiting first: a qualified lead is either converted or parked.
export default defineView({
  universalIdentifier: LEADS_QUALIFIED_NOT_CONVERTED_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Qualified not converted',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCircleCheck',
  position: 2,
  fields: [
    { universalIdentifier: '54d59d81-135d-434a-b2bd-562c68310883', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '9259ef9c-66cc-4b85-b19f-439acd70ca2c', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '531413d2-adef-4213-8af2-ae555b825067', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '297fab78-2406-4480-a304-8f93c3b69a81', fieldMetadataUniversalIdentifier: LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: 'bc7e599c-9590-404d-9895-c989fd8a0296', fieldMetadataUniversalIdentifier: LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: 'b6d066ff-1c51-4093-bd3d-1abf6843d049', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '318846a6-7e86-48ec-a2fd-8a7bc3b0e258',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_STATUS.QUALIFIED],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'e3536d33-232e-483e-a3d0-21bb5c2817bf',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
