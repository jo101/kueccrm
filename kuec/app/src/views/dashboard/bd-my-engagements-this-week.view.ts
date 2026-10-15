import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
  THIS_WEEK_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/company-on-engagement.field';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../../objects/engagement.object';

export const BD_MY_ENGAGEMENTS_THIS_WEEK_VIEW_UNIVERSAL_IDENTIFIER = '2527a05b-c29b-454f-a0a5-c775d679e2a1';

export default defineView({
  universalIdentifier: BD_MY_ENGAGEMENTS_THIS_WEEK_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: My engagements this week',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '8a2de346-1365-4892-a7b3-a5a4cdfeb1bf', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '64765f11-0bb3-410a-8468-1082fd538fb1', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'c9368d24-290e-4cef-9f1c-f7522502bb00', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'e712d370-6332-4d9e-8c6f-771d0ee11a11', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'a0c1c13c-39a2-42c8-85ce-e63237414d38', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '8096f151-26ea-4c55-82cf-f34ceabf8081', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '12ef1b37-c899-468a-8ba4-b726bc0059ea',
      fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '1602a576-52c0-49a3-93c0-2b2489342814',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_WEEK_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '2bf3a014-9909-4a1a-9aac-6d96f26d7edf',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
