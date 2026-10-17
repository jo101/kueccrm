import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/referred-by-member-on-lead.field';
import { REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/referred-by-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const PACK_PIPELINE_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER = 'b2462129-9c2b-4921-90fc-fe75afbf2563';

export default defineView({
  universalIdentifier: PACK_PIPELINE_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: referral credits',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '81ed05a5-6d8b-4063-8284-0bc54729c548', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '94719808-9fd6-43b3-8a97-31e5c87c1a16', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '840bd860-b22a-408a-871f-4f1aff1d7ad5', fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '560cfddd-4dff-4c5a-a507-9aab9576312d', fieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '5b0e679f-5128-4546-9589-0693b379b609', fieldMetadataUniversalIdentifier: REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '6c3b4e18-6272-4229-bc89-7c26f918004c', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'a3f91e02-61d0-4170-a711-9a557f369f64',
      fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '314b4e58-d67d-49a8-bef6-dca03aed0506',
      fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
