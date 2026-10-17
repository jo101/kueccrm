import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '0134c688-ab9f-4b96-a567-244589473208';

export const OPPORTUNITY_PROBABILITY = {
  PCT_10: 'PCT_10',
  PCT_25: 'PCT_25',
  PCT_50: 'PCT_50',
  PCT_75: 'PCT_75',
  PCT_90: 'PCT_90',
} as const;

export default defineField({
  universalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'probability',
  label: 'Probability',
  description: fieldDescription('opportunity.probability'),
  icon: 'IconPercentage',
  options: [
    {
      id: '56dfe13f-88f9-4395-85ab-d39b4dab2ebe',
      value: OPPORTUNITY_PROBABILITY.PCT_10,
      label: '10%',
      position: 0,
      color: 'gray',
    },
    {
      id: '4317a37b-dc5a-487e-8c1c-5a39b36f1ced',
      value: OPPORTUNITY_PROBABILITY.PCT_25,
      label: '25%',
      position: 1,
      color: 'orange',
    },
    {
      id: 'f166ec02-61cc-4ee8-b520-7c9d56e86136',
      value: OPPORTUNITY_PROBABILITY.PCT_50,
      label: '50%',
      position: 2,
      color: 'yellow',
    },
    {
      id: '7d62d3c6-69fd-4873-a18f-44c7a60de29f',
      value: OPPORTUNITY_PROBABILITY.PCT_75,
      label: '75%',
      position: 3,
      color: 'turquoise',
    },
    {
      id: 'de150869-7797-4458-97b1-e48e13201740',
      value: OPPORTUNITY_PROBABILITY.PCT_90,
      label: '90%',
      position: 4,
      color: 'green',
    },
  ],
});
