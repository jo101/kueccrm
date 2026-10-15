import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import {
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';

export const PROJECTS_BY_HEALTH_VIEW_UNIVERSAL_IDENTIFIER = 'fa3f3c89-c02d-4f3b-beb9-5e6cc5754b06';

export default defineView({
  universalIdentifier: PROJECTS_BY_HEALTH_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By health',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconHeartbeat',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '17a82706-7938-4311-9432-88cb739078d3', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '873ca2f2-ff2d-4238-8329-cc825057b966', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9dea47e6-c257-4ea3-a3d6-06e1a093382a', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '06e0c81a-22dc-451f-9360-4c096fb895b7', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'ff596a22-9068-401b-aa13-dc7b5389ba8e', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '697af14c-99f0-444f-ac3a-f6bc05ee413b', fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
  ],
  groups: [
    { universalIdentifier: 'e9df2b9b-f8e8-47f2-b4e2-4902abbc68a3', fieldValue: PROJECT_HEALTH.GREEN, position: 0, isVisible: true },
    { universalIdentifier: '2060840f-b0ad-436c-9360-818d55407291', fieldValue: PROJECT_HEALTH.AMBER, position: 1, isVisible: true },
    { universalIdentifier: '175203a7-3dd3-4162-b7bf-637872aa942e', fieldValue: PROJECT_HEALTH.RED, position: 2, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '6c7ceda1-af07-4ff8-b7ce-04a79ee8809b',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
  ],
  sorts: [
    {
      universalIdentifier: '04a7c45b-297b-4d76-a89f-3d74c7d59f1e',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
