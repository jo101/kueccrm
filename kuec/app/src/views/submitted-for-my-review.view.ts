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
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/reviewer-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const SUBMITTED_FOR_MY_REVIEW_VIEW_UNIVERSAL_IDENTIFIER = '34079a37-ea7c-476e-927b-c1c38636a936';

export default defineView({
  universalIdentifier: SUBMITTED_FOR_MY_REVIEW_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Submitted for my review',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconEyeCheck',
  position: 2,
  fields: [
    { universalIdentifier: '84d3f950-c3bc-4a69-8eee-3eab5f16b860', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd4c3d566-f6c0-41c3-9ca0-77129dd6133b', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '542cf1d5-2036-471d-88ff-edc0faa1cf72', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '404af171-f54f-4b87-bdab-f2609e5a41a0', fieldMetadataUniversalIdentifier: WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '6db1caae-e1ae-4bb3-ae06-787fef4740a1', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '5d9b865a-44ae-4572-a633-79b0ed9fcc12', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '4ced134a-3ce3-4a09-8d70-9ed7b818a0a8',
      fieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '85e243c0-7f6b-4839-9897-619d7e400600',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.SUBMITTED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '1c6ab648-8819-4b43-947a-62ccacc70df4',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
