import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './referred-by-on-lead.field';

export const REFERRED_LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = 'cca91da3-9466-4b25-b88d-1de5c946eae9';

export default defineField({
  universalIdentifier: REFERRED_LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'referredLeads',
  label: 'Referred leads',
  icon: 'IconUserShare',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
