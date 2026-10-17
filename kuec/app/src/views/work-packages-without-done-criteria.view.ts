import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { STATUSES_WITH_DUE_TIMER } from '../automation/timers/work-package-timers';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const WORK_PACKAGES_WITHOUT_DONE_CRITERIA_VIEW_UNIVERSAL_IDENTIFIER = 'ea65343d-880d-4fd0-a90b-19b22b678ace';

// Planned work counts too: done criteria are cheapest to write before the
// work is offered to anyone.
export default defineView({
  universalIdentifier: WORK_PACKAGES_WITHOUT_DONE_CRITERIA_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: no done criteria',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconListCheck',
  position: 15,
  fields: [
    { universalIdentifier: '916168fc-b3b4-4b5e-afc8-f1fc53fb8522', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e9b24108-53ea-455a-a67f-6505f593f173', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9f571ccc-7cd1-49bd-a5eb-aa7773f16775', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '3858ece0-393a-4362-ac4d-e755078637f8', fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '7ea1dbf0-a1ce-432a-995b-1fc13f63c424', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '442ab0be-0292-4b66-abaf-5bc06ee21c9d', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '3de3f520-7161-453e-90a9-4305fd047db5',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '0bce1ec6-c3d8-4486-881b-91833c1bf16d',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.PLANNED, ...STATUSES_WITH_DUE_TIMER],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'd05e0096-de2a-43a6-8f3b-cfb367f5aa77',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
