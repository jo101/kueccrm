import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/opportunity-on-project.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-project.field';
import {
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../../objects/project.object';

export const BD_TEAM_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER = '502adbcb-f994-4f36-b45b-3a4763876f9b';

export default defineView({
  universalIdentifier: BD_TEAM_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Team active projects',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '59ea0e72-dfd0-4443-9627-e1d8f3ad0848', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3ff3ce6c-0b20-4dcf-912e-b251039057e7', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '79c9ac28-bb3f-4d19-ac89-ec0174ed5e8c', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '5d2cdbd9-730f-409f-b0b1-3ccba2aaf352', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '27f050dc-80e3-427a-9355-65a26351875d', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'e187393b-046c-4d1a-9834-b05588c0d35c', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '70a63ad4-5174-4cf4-8096-f75e15c27a89',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'c5af4a65-ff0a-4e4f-aa9d-6d909d8efa2b',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
