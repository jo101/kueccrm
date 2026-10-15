import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { THIS_MONTH_FILTER_VALUE } from '../constants/view-filter-values';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-engagement.field';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER = 'a52faf43-1241-4cd2-84ab-a73c9fcd8389';

export default defineView({
  universalIdentifier: ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'This month',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarMonth',
  position: 1,
  fields: [
    { universalIdentifier: '288129f9-7ccd-44eb-904d-d551e690df9d', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '67d6593c-bb22-4c47-ba27-fbd838f8e0f9', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'a759732b-44a7-407c-a1d9-f2aaca2c98d7', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '79a0b325-72cc-4e1b-9b21-7c9338b097c8', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '67d43fdf-e03a-4d4a-bcbc-e1f759197c3b', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '1d1d83af-a4d2-435c-892c-f7083a113e8b', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'f8aef7d6-89a4-4545-9c1c-9d61f2d7a3e1',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_MONTH_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '983846bd-f660-4774-ba27-889391d120b4',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
