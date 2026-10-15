import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_REASSIGNED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  'ed11b504-f533-4045-bfc6-888edd638423';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_REASSIGNED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageReassigned',
  label: 'reassigned a work package to the ops coordinator',
  icon: 'IconUserShare',
});
