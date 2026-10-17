import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../constants/view-filter-values';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-lead.field';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER = 'a0637c14-a1b1-4473-add3-8c1a1c70f347';

// The Leads entry opens here. L1 gives every ownerless lead to the ops
// coordinator, so for her this is the inbox; a view cannot name a member by id
// (runbooks/05-views.md), hence "owned by me". Oldest first: the contact SLA runs from Status entered at.
export default defineView({
  universalIdentifier: LEAD_INBOX_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Lead inbox',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconInbox',
  position: 0,
  fields: [
    { universalIdentifier: 'cc25894d-d241-4856-b455-5bf77a821cc7', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '13d5df85-4d82-4b4a-9dbc-696b9e88eebe', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '87b4372f-2d3c-4621-95d7-d93bb2189d3d', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'd12c7a58-bd40-4fa7-a31e-a4108910fdaf', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '5f6fb808-1a05-4449-b879-85a4dee976fe', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'fb686e40-531d-41ab-9e9d-cc4622f98606', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '02b85513-94a8-471a-a748-04a654ccdd59',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_STATUS.NEW],
    },
    {
      universalIdentifier: '13840b79-7656-4f58-92f0-0c6e66cfe986',
      fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'bae86623-0881-4dba-b8c4-67e3c1bbd0eb',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
