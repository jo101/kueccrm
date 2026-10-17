import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './company-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '8d5f8bd1-64e3-4694-9bfc-076f7d964c6f';

export default defineField({
  universalIdentifier: PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'projects',
  label: 'Projects',
  description: fieldDescription('company.projects'),
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COMPANY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
