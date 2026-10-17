import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './campaign-on-lead.field';

export const CAMPAIGN_LEADS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = '59957b3e-ce5e-4e82-a38c-84333a989404';

export default defineField({
  universalIdentifier: CAMPAIGN_LEADS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaignLeads',
  label: 'Leads',
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
