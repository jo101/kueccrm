import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER } from '../objects/campaign-target.object';
import { COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from './company-on-campaign-target.field';
import { fieldDescription } from '../i18n/field-guidance';

export const CAMPAIGN_TARGETS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '46edf159-2d8f-4182-af54-820efda5aeee';

export default defineField({
  universalIdentifier: CAMPAIGN_TARGETS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'campaignTargets',
  label: 'Campaign targets',
  description: fieldDescription('company.campaignTargets'),
  icon: 'IconCrosshair',
  relationTargetObjectMetadataUniversalIdentifier:
    CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
