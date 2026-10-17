import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-project.field';
import {
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../../objects/project.object';

export const PACK_PROJECTS_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER = '2e0d4358-aa8d-4b66-a4d0-48d7c379b4f6';

export default defineView({
  universalIdentifier: PACK_PROJECTS_ACTIVE_PROJECTS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Project pack: active projects',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '3f910cd1-14f9-41c0-ba6d-b5bc0c14caa1', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '8d58120b-3bb3-471a-91e0-d45fbdc8021c', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '06a6e035-55f8-40d2-b1ff-fe1ddefe6d63', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '322ed3bd-37b6-4230-b397-f403e25aa258', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 110 },
    { universalIdentifier: 'ee81be63-60bf-45f0-94c7-29b826f22c0a', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '19596bf1-3cfb-4e28-a33c-9d240c5aee21', fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '0a5d89db-bac8-484a-ba3d-343f69eeee15',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
  ],
  sorts: [
    {
      universalIdentifier: '07fb5ce4-633a-41f1-981c-05cc030201b6',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
