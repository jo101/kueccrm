import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/converted-opportunity-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const BD_ALL_LEADS_VIEW_UNIVERSAL_IDENTIFIER = 'b007c088-c133-48cf-ac27-fcca9336c18d';

// No filter: the conversion rate is Converted as a share of every lead.
export default defineView({
  universalIdentifier: BD_ALL_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: All leads',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'cb741e40-985d-49c2-9734-4ecdd003a672', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'ef3bc08b-6c28-4d48-b10c-b3d9dde053ae', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '5d0db493-2e06-4f47-bedd-50dd742c185f', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '687d7713-2df7-40ac-9d33-f76e7ecb1b40', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '966e4720-6b9a-4d3d-9ba9-d5d527b87ce9', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '9cb0d496-3ad2-4228-8dbd-d58f0eebf10b', fieldMetadataUniversalIdentifier: CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  sorts: [
    {
      universalIdentifier: 'f88a3a6b-6619-4cb2-adce-9d0f794407a0',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
