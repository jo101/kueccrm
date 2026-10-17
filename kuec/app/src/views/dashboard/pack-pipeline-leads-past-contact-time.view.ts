import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import {
  LEAD_CONTACT_NUDGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const PACK_PIPELINE_LEADS_PAST_CONTACT_TIME_VIEW_UNIVERSAL_IDENTIFIER = '1c6da374-b468-42d5-9aad-59bb0375082e';

// L2 nudged the owner after 3 business days and the lead is still New (CRM pack contact time).
export default defineView({
  universalIdentifier: PACK_PIPELINE_LEADS_PAST_CONTACT_TIME_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: leads past their contact time',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '90be123d-2443-415d-930d-f158b3b4acac', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'fe515b85-1474-4dba-a7e0-c2e0ff1aae06', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '72298490-bf25-4057-ac83-e595c17a62f8', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '70341d40-29b7-414c-ae3f-5f973266c227', fieldMetadataUniversalIdentifier: LEAD_CONTACT_NUDGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 160 },
    { universalIdentifier: 'd34cb4f7-a8b9-4479-992c-e4e4344b42a1', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '5ab3ac3d-67c7-4944-a875-0c07bdc47b57', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'e1be02db-e29b-4d96-b84e-cb6d1d0d6585',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [LEAD_STATUS.NEW],
    },
    {
      universalIdentifier: '73439ec5-7e38-4d4b-bbb5-415a83f6d1d9',
      fieldMetadataUniversalIdentifier: LEAD_CONTACT_NUDGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'cc4a1997-b39b-4958-8f32-99774e93d014',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
