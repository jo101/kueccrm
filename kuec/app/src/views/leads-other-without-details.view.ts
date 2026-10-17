import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DEPARTMENT } from '../constants/taxonomy';
import { OPPORTUNITY_OFFERING } from '../fields/offering-on-opportunity.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import { OPPORTUNITY_SOURCE } from '../fields/source-on-opportunity.field';
import {
  LEAD_DEAD_REASON,
  LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = 'f4d7fe1c-e327-4997-a8f8-5e3c4896e871';
const LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'fe8b019e-6a13-4b85-a688-ea948b7063c5';

// Source, Offering interest, Department or Dead reason set to Other with Other details empty.
export default defineView({
  universalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: '1d5fc573-7dd6-446c-8fda-273417755e39', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '7aec166c-1bef-408b-8541-94f1f7f6ab4e', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'd016a6a2-177e-483d-a47b-064a4232b189', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'e6460d32-4e46-4894-a1be-8ef4bfcb862e', fieldMetadataUniversalIdentifier: LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '22ab6b81-3163-4853-9f3f-cf3f610156d3', fieldMetadataUniversalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '626811b6-f4e7-4ea1-9dda-4dc10025be51', fieldMetadataUniversalIdentifier: LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
    { universalIdentifier: '4295a987-e14b-41bb-bfb6-de0f5c922084', fieldMetadataUniversalIdentifier: LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: false, size: 200 },
  ],
  filters: [
    {
      universalIdentifier: '0f5a66fa-c831-4b1a-b7f2-aab99beb80a5',
      fieldMetadataUniversalIdentifier: LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '1523e077-c568-4a48-b8e0-9b7e7f739eda',
      fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_SOURCE.OTHER],
      viewFilterGroupUniversalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '47c2a028-5038-495e-9cf1-213d16673d12',
      fieldMetadataUniversalIdentifier: LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.CONTAINS,
      value: [OPPORTUNITY_OFFERING.OTHER],
      viewFilterGroupUniversalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '9f88eb11-dbc8-476f-8bbe-9befc6502003',
      fieldMetadataUniversalIdentifier: LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [DEPARTMENT.OTHER],
      viewFilterGroupUniversalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
    {
      universalIdentifier: '00191832-9d6c-425d-90c5-2860b04f4249',
      fieldMetadataUniversalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_DEAD_REASON.OTHER],
      viewFilterGroupUniversalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 3,
    },
  ],
  filterGroups: [
    { universalIdentifier: LEADS_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
