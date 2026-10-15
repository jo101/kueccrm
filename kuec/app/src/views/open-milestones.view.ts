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

export const OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER = '343a2c0d-30e2-4bbe-9fe9-714a7afe2bf4';

export default defineView({
  universalIdentifier: OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Open',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlag',
  position: 2,
  fields: [
    { universalIdentifier: 'f38532a2-6179-4701-8522-c0a7fe597c87', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '388b9b05-0549-4daf-821d-b987d118ddfb', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'ca386aed-f134-4cda-9014-9f9eed03f245', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'fd5fd682-9557-4d49-9ddd-4f7173998ca4', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'ba5f8700-0298-437a-8076-d94701c279da',
      fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [MILESTONE_STATUS.OPEN],
    },
  ],
  sorts: [
    {
      universalIdentifier: '57b42f11-769b-42ce-bbb0-6cbcc932eab8',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
