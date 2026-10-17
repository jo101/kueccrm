import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { CAMPAIGN_LEADS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './campaign-leads-on-project.field';

export const CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = 'd431440b-1a61-4362-95c3-67d4358726e3';

export default defineField({
  universalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaign',
  label: 'Campaign',
  description: 'The GTM campaign or workshop project the lead came from',
  icon: 'IconSpeakerphone',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAMPAIGN_LEADS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'campaignId',
  },
});
