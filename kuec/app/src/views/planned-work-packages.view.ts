import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/depends-on-on-work-package.field';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const PLANNED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER = 'd0d2c15f-3d47-49ae-9d7a-78b3d3945b5f';

export default defineView({
  universalIdentifier: PLANNED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Planned',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconHourglass',
  position: 5,
  fields: [
    { universalIdentifier: '4bb93d77-1ce7-46c1-b4fa-8eab930cea4b', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f4b0d51e-5699-40e9-8171-4f4c8957434d', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '372d8ae3-2548-48ac-ba16-0984c0f1e1f5', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '2a663d4d-07f2-4367-84e6-18a480736d92', fieldMetadataUniversalIdentifier: DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '03bcaca7-0fdd-44d8-a56d-cf3492d8240d', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '6244f60d-459e-40cc-9eac-bd16a5b370a4', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'ca02e381-e33a-4832-bf04-a15b5b1c2da3',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.PLANNED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '91fac727-4528-4629-8c05-1960f72b83b7',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
