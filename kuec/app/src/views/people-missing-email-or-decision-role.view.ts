import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/decision-role-on-person.field';

export const PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_VIEW_UNIVERSAL_IDENTIFIER = '492b304d-b3b9-4aa3-813e-42ab27f3718b';
const PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_OR_GROUP_UNIVERSAL_IDENTIFIER = 'b8e927fe-2c70-4675-be7e-b16d40ec570d';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

export default defineView({
  universalIdentifier: PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: missing email or decision role',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 15,
  fields: [
    { universalIdentifier: 'cfd5020e-f533-4897-ac44-78952914002d', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e1cab79f-7371-4472-b579-ff9519770921', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '29f089ba-bde3-4596-8b11-c8396406c41f', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 2, isVisible: true, size: 220 },
    { universalIdentifier: 'ecfa23ac-eb20-4d8a-8680-2f646fca8fed', fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '7e9cb592-2068-4085-921c-8ed7e0199589', fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'f32946d0-1130-4424-ac25-662b0d9d1b04', fieldMetadataUniversalIdentifier: personFields.phones.universalIdentifier, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '497f54ea-5242-4686-8655-69e4c3204e8a',
      fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'c4b44759-c9f8-49c9-bf5d-5c0679097871',
      fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: PEOPLE_MISSING_EMAIL_OR_DECISION_ROLE_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
