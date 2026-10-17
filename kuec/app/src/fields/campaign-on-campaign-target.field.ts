import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER } from '../objects/campaign-target.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { CAMPAIGN_TARGETS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from './campaign-targets-on-project.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER = '28120b84-cdda-4253-b800-d9b440221f76';

export default defineField({
  universalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaign',
  label: 'Campaign',
  description: fieldDescription('campaignTarget.campaign'),
  icon: 'IconSpeakerphone',
  relationTargetObjectMetadataUniversalIdentifier:
    PROJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: CAMPAIGN_TARGETS_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'campaignId',
  },
});
