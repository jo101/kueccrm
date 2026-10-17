import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/project-on-work-package.field';
import {
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export const PACK_PROJECTS_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER = '7449b0a8-107f-4a0d-99a7-c6a05be5e7f2';

export default defineView({
  universalIdentifier: PACK_PROJECTS_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Project pack: blocked work packages',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'a2b944a5-4103-4191-82cb-d9aa4279b03c', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '107b4e6c-46e2-4e12-8412-e4907cee8e71', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '55e9d65f-b90b-4557-9863-941f09e76e09', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'e6e0943d-ad25-4423-824e-a79bacb8c292', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 240 },
    { universalIdentifier: '236890d5-409c-41a6-b5d8-6a5fc022ef7e', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: 'ac3e7afa-7b92-4ba6-8c99-08811e85dfb6', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: 'a95f4e8f-5c95-44ed-978c-fc96c6b53259',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.BLOCKED],
    },
    {
      universalIdentifier: 'f3e165b6-d948-49f3-b67d-276ea72c7402',
      fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'ea5d5894-a56e-4268-acaf-203b59414031',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
