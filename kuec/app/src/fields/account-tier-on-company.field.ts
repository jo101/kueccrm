import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER = '0b25b187-8759-4b96-9860-6aabc395dc61';

export const ACCOUNT_TIER = {
  TIER_1: 'TIER_1',
  TIER_2: 'TIER_2',
  TIER_3: 'TIER_3',
} as const;

export default defineField({
  universalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'accountTier',
  label: 'Account tier',
  icon: 'IconStairs',
  options: [
    {
      id: '69dcbf50-dddc-4b16-990b-ac3126d69443',
      value: ACCOUNT_TIER.TIER_1,
      label: 'Tier 1 (strategic)',
      position: 0,
      color: 'green',
    },
    {
      id: '772bf9d7-a442-4af9-97a2-babbf5bfc40b',
      value: ACCOUNT_TIER.TIER_2,
      label: 'Tier 2 (active)',
      position: 1,
      color: 'blue',
    },
    {
      id: '1661b460-d2ba-44af-b4ac-4e5e4b8a9a50',
      value: ACCOUNT_TIER.TIER_3,
      label: 'Tier 3 (watch)',
      position: 2,
      color: 'gray',
    },
  ],
});
