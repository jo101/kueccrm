import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/decision-role-on-person.field';

export const PEOPLE_MISSING_EMAIL_VIEW_UNIVERSAL_IDENTIFIER = '3050f3f3-b245-4a2c-81a0-08a702a203b1';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

export default defineView({
  universalIdentifier: PEOPLE_MISSING_EMAIL_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Missing email',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconMailOff',
  position: 2,
  fields: [
    { universalIdentifier: '64b4a5c9-379f-4912-baad-eb7de45308de', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'de4f0db3-8d8f-498b-98b1-9f30f4ebea81', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'f88412e6-12fa-45b6-abfc-4b79ea9dd6e0', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 2, isVisible: true, size: 220 },
    { universalIdentifier: 'b43183c5-71f7-4b1d-8b7e-ee3681922d7e', fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '2af9c92b-402d-4161-90a0-fdbf13b1a151', fieldMetadataUniversalIdentifier: personFields.phones.universalIdentifier, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '1e32072c-7de6-4e67-a118-a1b97835be88', fieldMetadataUniversalIdentifier: personFields.linkedinLink.universalIdentifier, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: 'fe1ade73-2e2e-4a1e-accd-a8e77b254c7e',
      fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
  ],
});
