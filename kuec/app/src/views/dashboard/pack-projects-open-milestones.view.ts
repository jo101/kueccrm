import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-milestone.field';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/project-on-milestone.field';
import {
  MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_STATUS,
  MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../../objects/milestone.object';

export const PACK_PROJECTS_OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER = '99257082-cab5-405a-b42d-5f6c1d52c297';

export default defineView({
  universalIdentifier: PACK_PROJECTS_OPEN_MILESTONES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Project pack: open milestones',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '7fa4e80e-eace-4d66-a18b-4d1f6ae778b8', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '626781d9-a760-4d15-a5e0-c470eb255d47', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '4f5c4bc7-581c-461d-af89-8138cb403c20', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '79aa8f63-f531-405b-ad1b-d149ed4ddee7', fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 110 },
    { universalIdentifier: 'da11d274-c2c6-4b76-8000-7d7585d14b46', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '928b9567-55d0-4b75-996a-086e1c4c898f',
      fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [MILESTONE_STATUS.OPEN, MILESTONE_STATUS.MISSED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '4930f12d-8a40-4fc4-8a18-c95858cd7d82',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
