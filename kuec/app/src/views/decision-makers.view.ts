import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import {
  DECISION_ROLE,
  DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/decision-role-on-person.field';
import { IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-champion-on-person.field';

export const DECISION_MAKERS_VIEW_UNIVERSAL_IDENTIFIER = 'f1d0f43e-7689-4627-b9ec-efe83bb6427b';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

export default defineView({
  universalIdentifier: DECISION_MAKERS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Decision makers',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconHierarchy2',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'ef84c1db-9a1d-43d8-b9ad-595c8d8edf79', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'c9b3796c-bd0c-48b7-982d-036c52aae7d4', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'f1ea54d6-6a5b-4dd5-9845-5bddf3bdc028', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 2, isVisible: true, size: 220 },
    { universalIdentifier: 'aee38654-15b1-4bdf-a131-6e9a12050ac7', fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '2e98a733-75b0-4fad-a438-54e2c0175df4', fieldMetadataUniversalIdentifier: IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '8d4d0279-57ea-4897-bc44-6f863794260e', fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier, position: 5, isVisible: true, size: 220 },
  ],
  groups: [
    { universalIdentifier: '9281a35b-5c0c-4d81-a63a-4cb35b8e2db6', fieldValue: DECISION_ROLE.DECISION_MAKER, position: 0, isVisible: true },
    { universalIdentifier: 'e4efda71-bd16-41df-95f6-392d150346e8', fieldValue: DECISION_ROLE.BUDGET_HOLDER, position: 1, isVisible: true },
    { universalIdentifier: 'd53ff699-1fa0-4e85-b7eb-e7556347abc7', fieldValue: DECISION_ROLE.TECHNICAL_EVALUATOR, position: 2, isVisible: true },
    { universalIdentifier: 'eeefdc4f-2b39-441c-8906-96c20b403826', fieldValue: DECISION_ROLE.INFLUENCER, position: 3, isVisible: true },
    { universalIdentifier: 'a6c57a0a-1c9a-4034-8eef-f00b0db82817', fieldValue: DECISION_ROLE.END_USER, position: 4, isVisible: true },
    { universalIdentifier: 'b6cf2ff9-8b8d-454d-9fad-e336d22a62f4', fieldValue: DECISION_ROLE.GATEKEEPER, position: 5, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '361130ce-7fb4-4cb2-9de5-97e81d55d13c',
      fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
});
