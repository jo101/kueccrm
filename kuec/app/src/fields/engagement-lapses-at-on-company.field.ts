import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '26f53154-e953-4bc2-9745-437eb081739d';

export default defineField({
  universalIdentifier: ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'engagementLapsesAt',
  label: 'Engagement lapses at',
  description: fieldDescription('company.engagementLapsesAt'),
  icon: 'IconHourglassLow',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
