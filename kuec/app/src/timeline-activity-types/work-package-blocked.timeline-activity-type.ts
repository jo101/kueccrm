import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_BLOCKED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  'd1514234-4bae-4c6b-9f0d-b8f48809e307';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_BLOCKED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageBlocked',
  label: 'blocked a work package',
  icon: 'IconBarrierBlock',
});
