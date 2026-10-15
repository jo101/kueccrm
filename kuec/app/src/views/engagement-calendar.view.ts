import {
  defineView,
  ViewCalendarLayout,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENT_CALENDAR_VIEW_UNIVERSAL_IDENTIFIER = '6f7878fc-6768-468f-9fb7-33202b59f8d7';

export default defineView({
  universalIdentifier: ENGAGEMENT_CALENDAR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Calendar',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.CALENDAR,
  icon: 'IconCalendar',
  position: 0,
  calendarLayout: ViewCalendarLayout.MONTH,
  calendarFieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'c0c769dc-2fba-41e6-b209-ab476ff74b2a', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e278a78a-7950-4e88-832c-e6a887bb332d', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '3b5ce301-2861-40b8-8018-fe39e90d65f3', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '01266e70-c77e-4a99-a59e-d0914f4afd09', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '397174ac-a2fd-4280-b36b-87f3baa07e94', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
  ],
});
