import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../constants/opportunity-stage';
import {
  OPPORTUNITY_SOURCE,
  SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/source-on-opportunity.field';

export const OPPORTUNITIES_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER = '95fc1c0d-577c-4ed5-b3e4-eb6ea71ef856';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_BY_SOURCE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By source',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconArrowFork',
  position: 3,
  mainGroupByFieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: 'af0b9061-67d3-4460-b268-0c56e27a0334', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'f36526d6-eb25-439c-bf71-386137bc62e9', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '7d76b174-09f8-426a-b101-bd8a5e5039c0', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '88c3482e-6af0-4e22-9d7b-98f602cdab28', fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '9f645d73-c04c-49b8-8876-60f969f18e1f', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '81dffa0c-9eb5-4c57-9ad9-722163f6b31a', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: '2d4d9f0b-a62c-41c4-835b-a4d1aa09e8d9', fieldValue: OPPORTUNITY_SOURCE.INBOUND, position: 0, isVisible: true },
    { universalIdentifier: 'c19e621c-a70d-46e8-9c79-369f5fcf7a85', fieldValue: OPPORTUNITY_SOURCE.EXISTING_CUSTOMER, position: 1, isVisible: true },
    { universalIdentifier: '429ca223-d5ad-481e-8281-16e2cb65b912', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_COLLEAGUE, position: 2, isVisible: true },
    { universalIdentifier: 'a4efd6f5-9375-45c2-af13-672245ae008e', fieldValue: OPPORTUNITY_SOURCE.FACULTY, position: 3, isVisible: true },
    { universalIdentifier: 'c96ffd3f-766f-4ade-98b2-722cf0e3f6a4', fieldValue: OPPORTUNITY_SOURCE.PARTNER, position: 4, isVisible: true },
    { universalIdentifier: 'b4478e02-2f63-485e-9b45-af75c8d346de', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_KU_LEADERSHIP, position: 5, isVisible: true },
    { universalIdentifier: 'd535754a-b0c3-4125-a7f7-48f79fc8fbf5', fieldValue: OPPORTUNITY_SOURCE.REFERRAL_CEO_OR_BOARD, position: 6, isVisible: true },
    { universalIdentifier: '4fc4b3cd-6a0f-49b6-9e8e-e94789ea9ae0', fieldValue: OPPORTUNITY_SOURCE.WORKSHOP, position: 7, isVisible: true },
    { universalIdentifier: 'da1e8fde-8294-4b24-9c0f-c966f815ed4d', fieldValue: OPPORTUNITY_SOURCE.EXHIBITION, position: 8, isVisible: true },
    { universalIdentifier: '76cea128-913c-4536-9224-7e3caeae6009', fieldValue: OPPORTUNITY_SOURCE.GALA_QR, position: 9, isVisible: true },
    { universalIdentifier: '4b701534-31ec-4d77-b7c5-c33bf9b48be1', fieldValue: OPPORTUNITY_SOURCE.CHALLENGE_SPRINT, position: 10, isVisible: true },
    { universalIdentifier: 'f87f6ce4-1d24-4320-bfeb-a0a620bebf54', fieldValue: OPPORTUNITY_SOURCE.TRL_BRIDGING_PROGRAM, position: 11, isVisible: true },
    { universalIdentifier: '29b74513-4c17-40a2-a06e-e23cf69fcdfa', fieldValue: OPPORTUNITY_SOURCE.TECHNOLOGY_FELLOWS, position: 12, isVisible: true },
    { universalIdentifier: '0c0b454e-11c1-4f37-aceb-76b601d55ba2', fieldValue: OPPORTUNITY_SOURCE.TECHNICAL_COMMITTEE, position: 13, isVisible: true },
    { universalIdentifier: '4f1868bb-025f-4f9c-ba77-7416e5e4a8a7', fieldValue: OPPORTUNITY_SOURCE.GOVERNMENT_REQUEST, position: 14, isVisible: true },
    { universalIdentifier: 'bd6046dc-0286-4f86-b540-22b9b568d89e', fieldValue: OPPORTUNITY_SOURCE.TENDER, position: 15, isVisible: true },
    { universalIdentifier: 'fd5bb7c7-88e6-48e3-b116-d2e71c08181d', fieldValue: OPPORTUNITY_SOURCE.OFFSET_MANAGER, position: 16, isVisible: true },
    { universalIdentifier: '03470ed7-6633-4352-baf5-332d1a9d4212', fieldValue: OPPORTUNITY_SOURCE.STARTUP_PORTFOLIO, position: 17, isVisible: true },
    { universalIdentifier: '9e9ac86c-5c9b-4e99-99bd-deb5ed1d5fd8', fieldValue: OPPORTUNITY_SOURCE.REGISTRY_OUTREACH, position: 18, isVisible: true },
    { universalIdentifier: 'ca2d523d-4151-4a42-9aab-ee821d727415', fieldValue: OPPORTUNITY_SOURCE.OUTBOUND_SEQUENCE, position: 19, isVisible: true },
    { universalIdentifier: '1ded3a92-8b7a-4bcd-8ccd-dc292422de70', fieldValue: OPPORTUNITY_SOURCE.LINKEDIN, position: 20, isVisible: true },
    { universalIdentifier: '7c78e069-f24e-4d20-96af-67c59f2890b5', fieldValue: OPPORTUNITY_SOURCE.REFERRAL, position: 21, isVisible: false },
    { universalIdentifier: '57719483-fa43-4cdf-8e84-a15cb1f09462', fieldValue: OPPORTUNITY_SOURCE.OUTREACH, position: 22, isVisible: false },
    { universalIdentifier: '4e732bdd-2142-45c8-af48-7e4a761a8a9b', fieldValue: OPPORTUNITY_SOURCE.EVENT, position: 23, isVisible: false },
    { universalIdentifier: 'd2f65918-0c36-48c1-8696-196fa3851a7c', fieldValue: OPPORTUNITY_SOURCE.OTHER, position: 24, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'fc8a8894-da09-4c59-a4d9-34156d5b455f',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'beff531e-ded9-42e1-b161-89f079cd999f',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
