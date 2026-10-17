import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import { CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/contracts-on-company.field';
import { ENGAGEMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/engagements-on-company.field';
import { IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-offset-obligor-on-company.field';
import { KEYWORDS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/keywords-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import { NAME_ARABIC_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/name-arabic-on-company.field';
import { PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/projects-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';

export const COMPANIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '342fbf6c-41df-4e98-8346-2589c4560fb1';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: COMPANIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '9e7fc0dd-c235-4f12-9beb-ad9dfa39a0f2', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3973281a-6635-477e-9839-37d45a04163a', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'f974244e-2194-433d-9f4b-a3f22d034edd', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '1ff0e678-a2c1-465e-a24b-e180ab8db662', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8dcd5542-ba94-4564-a349-477e5d3f6c56', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '1220869f-7823-4f32-b860-d80df9d84b59', fieldMetadataUniversalIdentifier: IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '314e3a6e-2d0d-4b8a-9496-1f2cfaf907db', fieldMetadataUniversalIdentifier: companyFields.domainName.universalIdentifier, position: 6, isVisible: true, size: 220 },
    { universalIdentifier: '2dfb3420-0c7f-44b8-99c6-96e48bc00014', fieldMetadataUniversalIdentifier: companyFields.address.universalIdentifier, position: 7, isVisible: true, size: 220 },
    { universalIdentifier: '3cf242fa-143d-476e-88fd-0c5c87e86dd3', fieldMetadataUniversalIdentifier: companyFields.linkedinLink.universalIdentifier, position: 8, isVisible: true, size: 220 },
    { universalIdentifier: '8607b996-7189-4ae9-b1f1-1f529edad6d7', fieldMetadataUniversalIdentifier: companyFields.annualRevenue.universalIdentifier, position: 9, isVisible: true, size: 130 },
    { universalIdentifier: '2ba38ccc-7f48-4a75-b75e-a7f9d603fb42', fieldMetadataUniversalIdentifier: companyFields.people.universalIdentifier, position: 10, isVisible: true, size: 170 },
    { universalIdentifier: '06795a84-7277-4e49-9f65-5a2c5178ce1c', fieldMetadataUniversalIdentifier: companyFields.opportunities.universalIdentifier, position: 11, isVisible: true, size: 170 },
    { universalIdentifier: '3d4c6d74-532c-4f15-af95-5339acc6dd5e', fieldMetadataUniversalIdentifier: ENGAGEMENTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 170 },
    { universalIdentifier: '92f3d6c1-007b-4467-b6fb-52de09b9cfcb', fieldMetadataUniversalIdentifier: CONTRACTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 170 },
    { universalIdentifier: 'a98015fa-7765-4f1f-9de0-d09b6d133f8a', fieldMetadataUniversalIdentifier: NAME_ARABIC_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 220 },
    { universalIdentifier: '53bd05bb-a985-4d50-9461-c74a0425ad37', fieldMetadataUniversalIdentifier: KEYWORDS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 220 },
    { universalIdentifier: '49c8f620-d3ca-4f30-95d2-cafc590165e9', fieldMetadataUniversalIdentifier: PROJECTS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 16, isVisible: true, size: 170 },
  ],
  sorts: [
    {
      universalIdentifier: '95046a31-b004-4024-8d29-9c829fc084bf',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
