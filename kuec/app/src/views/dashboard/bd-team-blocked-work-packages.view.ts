import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-work-package.field';
import {
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export const BD_TEAM_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER = '67fcd8fe-e302-496d-89f5-5756e91b245d';

export default defineView({
  universalIdentifier: BD_TEAM_BLOCKED_WORK_PACKAGES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Team blocked work packages',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '68a21c11-56f8-4964-8a7e-1bbb2de4bfb8', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '89656677-3ea4-4d54-a8cd-71ca86cc0326', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '68acf909-0715-4fe2-9393-dc88796e6420', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '35fc1f64-0ebc-47f2-9913-7d1c449a4923', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '82ea9bfd-a5a7-4562-a83d-2952d9923552', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'c9611bcd-df4e-46c0-b8ba-5dd58902a51f', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'b13b9a73-62d6-4e53-87b9-9b99f3bbd9e6',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [WORK_PACKAGE_STATUS.BLOCKED],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'e679979a-fcad-48da-be83-e6893199fd7c',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
