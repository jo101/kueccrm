import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { THIS_MONTH_FILTER_VALUE } from '../constants/view-filter-values';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_DEAD_REASON,
  LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_DEAD_THIS_MONTH_BY_REASON_VIEW_UNIVERSAL_IDENTIFIER = '9027fe86-6780-43a2-bc0d-e98ca1963f85';

// Leads that went Dead this calendar month (Asia/Dubai), one group per reason.
export default defineView({
  universalIdentifier: LEADS_DEAD_THIS_MONTH_BY_REASON_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Dead this month by reason',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCircleX',
  position: 4,
  mainGroupByFieldMetadataUniversalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'fb8113bd-1eed-4a66-a4f0-922e74775d50', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: '539784c7-9c45-4b3e-951f-6cbdc9eae2d5', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '8c7cc4a2-960a-4306-adb0-21e4514e9aeb', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '1dabbb37-4a56-4154-966f-b51811280b68', fieldMetadataUniversalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '5b6e56b2-69e6-402b-9293-fc525afbc073', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'e588bf5c-3e63-4266-bf03-87d242cf5e2d', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  groups: [
    { universalIdentifier: 'd4342d85-1664-48b8-995c-3822dbfcc15f', fieldValue: LEAD_DEAD_REASON.NO_RESPONSE, position: 0, isVisible: true },
    { universalIdentifier: '6286143f-a4f4-4634-a288-f6d0fd9383ed', fieldValue: LEAD_DEAD_REASON.NO_FIT, position: 1, isVisible: true },
    { universalIdentifier: '6b961f83-92cd-45ca-8f0e-a2419bbd6fb4', fieldValue: LEAD_DEAD_REASON.NO_BUDGET, position: 2, isVisible: true },
    { universalIdentifier: '4193d07f-32ae-47fb-a204-e1fe623455ee', fieldValue: LEAD_DEAD_REASON.DUPLICATE, position: 3, isVisible: true },
    { universalIdentifier: 'c7519999-c1c5-46af-98e4-277366fc8e59', fieldValue: LEAD_DEAD_REASON.COMPETITOR, position: 4, isVisible: true },
    { universalIdentifier: '2dd37ed9-c882-4cb4-a2f7-f0e56ee3c691', fieldValue: LEAD_DEAD_REASON.TIMING, position: 5, isVisible: true },
    { universalIdentifier: '73a6d323-14bc-45d7-b083-75b3c85c0c5d', fieldValue: LEAD_DEAD_REASON.NOT_DECISION_MAKER, position: 6, isVisible: true },
    { universalIdentifier: '9e084b16-39f2-47ec-a559-8f7bd5c35fa0', fieldValue: LEAD_DEAD_REASON.OTHER, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '89130373-f134-4199-838c-756b6101f51a',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_STATUS.DEAD],
    },
    {
      universalIdentifier: '3e9f8931-bcc2-4034-8324-714665061693',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_MONTH_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '98727fb9-8189-4f40-854a-ffce8404f47a',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
