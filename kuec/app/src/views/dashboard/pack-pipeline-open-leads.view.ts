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

export const PACK_PIPELINE_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER = '00e6c868-d066-4caa-83a7-82e5a65b4cd4';

export default defineView({
  universalIdentifier: PACK_PIPELINE_OPEN_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: open leads',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '39fd8e85-bb99-4756-b8d3-8e345b26ba44', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'ac78c409-50f9-4997-bb31-f5e87da700ed', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '6bafe8f1-b4d7-43fd-8ca4-e5356f44ec30', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'ce2d5b8b-4093-4749-975d-8437e010ee1c', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'f29bc121-ccbd-4f93-963e-7ae4c22d537b', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '1f798a94-5048-4851-9bff-5427b09da8b8', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'ad240ff6-19d2-496d-a16a-aaa429e7ac96',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT,
      value: [LEAD_STATUS.DEAD, LEAD_STATUS.CONVERTED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '2ae38935-2b71-4e3a-8448-70fa299e9a95',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
