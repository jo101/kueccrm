import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { STATUSES_WITH_DUE_TIMER } from '../../automation/timers/work-package-timers';
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

export const BD_TEAM_WORK_PACKAGE_BOARD_VIEW_UNIVERSAL_IDENTIFIER = '9b1fa10b-281c-4dba-bbcc-5b4b0d1ae3cc';

export default defineView({
  universalIdentifier: BD_TEAM_WORK_PACKAGE_BOARD_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Team work package board',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.KANBAN_WIDGET,
  icon: 'IconLayoutKanban',
  mainGroupByFieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  kanbanAggregateOperation: AggregateOperations.COUNT,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'f3e2670b-41d2-4ad0-8642-f2c5a1eb16ef', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'ba776e56-a3fa-4fe3-b1e5-214135c57df1', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'b4b9d984-6385-4a2e-bbd4-c0784bb547d9', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '4f414009-2368-4582-b815-609c7ad9599c', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '8816635f-7a68-48c0-a8a7-9b3a44c002bc', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '32ba4606-d833-430c-8c34-9eb2713be0c8',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: STATUSES_WITH_DUE_TIMER,
    },
  ],
  groups: [
    { universalIdentifier: '231719ee-2256-4667-a92c-7d5389810700', fieldValue: WORK_PACKAGE_STATUS.PLANNED, position: 0, isVisible: false },
    { universalIdentifier: 'fc66c57c-6b36-4dc7-baf9-5dc890601fc0', fieldValue: WORK_PACKAGE_STATUS.OFFERED, position: 1, isVisible: true },
    { universalIdentifier: 'f9ce3257-dc1e-40cd-9588-65e9bebe7c29', fieldValue: WORK_PACKAGE_STATUS.ACCEPTED, position: 2, isVisible: true },
    { universalIdentifier: '8b1d25a5-0af5-4d9f-b041-1278e889bef5', fieldValue: WORK_PACKAGE_STATUS.SUBMITTED, position: 3, isVisible: true },
    { universalIdentifier: '76135bcb-2db1-48ba-9099-cb2807ac1632', fieldValue: WORK_PACKAGE_STATUS.BLOCKED, position: 4, isVisible: true },
    { universalIdentifier: '2c6030e3-9e01-4c5c-8eee-0d251a9e2b27', fieldValue: WORK_PACKAGE_STATUS.DONE, position: 5, isVisible: false },
    { universalIdentifier: '5b9e7a0e-fb31-4295-9ca3-48f8bf20db50', fieldValue: WORK_PACKAGE_STATUS.DECLINED, position: 6, isVisible: false },
    { universalIdentifier: 'bd50e572-2e22-408f-a546-b06984b60f5e', fieldValue: WORK_PACKAGE_STATUS.CANCELLED, position: 7, isVisible: false },
  ],
  sorts: [
    {
      universalIdentifier: '9f919eaf-c06e-42a9-85c3-17393ce4f014',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
