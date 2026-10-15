import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER = 'c1b8df3b-adbc-4f77-9a29-0d425d33049b';

export const DECISION_ROLE = {
  DECISION_MAKER: 'DECISION_MAKER',
  BUDGET_HOLDER: 'BUDGET_HOLDER',
  TECHNICAL_EVALUATOR: 'TECHNICAL_EVALUATOR',
  INFLUENCER: 'INFLUENCER',
  END_USER: 'END_USER',
  GATEKEEPER: 'GATEKEEPER',
} as const;

export default defineField({
  universalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'decisionRole',
  label: 'Decision role',
  icon: 'IconHierarchy2',
  options: [
    {
      id: '2e52877a-da82-4f68-b724-07f99840a438',
      value: DECISION_ROLE.DECISION_MAKER,
      label: 'Decision maker',
      position: 0,
      color: 'red',
    },
    {
      id: 'e45d04b7-bbde-4366-bf7b-0766148fa331',
      value: DECISION_ROLE.BUDGET_HOLDER,
      label: 'Budget holder',
      position: 1,
      color: 'orange',
    },
    {
      id: 'fdb5ae81-8726-48a7-9869-8886acf0c04e',
      value: DECISION_ROLE.TECHNICAL_EVALUATOR,
      label: 'Technical evaluator',
      position: 2,
      color: 'blue',
    },
    {
      id: 'f48ef6cd-1788-4077-8224-bdb9b055d14d',
      value: DECISION_ROLE.INFLUENCER,
      label: 'Influencer',
      position: 3,
      color: 'purple',
    },
    {
      id: 'f2e2274f-5250-4aea-8819-850978154725',
      value: DECISION_ROLE.END_USER,
      label: 'End user',
      position: 4,
      color: 'green',
    },
    {
      id: '00b8690f-6728-45a9-b1ba-2820152af85d',
      value: DECISION_ROLE.GATEKEEPER,
      label: 'Gatekeeper',
      position: 5,
      color: 'gray',
    },
  ],
});
