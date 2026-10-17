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

export const PEOPLE_ADDED_IN_THE_LAST_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER = 'c84f99b0-0c14-454e-9c96-7059b5001542';
const PEOPLE_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'ca5fecf6-c85d-48dc-8325-938ca82f9704';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

// The weekly duplicate sweep checks only what is new: each row here is
// searched against the older people (runbooks/14-hygiene.md section 4).
export default defineView({
  universalIdentifier: PEOPLE_ADDED_IN_THE_LAST_7_DAYS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Added in the last 7 days',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCopy',
  position: 18,
  fields: [
    { universalIdentifier: 'b4f9c0bd-272d-4b09-8c91-3404dd8b5810', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd0fba42b-f984-4982-9cde-fbf6123489d4', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '8641019c-c98a-44b5-9007-64f4f0b57c96', fieldMetadataUniversalIdentifier: personFields.createdAt.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'fe164214-df8d-45b2-92e1-25d9d1486e40', fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier, position: 3, isVisible: true, size: 220 },
    { universalIdentifier: '10aab9b4-4acb-4f35-a7b0-5c6fb5659b0d', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: 'db27217d-1306-4fc3-baff-249409afe744', fieldMetadataUniversalIdentifier: personFields.createdBy.universalIdentifier, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '3bf5f24f-05f1-491f-9a13-9092a00413bb',
      fieldMetadataUniversalIdentifier: personFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: PAST_7_DAYS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: PEOPLE_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '30392b68-ffad-4fb4-ae0e-d27f5dd37951',
      fieldMetadataUniversalIdentifier: personFields.createdAt.universalIdentifier,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: TODAY_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: PEOPLE_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: PEOPLE_ADDED_IN_THE_LAST_7_DAYS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: 'f7ae2f7a-4d94-4481-876a-265dcb5226a4',
      fieldMetadataUniversalIdentifier: personFields.createdAt.universalIdentifier,
      direction: ViewSortDirection.DESC,
    },
  ],
});
