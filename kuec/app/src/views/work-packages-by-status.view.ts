import {
  AggregateOperations,
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
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

export const WORK_PACKAGES_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER = '1d547ae4-4ed3-44d5-a035-a155378064f3';

export default defineView({
  universalIdentifier: WORK_PACKAGES_BY_STATUS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By status',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 4,
  mainGroupByFieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  kanbanAggregateOperation: AggregateOperations.COUNT,
  fields: [
    { universalIdentifier: '10872d56-4608-47ab-8811-62e0053ed64e', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd5625122-056c-4a60-810b-4ec6113db650', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '90f0b985-04c1-4cbe-8793-3522a9cfbb5a', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '2c379101-e1c7-4a3e-8d07-35ef7d643dfc', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: 'ae94f8a0-3ec4-42b7-b1eb-2b665f1a7d72', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
  ],
  groups: [
    { universalIdentifier: '52690bab-3682-4519-82b3-b941d681643e', fieldValue: WORK_PACKAGE_STATUS.PLANNED, position: 0, isVisible: true },
    { universalIdentifier: 'dc6506c8-3ed7-4517-b6da-0c453fd83709', fieldValue: WORK_PACKAGE_STATUS.OFFERED, position: 1, isVisible: true },
    { universalIdentifier: 'e4d6d954-c0c0-4ab5-8c6a-28af78356175', fieldValue: WORK_PACKAGE_STATUS.ACCEPTED, position: 2, isVisible: true },
    { universalIdentifier: 'fdc62486-cb59-465b-baf4-4e100ae6572c', fieldValue: WORK_PACKAGE_STATUS.SUBMITTED, position: 3, isVisible: true },
    { universalIdentifier: 'cc43316a-5e06-4333-8eba-b2c828ab5747', fieldValue: WORK_PACKAGE_STATUS.BLOCKED, position: 4, isVisible: true },
    { universalIdentifier: '1037b540-d2e9-4ffe-bee9-7722e2971231', fieldValue: WORK_PACKAGE_STATUS.DONE, position: 5, isVisible: true },
    { universalIdentifier: '3c714a5d-3d03-45af-b231-d771ad97962f', fieldValue: WORK_PACKAGE_STATUS.DECLINED, position: 6, isVisible: false },
    { universalIdentifier: '63a0b6c7-0191-4dc4-92f3-a5dec5cd8dc0', fieldValue: WORK_PACKAGE_STATUS.CANCELLED, position: 7, isVisible: false },
  ],
  sorts: [
    {
      universalIdentifier: '5fca92d8-8703-46c8-ae0c-66080a5a5780',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
