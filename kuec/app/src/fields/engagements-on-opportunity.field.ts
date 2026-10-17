import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from './opportunity-on-engagement.field';
import { fieldDescription } from '../i18n/field-guidance';

export const ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'bfbb2c81-cf37-4f8a-9b2f-04e4f627fe98';

export default defineField({
  universalIdentifier: ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'engagements',
  label: 'Engagements',
  description: fieldDescription('opportunity.engagements'),
  icon: 'IconMessages',
  relationTargetObjectMetadataUniversalIdentifier:
    ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
