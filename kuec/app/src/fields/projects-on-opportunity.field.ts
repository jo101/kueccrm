import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './opportunity-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const PROJECTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '1a074380-d1ee-4a10-af2a-5d2f8d3a1922';

export default defineField({
  universalIdentifier: PROJECTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'projects',
  label: 'Projects',
  description: fieldDescription('opportunity.projects'),
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
