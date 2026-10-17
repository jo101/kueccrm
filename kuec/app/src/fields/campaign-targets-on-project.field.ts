import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER } from '../objects/campaign-target.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from './campaign-on-campaign-target.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAMPAIGN_TARGETS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER = '17ff8105-f89d-41ec-a359-3c75157c6fa4';

export default defineField({
  universalIdentifier: CAMPAIGN_TARGETS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaignTargets',
  label: 'Campaign targets',
  description: fieldDescription('project.campaignTargets'),
  icon: 'IconCrosshair',
  relationTargetObjectMetadataUniversalIdentifier:
    CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
