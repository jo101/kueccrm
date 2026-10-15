import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { THIS_MONTH_FILTER_VALUE } from '../../constants/view-filter-values';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/company-on-engagement.field';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../../objects/engagement.object';

export const BD_TEAM_ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER = 'eb38c71d-1fcb-4b29-8630-1b50333a38b1';

export default defineView({
  universalIdentifier: BD_TEAM_ENGAGEMENTS_THIS_MONTH_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Team engagements this month',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '3b051aea-9c20-4dda-9050-e47e7a77a81e', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '573adda5-1a48-4d65-9c63-94277261e972', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'bc3eb14f-dc60-4f0b-a4fe-64aa594e0ad2', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'e43142a5-7acd-4c9b-8215-33ab185149b7', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'c07bcbd5-82dd-4f47-917c-f5aa82b4fd9c', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '9dcf5889-f3de-4dcd-9b6d-0bc7f8ec3704', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '71e37f4f-0385-4032-9593-84bcd3d0c707',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_MONTH_FILTER_VALUE,
    },
  ],
  sorts: [
    {
      universalIdentifier: '0e4395ae-4468-4aba-90a5-2a0667229612',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
