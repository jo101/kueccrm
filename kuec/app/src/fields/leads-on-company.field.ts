import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './company-on-lead.field';
import { fieldDescription } from '../i18n/field-guidance';

export const LEADS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '8c64caac-0f3b-494d-93c4-341d7eb53d7f';

export default defineField({
  universalIdentifier: LEADS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leads',
  label: 'Leads',
  description: fieldDescription('company.leads'),
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
