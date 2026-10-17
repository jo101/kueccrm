import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from './projects-on-company.field';

export const COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = 'ac1bcd60-ac80-428d-bdcc-b6968b321d46';

// Synced email shows on companies, not on projects, so a project's mail is
// found through this link (runbooks/12-global-features.md).
export default defineField({
  universalIdentifier: COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'company',
  label: 'Company',
  icon: 'IconBuildingSkyscraper',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'companyId',
  },
});
