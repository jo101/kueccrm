import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-milestone.field';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-milestone.field';
import {
  MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_STATUS,
  MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../objects/milestone.object';

export const MISSED_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER = 'c9217a6d-8b59-4f6a-9619-6fab42d05a1a';

export default defineView({
  universalIdentifier: MISSED_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Missed',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlagOff',
  position: 1,
  fields: [
    { universalIdentifier: 'bd2b8750-2542-4982-ab0d-79a22e252556', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '50b90c8a-bada-4c40-92b1-02f01bbbe74d', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'e1801a39-a5b4-4985-ad75-22691a9599e6', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'fcdf66cd-69eb-40b0-85d6-57770b402d6e', fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'dc4591d2-1110-4fe3-906c-ba94a971286e', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '5fd076d7-3ce8-4e3f-aa48-e760cb0aa832',
      fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: [MILESTONE_STATUS.DONE],
    },
    {
      universalIdentifier: 'eb3b310c-6211-4043-9595-12aab9e24849',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '20341a5b-3525-4961-8b8b-1f3fa85303a0',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
