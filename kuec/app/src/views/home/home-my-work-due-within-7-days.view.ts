import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { STATUSES_WITH_DUE_TIMER } from '../../automation/timers/work-package-timers';
import {
  CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
  NEXT_7_DAYS_FILTER_VALUE,
  TODAY_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export const HOME_MY_WORK_DUE_WITHIN_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '7871e59d-c77a-42b8-8b87-fd7382a2513d';
const HOME_MY_WORK_DUE_WITHIN_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'fb104f54-7cdc-45c4-9bae-f67cd2220423';

// The My work filters, narrowed to work already late or due by the end of the
// seventh day from today (Asia/Dubai), late first.
export default defineView({
  universalIdentifier: HOME_MY_WORK_DUE_WITHIN_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Home: My work due within 7 days',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '5c3e17f7-8626-44f0-8cd1-4e30967d4e91', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'b87f6789-e126-4ac4-b6b2-da4645f568d3', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'e888fd6e-7e0b-4c5d-b399-f4ddb9b28066', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'd1d56de9-99bc-4512-99c1-1ce8f7fd6ee4', fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'dac3d208-662b-4515-a43c-1d841e6e21e3', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '336a30ca-fcf5-4f64-bb21-8ddf53390843', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'e0358d02-2367-46a3-a032-d219aae9c83d',
      fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
    {
      universalIdentifier: '1e11fc4d-d33a-425a-b671-caed7699356a',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: STATUSES_WITH_DUE_TIMER,
    },
    {
      universalIdentifier: '4c8b04f6-6c8d-4200-90d7-e10eca8e4c57',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
      viewFilterGroupUniversalIdentifier: HOME_MY_WORK_DUE_WITHIN_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'edf3a2fe-2089-43c5-ad9e-866d72d5675c',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: HOME_MY_WORK_DUE_WITHIN_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '705e68f5-cbf0-47ac-939f-c510eca245c0',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: NEXT_7_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: HOME_MY_WORK_DUE_WITHIN_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
  ],
  filterGroups: [
    { universalIdentifier: HOME_MY_WORK_DUE_WITHIN_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: '7aaf9f5c-0f62-4271-8566-950271265c53',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
