import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from './documents-on-opportunity.field';

export const OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER = 'cd48450c-3780-4f9c-a26d-cea84cc4caad';

export default defineField({
  universalIdentifier: OPPORTUNITY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: DOCUMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
