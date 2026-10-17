import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  PAST_7_DAYS_FILTER_VALUE,
  TODAY_FILTER_VALUE,
} from '../constants/view-filter-values';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';

export const COMPANIES_ADDED_IN_THE_LAST_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER = '4ad57322-b6a2-4c67-bc8f-937c95bfe9dd';
const COMPANIES_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = '67168684-9bb2-49bc-800f-4899179b7464';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

// The weekly duplicate sweep checks only what is new: each row here is
// searched against the older companies (runbooks/14-hygiene.md section 4).
export default defineView({
  universalIdentifier: COMPANIES_ADDED_IN_THE_LAST_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Added in the last 7 days',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCopy',
  position: 18,
  fields: [
    { universalIdentifier: 'ccb4e2a0-5d11-4073-a9a5-f96938ed2fad', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '46633b8f-0033-431d-af82-6c7430254797', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '3b983182-d4f1-4626-8d66-c15cfba491d1', fieldMetadataUniversalIdentifier: companyFields.createdAt.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'b46e820f-0414-46b3-ab34-80d29ff90910', fieldMetadataUniversalIdentifier: companyFields.domainName.universalIdentifier, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: 'b51bcf8e-f198-41c1-9efc-b0cf99b0c82d', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 160 },
    { universalIdentifier: 'c6185ea7-fba7-4060-b860-44665d8ece0b', fieldMetadataUniversalIdentifier: companyFields.createdBy.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '65a45bce-b136-443d-a6d9-aaac0f04da43',
      fieldMetadataUniversalIdentifier: companyFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: PAST_7_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: COMPANIES_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '8cc39984-eee7-42f9-a886-058039412054',
      fieldMetadataUniversalIdentifier: companyFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: COMPANIES_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: COMPANIES_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'd977ba6a-cd8b-49f9-a166-35d260085885',
      fieldMetadataUniversalIdentifier: companyFields.createdAt.universalIdentifier,
      direction: ViewSortDirection.DESC,
    },
  ],
});
