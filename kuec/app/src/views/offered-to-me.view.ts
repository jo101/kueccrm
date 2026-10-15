import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../constants/view-filter-values';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const OFFERED_TO_ME_VIEW_UNIVERSAL_IDENTIFIER = '1e7ac0af-8240-411c-badf-efd7481308ca';

export default defineView({
  universalIdentifier: OFFERED_TO_ME_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Offered to me',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconSend',
  position: 1,
  fields: [
    { universalIdentifier: '5aa0b8cc-772e-4173-b16a-c84881ee0f87', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '2f05ede7-19cf-4c8c-9496-5b837f77dc8c', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'ee333881-a6c5-4a68-8c14-4a04df3dd197', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'cabbbc1f-f3da-4cfc-b5e1-12ad1a77a945', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '42d96263-a6bf-4a29-91c9-f23de124ec7a', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '25091621-8aae-4080-9677-a96d0b582a5b', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '0cb6ec61-231b-43c7-8152-3c394e600744',
      fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '21577149-9813-4a6f-95d2-5522450ae49c',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.OFFERED],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'f6ebba87-8249-4c65-8e6f-792300c34e73',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
