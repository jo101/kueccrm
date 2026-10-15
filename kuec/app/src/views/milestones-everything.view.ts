import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-milestone.field';
import { PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-milestone.field';
import { WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/work-packages-on-milestone.field';
import {
  MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../objects/milestone.object';

export const MILESTONES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = 'a905bac7-616e-4fb7-b49d-58d6485e53e7';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: MILESTONES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '0fafadbe-32af-4002-b57c-6a5d337e0d2a', fieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '0d038687-8cc3-4b28-b883-217aa60ee9d7', fieldMetadataUniversalIdentifier: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'cb95911a-5d17-4ae8-8068-9942a5800a80', fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'a3a94dc0-48d7-404b-ba1e-b8abefdb4871', fieldMetadataUniversalIdentifier: MILESTONE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '1ecc1fce-9e6a-4ade-bad6-5508c80cc7f6', fieldMetadataUniversalIdentifier: PROJECT_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '077cf329-ea9e-4cff-a272-d8563081b2a7', fieldMetadataUniversalIdentifier: WORK_PACKAGES_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: 'beba6fac-ecd8-4dd0-9f4e-162f2baf3895', fieldMetadataUniversalIdentifier: MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: '0ae0edb9-6c76-48cd-9216-c172deb40f4d',
      fieldMetadataUniversalIdentifier: MILESTONE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
