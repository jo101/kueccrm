import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-lead.field';
import { COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-lead.field';
import { CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/converted-opportunity-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import { PERSON_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/person-on-lead.field';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/referred-by-member-on-lead.field';
import { REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/referred-by-on-lead.field';
import {
  LEAD_CAPABILITY_MATCHED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_DECISION_MAKER_REACHED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ESTIMATED_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_FUNDING_PATH_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_LAST_ENGAGEMENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEED_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_REFERRAL_NOTE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_TIMING_KNOWN_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '3fa6f34e-e4eb-4804-be9f-534b848ec544';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: LEADS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: 'e76fc1fe-991c-412b-b494-4084ec6ad5ad', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '82f9a811-c383-4016-9b43-53d8cf2762d0', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'd9d7b7ec-ea2d-4667-b716-6a86fa4efa64', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'ef6e1a78-d039-4c8b-ba88-35fd6c225041', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '7935e4eb-d756-4c91-89e6-3c414bf1583f', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'bd93f80f-c5de-4e9e-ae0e-62ff12dc1a64', fieldMetadataUniversalIdentifier: COMPANY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: '64d503ba-3e0a-40ff-bb85-ac96044caba8', fieldMetadataUniversalIdentifier: PERSON_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 170 },
    { universalIdentifier: '5f2f0ff1-645e-40d5-9a57-b3889cc00dc4', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 170 },
    { universalIdentifier: '50d38919-1f75-49c4-92a0-3409607ccf9f', fieldMetadataUniversalIdentifier: LEAD_NEED_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 240 },
    { universalIdentifier: '71143bdc-e435-4dd8-ad0e-3e3167548ee9', fieldMetadataUniversalIdentifier: LEAD_OFFERING_INTEREST_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 200 },
    { universalIdentifier: 'be584380-490f-49fc-8088-dfb1d194c423', fieldMetadataUniversalIdentifier: LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 140 },
    { universalIdentifier: '8c8cecf0-02f6-4f4c-8eb1-c6299ee4ada7', fieldMetadataUniversalIdentifier: LEAD_QUALIFICATION_SCORE_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 120 },
    { universalIdentifier: '8dda3a6c-96b4-4fd6-a320-c5f5a65664ef', fieldMetadataUniversalIdentifier: LEAD_NEED_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 120 },
    { universalIdentifier: '1ca664d3-034c-4035-a78a-78fc27b26412', fieldMetadataUniversalIdentifier: LEAD_DECISION_MAKER_REACHED_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 120 },
    { universalIdentifier: 'dd6fd9de-36d3-47de-b843-dfe41ba5a42b', fieldMetadataUniversalIdentifier: LEAD_CAPABILITY_MATCHED_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 120 },
    { universalIdentifier: 'ffa0653d-1f28-41e0-9108-eeee3cd01f37', fieldMetadataUniversalIdentifier: LEAD_FUNDING_PATH_IDENTIFIED_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 120 },
    { universalIdentifier: 'a9e9466f-1cc8-4ddb-b5cf-363322075772', fieldMetadataUniversalIdentifier: LEAD_TIMING_KNOWN_FIELD_UNIVERSAL_IDENTIFIER, position: 16, isVisible: true, size: 120 },
    { universalIdentifier: '46485070-fd66-41d4-9a12-e2addcc92f72', fieldMetadataUniversalIdentifier: LEAD_ESTIMATED_VALUE_FIELD_UNIVERSAL_IDENTIFIER, position: 17, isVisible: true, size: 140 },
    { universalIdentifier: 'a982ec37-79f0-49ae-91f5-d9e9899ae21a', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_FIELD_UNIVERSAL_IDENTIFIER, position: 18, isVisible: true, size: 220 },
    { universalIdentifier: '494341a1-c14d-4889-91fc-a72eb6693a12', fieldMetadataUniversalIdentifier: LEAD_NEXT_ACTION_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 19, isVisible: true, size: 140 },
    { universalIdentifier: 'ce19d3ea-35a1-4265-940f-a52725704169', fieldMetadataUniversalIdentifier: LEAD_DEAD_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 20, isVisible: true, size: 140 },
    { universalIdentifier: '5806f98f-55bb-4656-aafe-2f2e508fda57', fieldMetadataUniversalIdentifier: LEAD_NURTURE_REVIEW_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 21, isVisible: true, size: 140 },
    { universalIdentifier: 'd37b9ed6-750e-4780-8e07-dce2017569db', fieldMetadataUniversalIdentifier: REFERRED_BY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 22, isVisible: true, size: 170 },
    { universalIdentifier: '1a46b7f6-db8a-41aa-980d-5e0e0717539c', fieldMetadataUniversalIdentifier: REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 23, isVisible: true, size: 170 },
    { universalIdentifier: '697806f6-3407-45e4-bf1a-d4f141446e96', fieldMetadataUniversalIdentifier: LEAD_REFERRAL_NOTE_FIELD_UNIVERSAL_IDENTIFIER, position: 24, isVisible: true, size: 220 },
    { universalIdentifier: '3fc49f4b-f79b-4b04-afab-e10467a7025c', fieldMetadataUniversalIdentifier: CONVERTED_OPPORTUNITY_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 25, isVisible: true, size: 170 },
    { universalIdentifier: '55ec8edb-9d3a-4f56-9719-831731c5d156', fieldMetadataUniversalIdentifier: LEAD_LAST_ENGAGEMENT_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 26, isVisible: true, size: 150 },
    { universalIdentifier: '6221bf0e-e2d7-48dc-97aa-9461892bbd04', fieldMetadataUniversalIdentifier: LEAD_REFERRAL_CREDITED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 27, isVisible: true, size: 150 },
    { universalIdentifier: 'b43b7ce3-74cf-45ca-9383-729fb65ad0f8', fieldMetadataUniversalIdentifier: LEAD_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER, position: 28, isVisible: true, size: 150 },
    { universalIdentifier: '13545413-cfed-4af1-972f-92bb7d1306e2', fieldMetadataUniversalIdentifier: LEAD_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER, position: 29, isVisible: true, size: 170 },
    { universalIdentifier: '619c40c5-2545-4b4d-b07d-dfed252a9568', fieldMetadataUniversalIdentifier: LEAD_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 30, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: '68ab9246-ecb6-4303-9b5d-be51e36aafc9',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
