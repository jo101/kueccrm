import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { ENGAGEMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './engagements-on-lead.field';

export const LEAD_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER = '283ae3ca-a147-4db2-a06f-55413618515a';

export default defineField({
  universalIdentifier: LEAD_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  description: 'The lead this contact was about; its date becomes the lead\'s last engagement',
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: ENGAGEMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'leadId',
  },
});
