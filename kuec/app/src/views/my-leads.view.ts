import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../constants/view-filter-values';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const MY_LEADS_VIEW_UNIVERSAL_IDENTIFIER = '875a5f5a-fe16-481f-bd1a-71b77f1129e5';

export default defineView({
  universalIdentifier: MY_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'My leads',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconUserCheck',
  position: 1,
  fields: [
    { universalIdentifier: 'a1a22427-ba72-42ba-b707-5f43d2dbeb25', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'fc693aa6-3c75-4370-b51e-7fc89ddad6d0', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '174a9109-32c6-4d4a-9928-7a34c89ba1ce', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '41051527-53f9-4335-908c-8c9a5e8e282d', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '970574ab-acc6-4fe4-a228-1bc044f186b1', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '9894ae3a-2e85-40c0-ad3b-aa5567fff976', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'f666ca21-9e8f-4269-9672-994e16d57bfe',
      fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '3cca0c77-ab96-49d3-aa2d-3c342b6b6ed7',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: [LEAD_STATUS.DEAD, LEAD_STATUS.CONVERTED],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'd61a9705-b64d-4e69-ac1c-5e640857d088',
      fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
