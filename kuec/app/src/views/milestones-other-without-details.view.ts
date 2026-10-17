import {
  defineView,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-milestone.field';
import {
  MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../objects/milestone.object';

export const MILESTONES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = 'c386bac3-12da-4b4c-af8f-b1edab9f4194';

// Department set to Other with Other details empty.
export default defineView({
  universalIdentifier: MILESTONES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: 'dcee13f5-6246-4ac7-ac0c-e7b0dac997ee', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '7fc26392-01c9-497c-89d7-b6ba574079a8', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'c942d836-4a51-4b83-8bce-94655d383edc', fieldMetadataUniversalIdentifier: MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '6adfa712-06d3-4d24-9012-8930bcc81bba', fieldMetadataUniversalIdentifier: MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '423116d9-6067-4566-85a3-ef887ce17d8e',
      fieldMetadataUniversalIdentifier: MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '2a675765-9557-4328-bfb6-4ab4ce58a6d2',
      fieldMetadataUniversalIdentifier: MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
    },
  ],
});
