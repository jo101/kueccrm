import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  PAST_11_MONTHS_FILTER_VALUE,
  THIS_MONTH_FILTER_VALUE,
} from '../../constants/view-filter-values';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/campaign-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import {
  LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const BD_LEADS_CREATED_PAST_12_MONTHS_VIEW_UNIVERSAL_IDENTIFIER = '2c706918-0948-4173-a923-db2547df42d2';
const BD_LEADS_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'e74772b3-2041-427a-9328-23d97ca7f4b2';

export default defineView({
  universalIdentifier: BD_LEADS_CREATED_PAST_12_MONTHS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Leads created, past 12 months',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '9f87371c-4cf2-43dd-b21d-a12f958266fb', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '1c7f431b-d0d8-41d0-8792-57a0444b1f72', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9ad69696-c9ba-4901-82ae-331ecc59a40f', fieldMetadataUniversalIdentifier: LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '6077cbad-e505-4243-90b8-66f795ef01f7', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '8dd24e29-5bee-4fa4-9179-6cd5d6f4fe8b', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'da40dd82-0c85-4a43-941b-1af9001ace75', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'a72edbd8-af7a-403e-bad1-2f00951373fa',
      fieldMetadataUniversalIdentifier: LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: PAST_11_MONTHS_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_LEADS_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: 'df7746f6-b1b3-4784-955c-064b9a5348ad',
      fieldMetadataUniversalIdentifier: LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: THIS_MONTH_FILTER_VALUE,
      viewFilterGroupUniversalIdentifier: BD_LEADS_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
  ],
  filterGroups: [
    { universalIdentifier: BD_LEADS_CREATED_PAST_12_MONTHS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
  sorts: [
    {
      universalIdentifier: '6f224e8a-e171-4d84-acaf-626c0453b088',
      fieldMetadataUniversalIdentifier: LEAD_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
