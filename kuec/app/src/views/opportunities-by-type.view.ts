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
  OPPORTUNITY_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/playbook-type-on-opportunity.field';

export const OPPORTUNITIES_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER = '79553127-8e8f-461d-9bc8-30940c80ab59';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: OPPORTUNITIES_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'By type',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCategory',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '5d6a9d66-37b1-4773-a86c-abf63c80d596', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: '8106a1c1-7df9-446d-a1ae-ce0f62961a89', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '25f3b03e-cafb-4c5f-98ba-92d92b814df6', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0de8ad03-bed2-40f4-8b8a-4144150a871d', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8f390c47-2b35-461b-86fa-021e07cc0c57', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 4, isVisible: true, size: 140 },
    { universalIdentifier: '1b01cc96-1e29-474f-b795-3bed1e879bb8', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 130, aggregateOperation: AggregateOperations.SUM },
  ],
  groups: [
    { universalIdentifier: '3ab2f1b0-c25b-469a-9e79-5006ccdfea00', fieldValue: OPPORTUNITY_TYPE.TECHNOLOGY_LICENSING, position: 0, isVisible: true },
    { universalIdentifier: '596369ec-3efe-416c-a216-763b1c8553c4', fieldValue: OPPORTUNITY_TYPE.SPINOUT_OR_STARTUP, position: 1, isVisible: true },
    { universalIdentifier: '1b707192-cff3-4b8f-969e-cd4dc328bc46', fieldValue: OPPORTUNITY_TYPE.RFQ_TECHNICAL_SERVICE, position: 2, isVisible: true },
    { universalIdentifier: '239bb6b3-e898-49e9-be81-cf05b6b8a0a0', fieldValue: OPPORTUNITY_TYPE.LAB_TESTING, position: 3, isVisible: true },
    { universalIdentifier: '6d4faf59-3e84-4934-adb6-323da747b31c', fieldValue: OPPORTUNITY_TYPE.EQUIPMENT_OR_FACILITY_ACCESS, position: 4, isVisible: true },
    { universalIdentifier: '7b3092d7-e434-4af0-a189-4dbc25f9d892', fieldValue: OPPORTUNITY_TYPE.LEASING, position: 5, isVisible: true },
    { universalIdentifier: '6c3fa0bd-37a1-4250-a9df-ae707a8bcda9', fieldValue: OPPORTUNITY_TYPE.RESEARCH_COLLABORATION, position: 6, isVisible: true },
    { universalIdentifier: '0fc3a8ba-4ab2-48bf-a159-ad3aacd1e4a0', fieldValue: OPPORTUNITY_TYPE.INDUSTRY_PILOT, position: 7, isVisible: true },
    { universalIdentifier: '8c328dc0-e70b-4517-98eb-85a0e3db99e3', fieldValue: OPPORTUNITY_TYPE.CONSULTING_OR_ADVISORY, position: 8, isVisible: true },
    { universalIdentifier: '8d8cc785-1f8c-447c-9f7b-74bd18e172d2', fieldValue: OPPORTUNITY_TYPE.TRAINING_OR_BOOTCAMP, position: 9, isVisible: true },
    { universalIdentifier: '41188d47-8dce-4290-a710-5e304ce2d380', fieldValue: OPPORTUNITY_TYPE.SPONSORED_CHAIR, position: 10, isVisible: true },
    { universalIdentifier: 'a8486023-9bd4-4c51-a500-58a47b95ded1', fieldValue: OPPORTUNITY_TYPE.PROGRAMME_SPONSORSHIP, position: 11, isVisible: true },
    { universalIdentifier: '63ee70a5-0def-4164-8562-d1215b313352', fieldValue: OPPORTUNITY_TYPE.GOVERNMENT_PROPOSAL_OR_GRANT, position: 12, isVisible: true },
    { universalIdentifier: 'df3c4fd3-8443-4332-9889-b46d2b49fa94', fieldValue: OPPORTUNITY_TYPE.OFFSET_OR_ICV_PROJECT, position: 13, isVisible: true },
    { universalIdentifier: 'b6e0a6fb-2c28-4fd3-a7c5-fc471053199a', fieldValue: OPPORTUNITY_TYPE.PLATFORM_OR_PRODUCT_DELIVERY, position: 14, isVisible: true },
    { universalIdentifier: '67f1a0f2-81fe-416a-99f3-8a82e76261d0', fieldValue: OPPORTUNITY_TYPE.PARTNERSHIP_OR_MOU, position: 15, isVisible: true },
    { universalIdentifier: '72b50e33-ea61-47e7-a001-6d45dc7b491f', fieldValue: OPPORTUNITY_TYPE.INVESTMENT, position: 16, isVisible: true },
    { universalIdentifier: '78fd0e43-8567-40f3-9c2b-0d2d02c001db', fieldValue: OPPORTUNITY_TYPE.OTHER, position: 17, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '648ca255-9bc9-4ed4-8776-cd9354fba45d',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'ae71ed7d-72da-4da4-b5af-3409683bb66c',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
