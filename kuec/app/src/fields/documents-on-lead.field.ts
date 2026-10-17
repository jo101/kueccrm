import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from './lead-on-document.field';

export const DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER = '0298bd0c-d690-4273-87c4-13bcbd135346';

export default defineField({
  universalIdentifier: DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'documents',
  label: 'Documents',
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier:
    DOCUMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
