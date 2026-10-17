import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { TODAY_FILTER_VALUE } from '../constants/view-filter-values';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_NURTURE_REVIEW_DUE_VIEW_UNIVERSAL_IDENTIFIER = 'e213ecd3-3f14-4831-a955-0cc60145f305';
const LEADS_NURTURE_REVIEW_DUE_OR_GROUP_UNIVERSAL_IDENTIFIER = '67debb37-790f-45c6-91cd-77df8c40155e';

// Review date today or earlier.
export default defineView({
  universalIdentifier: LEADS_NURTURE_REVIEW_DUE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Nurture review due',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarRepeat',
  position: 3,
  fields: [
    { universalIdentifier: '70fd5ae5-4acc-4296-88de-e7ba88f0f2e4', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '170d8b9f-5e8c-4e6b-85a8-a92b98e931f7', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '696af6a4-d8d3-4bdd-baef-c444128472d8', fieldMetadataUniversalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '419f4966-fe2f-40ca-9302-851ef33ae0b6', fieldMetadataUniversalIdentifier: LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 240 },
    { universalIdentifier: 'dcb49b6f-4e94-48e3-aa25-1932a240da22', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'e82558e1-602c-4ade-9696-d6d1c7021f14', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'ac5ab136-a3b0-4dd9-9572-4f76a7f830e4',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_STATUS.NURTURE],
    },
    {
      universalIdentifier: 'a0871d84-3f8e-414d-8af2-f28096bb3499',
      fieldMetadataUniversalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
      viewFilterGroupUniversalIdentifier: LEADS_NURTURE_REVIEW_DUE_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '9b82b557-f7ea-496f-a56a-e99943e52432',
      fieldMetadataUniversalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: LEADS_NURTURE_REVIEW_DUE_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: LEADS_NURTURE_REVIEW_DUE_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'cade4e8c-a7a2-4be7-8a83-86c3b5d1450d',
      fieldMetadataUniversalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
