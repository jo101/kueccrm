import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/campaign-on-campaign-target.field';
import { COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/company-on-campaign-target.field';
import {
  CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
} from '../../objects/campaign-target.object';

export const PACK_CAMPAIGNS_CAMPAIGN_TARGETS_VIEW_UNIVERSAL_IDENTIFIER = 'da4c68cb-b27f-46e3-8f3c-d796ea1ddc50';

export default defineView({
  universalIdentifier: PACK_CAMPAIGNS_CAMPAIGN_TARGETS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Campaign pack: campaign targets',
  objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '9d179431-fd8e-4446-8bcf-7d7e7a6d2b30', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '374163d7-812f-46ff-be2e-cad14f7af2cf', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 220 },
    { universalIdentifier: '54baa39e-68e4-4a80-9d63-f34472c45921', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '36875b41-c637-43ae-a9bc-a1b3b0441c2d', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'ada4d7f4-a787-4588-86a1-f9010846c944', fieldMetadataUniversalIdentifier: COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 200 },
  ],
  filters: [
    {
      universalIdentifier: '7ad6e98b-8128-4562-a64c-93bf13b3e8e8',
      fieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '97a567ba-79c8-49c4-b04f-c62dc85828b4',
      fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
