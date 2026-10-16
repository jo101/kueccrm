import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../../constants/view-filter-values';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-work-package.field';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/reviewer-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export const HOME_NEEDS_YOUR_DECISION_VIEW_UNIVERSAL_IDENTIFIER = '23d6930a-3771-4cc5-84d9-7c7d4a2719cf';
const HOME_NEEDS_YOUR_DECISION_ANY_GROUP_UNIVERSAL_IDENTIFIER = '562d176b-6b0a-492a-94b9-c40a598851b8';
const HOME_NEEDS_YOUR_DECISION_BLOCKED_GROUP_UNIVERSAL_IDENTIFIER = '439aad91-6620-41d3-8887-1ce75ef36fff';
const HOME_NEEDS_YOUR_DECISION_REVIEW_GROUP_UNIVERSAL_IDENTIFIER = '4572ba95-09ea-494a-b6a9-e516764c7d44';

// One table cannot read two views, so this is the Blocked view OR the
// Submitted for my review view, each kept as its own group of filters.
export default defineView({
  universalIdentifier: HOME_NEEDS_YOUR_DECISION_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Home: Needs your decision',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '5885ac01-ca29-46ed-83fc-9fd6c8aa64b5', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'a5f7603e-6a8c-41b8-ad94-004438f34a9a', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'f7d4caab-9e14-420a-82e9-cb646fb0a7b1', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'b09b44bc-43d2-42bc-be08-b82013732fe3', fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '9ed43ac7-5b81-4788-8f48-c0292e47039c', fieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'e59bee02-4a82-4393-9604-a5cfbf969f9b', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '8d45d59c-c847-4fc3-af01-d82c030e0d9f',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.BLOCKED],
      viewFilterGroupUniversalIdentifier: HOME_NEEDS_YOUR_DECISION_BLOCKED_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'a59f3522-a54d-4cf7-aff8-b0d5941aab2e',
      fieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: HOME_NEEDS_YOUR_DECISION_REVIEW_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '0ca7d6ee-64b0-4ff2-91e0-ba55e9dbcb8e',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.SUBMITTED],
      viewFilterGroupUniversalIdentifier: HOME_NEEDS_YOUR_DECISION_REVIEW_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: HOME_NEEDS_YOUR_DECISION_ANY_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
    { universalIdentifier: HOME_NEEDS_YOUR_DECISION_BLOCKED_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.AND, parentViewFilterGroupUniversalIdentifier: HOME_NEEDS_YOUR_DECISION_ANY_GROUP_UNIVERSAL_IDENTIFIER, positionInViewFilterGroup: 0 },
    { universalIdentifier: HOME_NEEDS_YOUR_DECISION_REVIEW_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.AND, parentViewFilterGroupUniversalIdentifier: HOME_NEEDS_YOUR_DECISION_ANY_GROUP_UNIVERSAL_IDENTIFIER, positionInViewFilterGroup: 1 },
  ],
  sorts: [
    {
      universalIdentifier: '983f1644-9162-4619-ba34-c7c5d65464ed',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
