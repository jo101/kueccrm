import { defineTimelineActivityType } from 'twenty-sdk/define';

export const WORK_PACKAGE_SUBMITTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER =
  '24aa213d-5701-4a8d-bd1c-30e53ee1bff7';

export default defineTimelineActivityType({
  universalIdentifier:
    WORK_PACKAGE_SUBMITTED_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER,
  name: 'workPackageSubmitted',
  label: 'submitted a work package for review',
  icon: 'IconUpload',
});
