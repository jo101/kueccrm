import {
  defineView,
  ViewCalendarLayout,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-milestone.field';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-milestone.field';
import {
  MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../objects/milestone.object';

export const MILESTONE_CALENDAR_VIEW_UNIVERSAL_IDENTIFIER = '8f1a8a02-0c75-49b5-80c3-8a52b0b1b684';

export default defineView({
  universalIdentifier: MILESTONE_CALENDAR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Calendar',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.CALENDAR,
  icon: 'IconCalendar',
  position: 0,
  calendarLayout: ViewCalendarLayout.MONTH,
  calendarFieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '6dc7aefc-2d2b-4525-a1d9-818edd1a9ad7', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3e9f6d28-4263-491a-9da8-5a33af6bf92d', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '81084d5a-458c-4e19-b1b0-2f53de4c84b4', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '62c13d12-11cd-4fb6-8e0c-01ebad2414fd', fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '5b6c67bd-a057-49ea-9ac2-ce8549c76382', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
  ],
});
