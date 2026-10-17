import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { REFERRED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER } from './referred-leads-on-workspace-member.field';

export const REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = '72aa4bb8-3ad4-4331-8410-9c044f66048b';

export default defineField({
  universalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'referredByMember',
  label: 'Referred by (colleague)',
  description: 'The colleague who referred or logged this contact; they hold the referral credit',
  icon: 'IconUserShare',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: REFERRED_LEADS_ON_WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'referredByMemberId',
  },
});
