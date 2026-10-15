import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';

export const LEAST_RECENTLY_ENGAGED_COMPANIES_VIEW_UNIVERSAL_IDENTIFIER = '094c06c1-a319-4d80-b615-65cb229ae041';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: LEAST_RECENTLY_ENGAGED_COMPANIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Least recently engaged',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconClockHour4',
  position: 3,
  fields: [
    { universalIdentifier: '9e9a2d86-a672-481c-81bf-6fa195b1efde', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e69579da-772b-40a7-b8e4-b1d88501c64e', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '71fa7230-0e17-438c-8ba3-226843604db2', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '76ffe36a-8c2d-4776-a930-46a052110d27', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8b59290a-5648-4647-8037-76468cf9ee29', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
  ],
  sorts: [
    {
      universalIdentifier: '0d647958-de38-4ca2-8c58-ac36aaa8356e',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
