import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const BD_TEAM_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER = 'c02b5463-4ad3-449e-af5e-8ef334c2c681';

export default defineView({
  universalIdentifier: BD_TEAM_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD Team: Open leads',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '5a59fb90-fde5-4443-9bf8-e37875cd163b', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f8496882-4ed9-47f8-aa86-a18dcecfe968', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'b7cd9271-514f-4581-a729-6a0446f2a369', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '3c48ee97-874d-41cb-84ce-50abd28a0bf4', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '0cffd0dc-8648-4394-ab0c-cf74fe734477', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '172b5c7c-989c-46ae-b422-5ef15aa24bc2', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'e6ab94e8-3742-42cf-9507-b76ccc2ec9d9',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: [LEAD_STATUS.DEAD, LEAD_STATUS.CONVERTED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '317dedf3-b2fc-4b48-833b-359c5e4e5543',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
