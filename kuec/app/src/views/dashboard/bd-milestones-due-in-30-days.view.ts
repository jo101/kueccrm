import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  NEXT_30_DAYS_FILTER_VALUE,
  TODAY_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-milestone.field';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/project-on-milestone.field';
import {
  MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_STATUS,
  MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../../objects/milestone.object';

export const BD_MILESTONES_DUE_IN_30_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '4ef01dbe-e810-4bfe-9de0-56ab99bc9490';
const BD_MILESTONES_DUE_IN_30_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'c2818597-2fb6-4b08-b6f0-31db51e1c408';

export default defineView({
  universalIdentifier: BD_MILESTONES_DUE_IN_30_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Milestones due in 30 days',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '83ae088f-e462-44fe-93ea-3c281d12bd7d', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '55b42846-21a4-4c7e-98fc-494ac6b63e41', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '17d47ca4-5c57-4a00-ae5a-eab3357803f4', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'be6a17fe-3daf-4e94-8b12-b3769f4e379f', fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'd90d4e64-00f0-4fe4-a32f-0def41dabfcd', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '7b70acc1-18ae-40a1-ab85-fd191dfd09e8',
      fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [MILESTONE_STATUS.OPEN],
    },
    {
      universalIdentifier: 'd1841226-aab7-4d06-8689-ce8c5e39c172',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_MILESTONES_DUE_IN_30_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'c0e2e9e3-1fd0-4c7e-8f63-c3fc0331884e',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: NEXT_30_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_MILESTONES_DUE_IN_30_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: BD_MILESTONES_DUE_IN_30_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'f2e00479-239e-4a08-b76c-cb4197c38744',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
