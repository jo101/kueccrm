import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_OFFERED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  'c154a9db-616f-494f-bca6-0f78e53bb540';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_OFFERED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageOffered',
  label: 'offered a work package',
  icon: 'IconSend',
});
