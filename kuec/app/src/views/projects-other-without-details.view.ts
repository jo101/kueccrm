import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import {
  PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_TYPE,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';

export const PROJECTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = '5007a038-d54b-4dc1-b1bb-d2739cf8185b';
const PROJECTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'b639ed10-1f54-46ce-996d-af29cb289b69';

// Type or Department set to Other with Other details empty.
export default defineView({
  universalIdentifier: PROJECTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: 'e6efe30e-4661-46fc-9ebe-cd1ea7b047c0', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'efa4c400-2d8a-4642-9217-50ac9ba08c43', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'd84bd7b2-7abf-4c3f-82b7-97863acbd126', fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'c16f7710-cd7c-41bd-8302-0038a527507a', fieldMetadataUniversalIdentifier: PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '2d134640-e286-4414-b887-e76788491db6', fieldMetadataUniversalIdentifier: PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '6a43cf2f-873d-4802-aef1-226697341404',
      fieldMetadataUniversalIdentifier: PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '29785490-0e9d-46c8-a458-a554aa5e7f83',
      fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_TYPE.OTHER],
      viewFilterGroupUniversalIdentifier: PROJECTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '6da0f40a-e17f-4309-ac95-169c4bce1c41',
      fieldMetadataUniversalIdentifier: PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
      viewFilterGroupUniversalIdentifier: PROJECTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: PROJECTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
