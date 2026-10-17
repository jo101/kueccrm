import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../constants/opportunity-stage';
import { PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/playbook-type-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';

export const OPPORTUNITIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER = 'aa3b4bd2-7c11-4afe-9173-c572ddcc8f4d';
const OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER = '15e9d525-c217-4685-9b57-a99d7578247d';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// Open opportunities missing any of Type, Owner, Amount or Close date. Each one
// is a column, so the empty cell shows which field to fill.
export default defineView({
  universalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: missing key fields',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 15,
  fields: [
    { universalIdentifier: '3bee0c84-6fa7-4743-ab05-5492716f81a5', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '2936f625-8c22-4359-aaec-54e83c33d001', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'fd1c3bee-6046-4af7-a950-1d281328921a', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '7bf5a9b0-ff54-43bb-8108-9e0d7efa4e58', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8305dba8-d88a-484d-ac3e-cd559847fb3e', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '95a03d4c-0ab4-4771-b00a-81ac67ee10c7', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 5, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: 'd3fc1e7f-08b7-4681-b067-c41817c49617',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
    {
      universalIdentifier: '3aa37084-09fe-4233-87e7-8d02b423be5b',
      fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'b90d8a07-dc1e-48ad-8b8a-eb5a250aa379',
      fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '5b94f3ed-6987-4f86-ba79-959d16cb1999',
      fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
    {
      universalIdentifier: '81293a2d-10cf-475c-8ba1-c16581c7a791',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 3,
    },
  ],
  filterGroups: [
    { universalIdentifier: OPPORTUNITIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'c9d2c165-0f8d-4b1e-8163-a662ce1d6c9e',
      fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
