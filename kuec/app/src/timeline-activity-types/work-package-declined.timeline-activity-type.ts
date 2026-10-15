import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_DECLINED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  '8f09cba6-ae65-4442-814b-8203af3a1072';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_DECLINED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageDeclined',
  label: 'declined a work package',
  icon: 'IconThumbDown',
});
