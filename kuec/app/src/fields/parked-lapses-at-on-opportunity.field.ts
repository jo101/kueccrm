import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '47861ba1-a817-4806-89c7-83d3e7fda4b7';

export default defineField({
  universalIdentifier: PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'parkedLapsesAt',
  label: 'Parked lapses at',
  description: fieldDescription('opportunity.parkedLapsesAt'),
  icon: 'IconHourglassLow',
  isAuditLogged: false,
  writability: MetadataWritability.APPLICATION,
});
