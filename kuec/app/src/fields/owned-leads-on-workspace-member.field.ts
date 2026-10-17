import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './owner-on-lead.field';
import { fieldDescription } from '../i18n/field-guidance';

export const OWNED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = '413d5ee3-d7cd-4146-baf3-a334f89fa9d2';

export default defineField({
  universalIdentifier: OWNED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ownedLeads',
  label: 'Owned leads',
  description: fieldDescription('workspaceMember.ownedLeads'),
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
