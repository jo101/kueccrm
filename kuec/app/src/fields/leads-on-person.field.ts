import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { PERSON_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './person-on-lead.field';

export const LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '09371f39-2c7f-4976-8c7f-7584cc01739f';

export default defineField({
  universalIdentifier: LEADS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leads',
  label: 'Leads',
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PERSON_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
