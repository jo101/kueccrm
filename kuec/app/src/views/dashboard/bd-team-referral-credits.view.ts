import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/converted-opportunity-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-lead.field';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/referred-by-member-on-lead.field';
import { REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/referred-by-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../../objects/lead.object';

export const BD_TEAM_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER = 'f2d12631-7226-46c6-8b9c-77e9c0be6bac';

// L6 stamps Referral credited at when an opportunity from the lead is Signed;
// the credit is the colleague's (runbooks/19-leads.md section 5).
export default defineView({
  universalIdentifier: BD_TEAM_REFERRAL_CREDITS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD Team: Referral credits',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '17b26ceb-6d52-4196-928f-f185b2fc9cf5', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '77fd961d-5014-4875-9112-03b2860152dd', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '088f7ba1-a870-42cf-ac97-35b836e9f383', fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '1cc5d898-bc93-42ad-b54c-40ede8f8a19c', fieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '5a8d2888-8306-47de-9310-aca57d56abe0', fieldMetadataUniversalIdentifier: REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'a981dbbc-f28a-48a4-80db-4a10e82393e7', fieldMetadataUniversalIdentifier: CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: 'd640d55c-06e8-4d35-9594-b85bc8d912e2',
      fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '973dec34-375e-4fbe-936e-2aba9992fabd',
      fieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'f2183e92-7dbe-48b5-832d-d54c3ddbe0f4',
      fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
