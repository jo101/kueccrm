import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = 'b24f9955-8e9c-4d8c-9fc6-a61d73074aaf';

export default defineField({
  universalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'lastEngagementAt',
  label: 'Last engagement',
  description: fieldDescription('company.lastEngagementAt'),
  icon: 'IconMessages',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
