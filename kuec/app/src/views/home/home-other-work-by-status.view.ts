import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { STATUSES_WITH_DUE_TIMER } from '../../automation/timers/work-package-timers';
import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from '../../constants/view-filter-values';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export const HOME_OTHER_WORK_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER = '554330f3-c611-427a-b831-a9730ae3ba3f';

// A view cannot filter on "cases I own" (the owner of the related opportunity),
// so this counts the team's open work held by someone else, grouped by status.
export default defineView({
  universalIdentifier: HOME_OTHER_WORK_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Home: Other work by status',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  mainGroupByFieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '03e41be4-5216-4b7f-a94c-01f6bf9343d0', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: '3f40f2ec-019b-4f85-a76a-91445557dbcd', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'a603ea40-5faf-49d8-8772-df7a96689a52', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'f564de2c-2220-4766-9880-9abb9cc360a7', fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '72b27b0b-5e6c-4717-adef-18b0d104a746', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'ea260bfb-3a96-484d-9614-04ee5194b5ae', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'a66ab501-7b4e-4d3b-afdd-82146db6865e',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: STATUSES_WITH_DUE_TIMER,
    },
    {
      universalIdentifier: '292ebc79-47b6-42db-afe1-6689d23b9c54',
      fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
    },
  ],
  groups: [
    { universalIdentifier: '4c01cc4a-b56b-4754-b816-3df1aa401c05', fieldValue: WORK_PACKAGE_STATUS.PLANNED, position: 0, isVisible: false },
    { universalIdentifier: 'dce9473a-3bb6-4cc5-813c-84158b13dd57', fieldValue: WORK_PACKAGE_STATUS.OFFERED, position: 1, isVisible: true },
    { universalIdentifier: '2a962be5-31bb-41cf-84cf-37cb91e96f42', fieldValue: WORK_PACKAGE_STATUS.ACCEPTED, position: 2, isVisible: true },
    { universalIdentifier: 'db3ec421-b82f-4a17-bced-8c15dcc826db', fieldValue: WORK_PACKAGE_STATUS.SUBMITTED, position: 3, isVisible: true },
    { universalIdentifier: '4fb62563-bcb4-41a6-bf93-9b24b0c8ab1f', fieldValue: WORK_PACKAGE_STATUS.BLOCKED, position: 4, isVisible: true },
    { universalIdentifier: 'f853f2df-dc86-4d1e-990e-4aba3e617c08', fieldValue: WORK_PACKAGE_STATUS.DONE, position: 5, isVisible: false },
    { universalIdentifier: '52b7406e-7513-41c8-ac76-cdda0b4f5ba0', fieldValue: WORK_PACKAGE_STATUS.DECLINED, position: 6, isVisible: false },
    { universalIdentifier: 'a610e524-610d-49ca-870d-3d3411b7c9f4', fieldValue: WORK_PACKAGE_STATUS.CANCELLED, position: 7, isVisible: false },
  ],
  sorts: [
    {
      universalIdentifier: '953fc070-2726-4720-a040-025491250011',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
