import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  ACCOUNT_TIER,
  ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/account-tier-on-company.field';
import { IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-offset-obligor-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';

export const COMPANIES_BY_TIER_VIEW_UNIVERSAL_IDENTIFIER = '9ae7f80c-7683-4ff5-87ee-cd283976c6d7';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: COMPANIES_BY_TIER_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By tier',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconStairs',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '26f8e201-af91-4662-bc94-597805073759', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '8f8c35d4-6532-4029-a439-f68718f771a3', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'c7a9f004-bf16-48c6-8a4c-7e458a7d5566', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '563b2656-e53d-4428-94f9-632fb01092ae', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '0900ff88-363a-46c5-bd07-f175e48e2428', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'db09a476-b632-4b80-9f3a-002ed2c69e32', fieldMetadataUniversalIdentifier: IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
  ],
  groups: [
    { universalIdentifier: 'bd444f08-3c6f-4487-a74d-c09ebab2d584', fieldValue: ACCOUNT_TIER.TIER_1, position: 0, isVisible: true },
    { universalIdentifier: 'c092e559-f6fe-423e-a17b-a5a9d3c21191', fieldValue: ACCOUNT_TIER.TIER_2, position: 1, isVisible: true },
    { universalIdentifier: '3c275bc4-415b-4895-ada6-a2bd11d45e58', fieldValue: ACCOUNT_TIER.TIER_3, position: 2, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '377ee251-0bbc-4450-8dde-b16a9b4e5468',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
