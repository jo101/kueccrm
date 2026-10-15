import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_DONE_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  '9131ff00-5158-4770-8301-aee78bad225f';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_DONE_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageDone',
  label: 'completed a work package',
  icon: 'IconCircleCheck',
});
