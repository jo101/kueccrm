import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './engagements-on-opportunity.field';

export const OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER = 'd302b3e7-952a-4b6c-a037-45c884b5ba7b';

export default defineField({
  universalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
