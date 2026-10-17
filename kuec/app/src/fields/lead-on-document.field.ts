import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from './documents-on-lead.field';
import { fieldDescription } from '../i18n/field-guidance';

export const LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = '0529b0be-a827-4c37-b628-5e9cf4c121b7';

export default defineField({
  universalIdentifier: LEAD_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  description: fieldDescription('document.lead'),
  icon: 'IconUserSearch',
  relationTargetObjectMetadataUniversalIdentifier:
    LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: DOCUMENTS_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'leadId',
  },
});
