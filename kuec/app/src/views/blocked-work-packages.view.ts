import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import {
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER = '9bcea6a2-7d53-4a7f-b051-c327e8fd111e';

export default defineView({
  universalIdentifier: BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Blocked',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconBarrierBlock',
  position: 3,
  fields: [
    { universalIdentifier: '6f0c9721-b065-4be9-8f24-1b77d5bacc0d', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '46a14baa-515c-44cb-af84-9507f0bbfff6', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '0186d21d-627d-42bb-98d0-f95613905a42', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'c3cfbcfc-6b59-409b-85b4-124bde54647d', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '2600a5d0-7947-4ace-a937-21fd584abfc0', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '901ea7e8-d7a5-43d7-91fd-85c7d69cb25c', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '690cf8a6-9083-483b-8137-d2ecb0d402b3',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.BLOCKED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '63c7ad01-3158-46fc-a518-dd34cce9bd36',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
