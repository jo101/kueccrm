import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-project.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import {
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';

export const PROJECTS_AT_RISK_VIEW_UNIVERSAL_IDENTIFIER = '6ce24ca1-2081-4463-a5d4-cf8f3688fdcf';

export default defineView({
  universalIdentifier: PROJECTS_AT_RISK_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'At risk',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertTriangle',
  position: 2,
  fields: [
    { universalIdentifier: '0f5c27cb-4987-4852-9c0c-963b76eedb47', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3c1416ba-0043-4762-878f-5edfcf247bf1', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '33576b77-20c6-4319-9cdf-8947532db928', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0b10170d-93b9-4f5e-9011-6423025d9d4b', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'd72a61aa-68aa-49e7-bd22-4a6ae43abfae', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: 'bc2e05f7-9d17-4788-af91-b231bf44bb12', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'f4c3396b-5cce-4251-b276-5e9ad0ce92d2',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
    {
      universalIdentifier: '7e4ccbcf-103f-4888-ad46-95d5b04a170d',
      fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_HEALTH.AMBER, PROJECT_HEALTH.RED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '2dfff9d3-7789-4ed8-9afc-5427765d8e9e',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
