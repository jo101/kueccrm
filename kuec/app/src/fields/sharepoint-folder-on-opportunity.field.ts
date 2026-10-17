import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'e5b839c1-f922-43f9-b63c-5293a81b4bfc';

// Proposals and working documents live on SharePoint, never in Twenty (kuec/CLAUDE.md section 4).
export default defineField({
  universalIdentifier: SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.LINKS,
  name: 'sharepointFolder',
  label: 'SharePoint folder',
  description: fieldDescription('opportunity.sharepointFolder'),
  icon: 'IconFolder',
});
