import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  ACCOUNT_TIER,
  ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../fields/account-tier-on-company.field';
import { ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/engagement-lapses-at-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/sector-on-company.field';

export const BD_KEY_ACCOUNTS_NOT_ENGAGED_VIEW_UNIVERSAL_IDENTIFIER = 'a53376b2-86bc-4850-bdc3-3eea502ddbc8';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: BD_KEY_ACCOUNTS_NOT_ENGAGED_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Key accounts not engaged in 60 days',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '67f8c304-a031-4eeb-95b4-6d20b387498c', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '9cf78b72-1ca2-4bdf-b4d5-5c3901b9ea91', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'c3fdcc5e-424d-404e-a1b8-1d986e35fcbe', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'cc5b1224-2f31-479b-b25f-8fbdec1dc2f1', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '7d7ce903-eeb8-47de-861a-98578267bfcf', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'cb519788-c413-4c15-9837-fb97a37a6d52',
      fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [ACCOUNT_TIER.TIER_1, ACCOUNT_TIER.TIER_2],
    },
    {
      universalIdentifier: '0955754d-5e8e-4b1f-8f3f-e3683532d950',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'f77be9be-ec0a-4c64-9e16-79c3df59552a',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
