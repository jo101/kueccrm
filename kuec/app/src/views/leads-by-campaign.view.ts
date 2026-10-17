import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-lead.field';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_BY_CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER = 'ad2adf6d-de1b-4b9f-8819-d0d10ba6eaf6';

// Twenty 2.48 groups tables by a select only, so the campaign is a column to
// filter on here; each campaign or workshop project lists its own leads on its record page.
export default defineView({
  universalIdentifier: LEADS_BY_CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By campaign',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconSpeakerphone',
  position: 6,
  fields: [
    { universalIdentifier: 'c5d7dfcd-2a54-41fb-a485-649da5044679', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '2bd72f1e-874c-4243-8ca2-4b813f5c0d1f', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '6bf061ba-7ec2-4b5d-9874-9913a5c4af6e', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'b4a10184-fd77-476c-9bfb-dec8f5cd6d39', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 200 },
    { universalIdentifier: '66a0b67a-54ff-46ea-b79f-1cbf8bf20c97', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: 'd7f0ff79-698b-4e63-97b2-563984f7c384', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
    { universalIdentifier: 'c6a7e8b4-d8d4-4ef9-a288-7c402bbfb155', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: false, size: 170 },
  ],
  filters: [
    {
      universalIdentifier: '12dfb717-51de-43d8-b41f-f43494e199ef',
      fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '1591d7a1-3336-4b4c-8f12-2af46ca6be80',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
