import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/decision-role-on-person.field';
import { IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-champion-on-person.field';

export const CHAMPIONS_VIEW_UNIVERSAL_IDENTIFIER = '046e3efe-f97f-4c08-81af-a21a91e14b26';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

export default defineView({
  universalIdentifier: CHAMPIONS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Champions',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconStar',
  position: 1,
  fields: [
    { universalIdentifier: 'c62a585e-bd80-4b3e-aa5f-7600561a9f3d', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '6b216904-8ad4-4a5d-9328-c89dca1553c1', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '97f044a5-c30c-4b7f-b184-60508d746d75', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 2, isVisible: true, size: 220 },
    { universalIdentifier: '3faf6898-2f95-410f-977b-f1dd9bd6cde4', fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'a9690537-77e9-46a9-b642-b281e06879cd', fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '038e4924-6360-497a-b490-85bb958f8082', fieldMetadataUniversalIdentifier: personFields.phones.universalIdentifier, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '92b0e889-08e1-4d2f-bd6e-b8565fa2bd2b',
      fieldMetadataUniversalIdentifier: IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: 'true',
    },
  ],
});
