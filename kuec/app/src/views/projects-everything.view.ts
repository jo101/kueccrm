import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-project.field';
import { MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/milestones-on-project.field';
import { OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-project.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import { WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/work-packages-on-project.field';
import {
  PROJECT_CLOSE_TASK_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_EVENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';

export const PROJECTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '13b58901-a368-4cea-8743-9036301f3394';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: PROJECTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '97424339-f75f-45d0-af98-e51145fbe85a', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '08bf012c-b137-43f0-924c-44571fa1eb33', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'ad810346-616d-4290-a874-cd5b9d3c44d9', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'a6957339-ccf6-469a-8b9e-9671ca8824ab', fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '375a5d89-110a-413b-97af-67d4917a96f3', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '0b3c2688-e463-4e7b-9ef6-2960b674414e', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '20a76266-c783-4b61-b4d4-d8cd3042ba20', fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 140 },
    { universalIdentifier: '2d9d7a3e-1202-4745-9109-b44780e6cc00', fieldMetadataUniversalIdentifier: PROJECT_EVENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 140 },
    { universalIdentifier: '876b0921-1178-4677-b601-f9bc9743dac1', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 170 },
    { universalIdentifier: '9262b772-fd05-4cb5-b706-a3664844edf1', fieldMetadataUniversalIdentifier: MILESTONES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 170 },
    { universalIdentifier: 'a6214415-c10b-4664-976b-533acb1411b6', fieldMetadataUniversalIdentifier: WORK_PACKAGES_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 170 },
    { universalIdentifier: '7a538edb-6be3-4db9-b9d5-65dd53acac7c', fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_APPLIED_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 130 },
    { universalIdentifier: '0e37f68d-246c-4a87-b1c2-84c0fcdc157b', fieldMetadataUniversalIdentifier: PROJECT_CLOSE_TASK_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 140 },
    { universalIdentifier: '67fe7577-cbd6-4471-8acc-0f62374c96c2', fieldMetadataUniversalIdentifier: COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 170 },
    { universalIdentifier: 'd02f9aac-97c1-42c2-a254-63ced8257ab4', fieldMetadataUniversalIdentifier: PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 140 },
    { universalIdentifier: 'b10d14f4-98d8-4cc6-ae4f-e72f2f329a4b', fieldMetadataUniversalIdentifier: PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: '00c2841c-cbca-4793-b1dd-f6a01aee25bd',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
