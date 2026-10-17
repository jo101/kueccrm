import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-campaign-target.field';
import { COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-campaign-target.field';
import {
  CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_STATUS,
  CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/campaign-target.object';

export const CAMPAIGN_TARGETS_TO_WORK_VIEW_UNIVERSAL_IDENTIFIER = 'f751da6f-add4-46d0-a9ae-3c38e28c1f46';

// The Campaign targets entry. A target has no owner of its own: the campaign
// owner works the list, so Campaign stands in as the second column. Least
// recently touched first.
export default defineView({
  universalIdentifier: CAMPAIGN_TARGETS_TO_WORK_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'To work',
  objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCrosshair',
  position: 0,
  fields: [
    { universalIdentifier: '88cd3155-4fff-4b1b-a24c-3cfd4c05ae67', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'c630a65a-fbd8-4e71-a019-b286b243e764', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 220 },
    { universalIdentifier: 'e9a5bd3c-dd94-4ddc-85dc-c2e70d3a3f0c', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '12664bf4-1a5b-492d-87a3-aaa870033445', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '747d9b76-a82f-462a-9042-3f91e138c111', fieldMetadataUniversalIdentifier: COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 200 },
  ],
  filters: [
    {
      universalIdentifier: 'e11ac325-8e7a-44e6-9cee-3b74e920596a',
      fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CAMPAIGN_TARGET_STATUS.TO_CONTACT, CAMPAIGN_TARGET_STATUS.CONTACTED, CAMPAIGN_TARGET_STATUS.RESPONDED],
    },
  ],
  sorts: [
    {
      universalIdentifier: '7b78c770-4e0a-484f-aef1-ae273f414331',
      fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
