import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/other-details-on-company.field';
import {
  COMPANY_RELATIONSHIP_TYPE,
  RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/relationship-type-on-company.field';
import {
  COMPANY_SECTOR,
  SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/sector-on-company.field';

export const COMPANIES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = 'b3e86591-4753-47b3-81c7-871d3c918ab7';
const COMPANIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = '220f83ae-5724-4a18-a9a7-e141dad4a1c3';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

// Sector or Relationship type set to Other with Other details empty.
export default defineView({
  universalIdentifier: COMPANIES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: '0d3b36db-a27e-425d-99ea-c38d5029f9dd', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '0c93f320-7661-4a89-b46a-8506bddd4253', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '98bc3140-acde-488b-aa5c-cdbfb9311aae', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '60adba2e-0e7d-41a6-9daf-a73ed204fe8d', fieldMetadataUniversalIdentifier: RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'eba82f08-933f-4cf4-a2c8-ad53d03fbc4c', fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '2fbb5eaf-2e6e-4c82-9efa-6653d8a4dac0',
      fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '31289fd4-6054-4302-8e1d-54ccc32c8885',
      fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [COMPANY_SECTOR.OTHER],
      viewFilterGroupUniversalIdentifier: COMPANIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '6e9fd21a-4827-4420-b103-508db36d5a0d',
      fieldMetadataUniversalIdentifier: RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [COMPANY_RELATIONSHIP_TYPE.OTHER],
      viewFilterGroupUniversalIdentifier: COMPANIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: COMPANIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
