import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from './company-on-engagement.field';
import { fieldDescription } from '../i18n/field-guidance';

export const ENGAGEMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = 'ebdf1df5-3464-4f51-88e1-557d48833077';

export default defineField({
  universalIdentifier: ENGAGEMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'engagements',
  label: 'Engagements',
  description: fieldDescription('company.engagements'),
  icon: 'IconMessages',
  relationTargetObjectMetadataUniversalIdentifier:
    ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
