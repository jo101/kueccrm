import {
  defineView,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-campaign-target.field';
import { COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-campaign-target.field';
import {
  CAMPAIGN_TARGET_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_CREATED_BY_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/campaign-target.object';

export const CAMPAIGN_TARGETS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '729f1d25-5014-46f0-ab78-728b49e91cf5';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: CAMPAIGN_TARGETS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: 'a0b6c126-c252-4adf-bede-c90396f699e2', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '44c347fe-5296-4efa-a1e2-3f3ff6333e82', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 220 },
    { universalIdentifier: 'ffc12b2c-8a0c-4679-84b2-e6564527f91f', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '8a93297f-ac24-4e1c-a96f-6fcd1a834cc4', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '89fedc65-2acb-4d6f-8b4f-f78a9e5f119f', fieldMetadataUniversalIdentifier: COMPANY_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: '114a800a-1086-42fa-9c5b-cb9692f0fee8', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
    { universalIdentifier: 'ef879946-6575-4384-8645-4e6c09748d2e', fieldMetadataUniversalIdentifier: CAMPAIGN_TARGET_CREATED_BY_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 160 },
  ],
});
