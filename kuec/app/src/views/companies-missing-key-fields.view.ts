import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';
import { SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/size-class-on-company.field';

export const COMPANIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER = '6b1c9985-ae7b-4507-952e-de865a9b33dc';
const COMPANIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER = '71c7e0d3-ac89-4774-bd4a-ef83b7cdd0b9';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

// Most recently engaged first: the companies the team is working with now get
// fixed before the long tail from the day-one import.
export default defineView({
  universalIdentifier: COMPANIES_MISSING_KEY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: missing key fields',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 15,
  fields: [
    { universalIdentifier: '2da35c2a-283a-4339-9078-9a8019507f0e', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '2190576d-7729-4278-b28e-e3324c11f590', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'e333646b-b1fc-470a-93b4-c8ab228b4396', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '5d54de07-33a7-4e43-819c-b3f853a59af8', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 160 },
    { universalIdentifier: '58d31b4f-676a-4d7c-9119-991e9129b3aa', fieldMetadataUniversalIdentifier: SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 160 },
    { universalIdentifier: '8d040ca6-a013-4c8b-9c5b-6937fdfda87a', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: '56ea0f74-22f6-4a4b-9901-445c48376e63',
      fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: COMPANIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '8725252d-7240-4371-b4c5-b206a25ed44b',
      fieldMetadataUniversalIdentifier: SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: COMPANIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: 'e5235a37-9659-4ecd-9722-f3bcd2aaaf5f',
      fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: COMPANIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
  ],
  filterGroups: [
    { universalIdentifier: COMPANIES_MISSING_KEY_FIELDS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'b7400d04-6dd4-45d7-810c-8c3ee992dd9f',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
