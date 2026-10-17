import {
  AggregateOperations,
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/campaign-on-lead.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-lead.field';
import { OPPORTUNITY_SOURCE } from '../fields/source-on-opportunity.field';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from '../objects/lead.object';

export const LEADS_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER = 'b24c4498-5ab1-48b6-989e-f142e4d9ac71';

// Every lead, Dead and Converted included: the point is where leads come from
// and how far each source gets. Deprecated sources are hidden (runbooks/18-taxonomy.md).
export default defineView({
  universalIdentifier: LEADS_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By source',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconArrowFork',
  position: 5,
  mainGroupByFieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'f60d4958-c86b-413d-b646-28db61e82be4', fieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'bb4cf7c1-97f7-44d0-9cdd-1f312d193980', fieldMetadataUniversalIdentifier: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '0146e2cc-4139-46f4-8698-3c755f62c767', fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: '9e3aa1c8-00c0-486e-ac11-c6e3583a971d', fieldMetadataUniversalIdentifier: LEAD_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '99093bcb-b3a1-47b3-a09b-2954d69cb9d9', fieldMetadataUniversalIdentifier: LEAD_SOURCE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '10b3fbde-3cb9-4577-a2ef-ba9cfb206742', fieldMetadataUniversalIdentifier: CAMPAIGN_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  groups: [
    { universalIdentifier: 'f01c0143-2332-42fd-8e9c-3fa99507d1d5', fieldValue: OPPORTUNITY_SOURCE.INBOUND, position: 0, isVisible: true },
    { universalIdentifier: 'a4f79afd-0e4c-47fe-9c06-3f162d7a69e1', fieldValue: OPPORTUNITY_SOURCE.EXISTING_CUSTOMER, position: 1, isVisible: true },
    { universalIdentifier: '4845211d-a39c-4f9b-9065-b81290e499a8', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_COLLEAGUE, position: 2, isVisible: true },
    { universalIdentifier: '9121e236-55b8-4683-a765-01c8f8acdfe9', fieldValue: OPPORTUNITY_SOURCE.FACULTY, position: 3, isVisible: true },
    { universalIdentifier: '4c6ebee9-ee48-48c5-8470-f626fd92204e', fieldValue: OPPORTUNITY_SOURCE.PARTNER, position: 4, isVisible: true },
    { universalIdentifier: '015eec05-9a03-4b73-abe3-e9a57ae7d4d9', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_KU_LEADERSHIP, position: 5, isVisible: true },
    { universalIdentifier: 'b6112dd2-0127-446e-a939-ce1c35798d41', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_CEO_OR_BOARD, position: 6, isVisible: true },
    { universalIdentifier: '082c77a9-da87-400b-b730-164d3913eaf2', fieldValue: OPPORTUNITY_SOURCE.WORKSHOP, position: 7, isVisible: true },
    { universalIdentifier: 'f4e361e6-e81d-4084-8221-b4741475e5f4', fieldValue: OPPORTUNITY_SOURCE.EXHIBITION, position: 8, isVisible: true },
    { universalIdentifier: 'f976bc47-c29c-4129-8839-a455bde8a5f7', fieldValue: OPPORTUNITY_SOURCE.GALA_QR, position: 9, isVisible: true },
    { universalIdentifier: 'bcc276c1-4408-442d-b3e7-5a96a5eace1e', fieldValue: OPPORTUNITY_SOURCE.CHALLENGE_SPRINT, position: 10, isVisible: true },
    { universalIdentifier: '1ffafc1c-2ff0-43ec-bed2-6362fb4f9f03', fieldValue: OPPORTUNITY_SOURCE.TRL_BRIDGING_PROGRAM, position: 11, isVisible: true },
    { universalIdentifier: 'f2c7c966-f304-42cb-8712-39ad60593ed8', fieldValue: OPPORTUNITY_SOURCE.TECHNOLOGY_FELLOWS, position: 12, isVisible: true },
    { universalIdentifier: 'f19ecfeb-775b-4709-b065-d7675cf405ba', fieldValue: OPPORTUNITY_SOURCE.TECHNICAL_COMMITTEE, position: 13, isVisible: true },
    { universalIdentifier: 'ce9fd297-2495-4e5f-9143-5169e5df1693', fieldValue: OPPORTUNITY_SOURCE.GOVERNMENT_REQUEST, position: 14, isVisible: true },
    { universalIdentifier: 'c9239331-4877-4a02-9681-a3d44fd44377', fieldValue: OPPORTUNITY_SOURCE.TENDER, position: 15, isVisible: true },
    { universalIdentifier: 'f98f32f1-4b66-4ece-8a29-162e1cfb24a3', fieldValue: OPPORTUNITY_SOURCE.OFFSET_MANAGER, position: 16, isVisible: true },
    { universalIdentifier: 'e626ce5a-e7fd-44d0-bff7-7fda47bd002c', fieldValue: OPPORTUNITY_SOURCE.STARTUP_PORTFOLIO, position: 17, isVisible: true },
    { universalIdentifier: '51b9bf8f-e096-4873-93b5-c44ad6a8b4ae', fieldValue: OPPORTUNITY_SOURCE.REGISTRY_OUTREACH, position: 18, isVisible: true },
    { universalIdentifier: '30f83712-9cfc-4d98-bd42-6a054ddc8ba3', fieldValue: OPPORTUNITY_SOURCE.OUTBOUND_SEQUENCE, position: 19, isVisible: true },
    { universalIdentifier: '6618e0b8-48ed-41f3-b8da-5440475d5637', fieldValue: OPPORTUNITY_SOURCE.LINKEDIN, position: 20, isVisible: true },
    { universalIdentifier: 'a0e73fcd-a8a2-49d0-9ce5-c3c9348daca2', fieldValue: OPPORTUNITY_SOURCE.REFERRAL, position: 21, isVisible: false },
    { universalIdentifier: '7883be83-999c-49c2-ae61-97c209feebd0', fieldValue: OPPORTUNITY_SOURCE.OUTREACH, position: 22, isVisible: false },
    { universalIdentifier: '4a46406a-874f-45b1-b050-4434f469c81d', fieldValue: OPPORTUNITY_SOURCE.EVENT, position: 23, isVisible: false },
    { universalIdentifier: '059b4f13-4cc6-4e3c-bc4e-d6bb0de9b809', fieldValue: OPPORTUNITY_SOURCE.OTHER, position: 24, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '8704afe5-3121-4676-a07d-f5fe4c794f25',
      fieldMetadataUniversalIdentifier: LEAD_STATUS_ENTERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
