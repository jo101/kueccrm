import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER } from '../objects/campaign-target.object';
import { CAMPAIGN_TARGETS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from './campaign-targets-on-company.field';
import { fieldDescription } from '../i18n/field-guidance';

export const COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER = '4bd1cfb0-9530-4091-8225-0c9c6a2762e0';

export default defineField({
  universalIdentifier: COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'company',
  label: 'Company',
  description: fieldDescription('campaignTarget.company'),
  icon: 'IconBuildingSkyscraper',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: CAMPAIGN_TARGETS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'companyId',
  },
});
