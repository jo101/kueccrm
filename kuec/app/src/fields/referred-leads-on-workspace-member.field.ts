import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './referred-by-member-on-lead.field';
import { fieldDescription } from '../i18n/field-guidance';

export const REFERRED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '0eea549e-de61-4a73-a89b-4fd4c30efe1d';

export default defineField({
  universalIdentifier: REFERRED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'referredLeads',
  label: 'Referred leads',
  description: fieldDescription('workspaceMember.referredLeads'),
  icon: 'IconUserShare',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
