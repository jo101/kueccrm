import {
  defineView,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import {
  WORK_PACKAGE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const WORK_PACKAGES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = 'be4fe191-b077-4b54-b5ec-afde826e54e8';

// Department set to Other with Other details empty. BD officers cannot edit
// either field, so the ops coordinator fixes these (runbooks/18-taxonomy.md).
export default defineView({
  universalIdentifier: WORK_PACKAGES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: 'f4c05be3-15d4-46ea-823b-54aed7c133c2', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '014fd91b-1647-48ba-8ed0-15edeed7ea95', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '4561c18e-393a-4899-84b6-695cccfe8ca2', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '45932d00-4ec9-4a1f-9959-733b4af07537', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: 'd6826da4-930a-45eb-84fa-9095ca201f5d',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: 'f5dc5c58-6251-4395-90ee-e2a44f8160c2',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
    },
  ],
});
