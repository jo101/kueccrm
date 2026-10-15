import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import {
  COMPANY_SECTOR,
  SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/sector-on-company.field';

export const COMPANIES_BY_SECTOR_VIEW_UNIVERSAL_IDENTIFIER = '2493e433-bcdb-4332-bc0a-52aaf887417d';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: COMPANIES_BY_SECTOR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By sector',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconBuildingFactory2',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '1fd1ac96-153e-41b3-901f-7fab5d2fa439', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'b7bb1701-1ee8-4c78-94b8-f2dfec600b43', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'af1b5ec8-e884-446a-9d89-e915c8ff2457', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'daace0b7-67d7-4a59-8fee-ee78bd3e3c54', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '0c3b9504-fb04-408f-a87f-11578b2d65c2', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '9ab632f0-5454-460d-8133-9f2fbf6eb9f2', fieldMetadataUniversalIdentifier: companyFields.domainName.universalIdentifier, position: 5, isVisible: true, size: 220 },
  ],
  groups: [
    { universalIdentifier: '25e01862-60da-4c6a-9947-7cd0ac756608', fieldValue: COMPANY_SECTOR.OIL_AND_GAS, position: 0, isVisible: true },
    { universalIdentifier: '97212f74-3899-419b-91c3-13902443856a', fieldValue: COMPANY_SECTOR.ENERGY_AND_UTILITIES, position: 1, isVisible: true },
    { universalIdentifier: 'f8cbe856-1333-4e04-809e-d04e20385099', fieldValue: COMPANY_SECTOR.DEFENCE_AND_SECURITY, position: 2, isVisible: true },
    { universalIdentifier: 'd444a327-e9f1-448a-92bf-0d46a8545118', fieldValue: COMPANY_SECTOR.AEROSPACE, position: 3, isVisible: true },
    { universalIdentifier: 'ee33e7a5-5570-41cd-989b-4b9079c58b75', fieldValue: COMPANY_SECTOR.HEALTHCARE, position: 4, isVisible: true },
    { universalIdentifier: '1333a167-f62d-4e46-882f-e8fc95252bb0', fieldValue: COMPANY_SECTOR.ICT, position: 5, isVisible: true },
    { universalIdentifier: 'a68a1d54-bdfd-4f44-a955-d87e04a5c3bd', fieldValue: COMPANY_SECTOR.MANUFACTURING, position: 6, isVisible: true },
    { universalIdentifier: 'f127b506-4f74-4b20-99dd-f57c9d7668c1', fieldValue: COMPANY_SECTOR.TRANSPORT_AND_LOGISTICS, position: 7, isVisible: true },
    { universalIdentifier: 'b98018d6-43d6-49e1-bd09-6d9d3af18637', fieldValue: COMPANY_SECTOR.GOVERNMENT, position: 8, isVisible: true },
    { universalIdentifier: '682151d1-7c86-4c5c-916a-f88231c951f1', fieldValue: COMPANY_SECTOR.OTHER, position: 9, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '32e469f8-0dcb-4861-92e2-0f31376a4ea7',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
