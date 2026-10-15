import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_ACCEPTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  '50e51345-8572-4f05-b429-7926f48d22e6';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_ACCEPTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageAccepted',
  label: 'accepted a work package',
  icon: 'IconThumbUp',
});
