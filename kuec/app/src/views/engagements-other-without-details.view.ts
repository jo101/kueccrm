import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_TYPE,
  ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = 'cc1d1f73-5645-4fb4-a675-42677e53c92c';
const ENGAGEMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'e1281cd3-c4a9-41b5-82a3-286c1d47d5a0';

// Kind, Outcome type or Department set to Other with Other details empty.
export default defineView({
  universalIdentifier: ENGAGEMENTS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: '7de02480-7e48-4725-88ff-ab65174f15d8', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '52478fb8-5e1e-42e4-9a6f-4710d0fe0f2f', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '43638644-3930-43bd-9d44-a0e85ac5e144', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '2cfb94c8-4dac-4f44-a87b-cbe73bc9809b', fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '76da39b5-228c-48e0-b085-e041db2689ad', fieldMetadataUniversalIdentifier: ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'ba9a2782-67b6-4af9-8387-ed639ec4fa01', fieldMetadataUniversalIdentifier: ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '5d776ffa-7a5c-4112-b029-ff691b3cfb04',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '61f9c253-668e-48fd-8341-c3e772a20bbc',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [ENGAGEMENT_KIND.OTHER],
      viewFilterGroupUniversalIdentifier: ENGAGEMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'a47799c4-ddbe-40ac-9c63-00e90e99d1ae',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [ENGAGEMENT_OUTCOME_TYPE.OTHER],
      viewFilterGroupUniversalIdentifier: ENGAGEMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '29eff854-9713-452f-bf4a-09d4e4d6585f',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
      viewFilterGroupUniversalIdentifier: ENGAGEMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
  ],
  filterGroups: [
    { universalIdentifier: ENGAGEMENTS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
