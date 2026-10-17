import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { REFERRED_LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from './referred-leads-on-person.field';
import { fieldDescription } from '../i18n/field-guidance';

export const REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = 'a299edca-e776-4cc0-9a2f-f657b40f6132';

export default defineField({
  universalIdentifier: REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'referredBy',
  label: 'Referred by',
  description: fieldDescription('lead.referredBy'),
  icon: 'IconUserShare',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: REFERRED_LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'referredById',
  },
});
