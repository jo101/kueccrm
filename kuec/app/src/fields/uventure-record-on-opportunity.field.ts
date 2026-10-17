import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const UVENTURE_RECORD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '74f80387-50fd-446e-a71d-42320ec770b1';

// The technology, challenge or licence this case is about lives in uVENTURE
// (kuec/CLAUDE.md section 5); the case carries its link.
export default defineField({
  universalIdentifier: UVENTURE_RECORD_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.LINKS,
  name: 'uventureRecord',
  label: 'uVENTURE record',
  description: fieldDescription('opportunity.uventureRecord'),
  icon: 'IconLink',
});
