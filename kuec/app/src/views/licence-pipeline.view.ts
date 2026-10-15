import {
  AggregateOperations,
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';
import {
  OPPORTUNITY_PLAYBOOK_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/playbook-type-on-opportunity.field';

export const LICENCE_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER = '965df185-1ccc-4a40-aa38-024718441315';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: LICENCE_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Licence pipeline',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLicense',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
  kanbanAggregateOperation: AggregateOperations.SUM,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier,
  fields: [
    { universalIdentifier: 'a1abf0f2-35d3-4f7f-8650-90bf37421e47', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '6419b29d-c2ca-47b0-86c2-84e6f4f4fa0b', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '56e3cda2-d4ef-419b-9689-6fae150b8791', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '2e10e87e-2f5f-412e-a196-68cf01652a20', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: 'dca25dbf-5cd2-499b-a4ad-1824590938aa', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '1e288959-bca6-45cd-a9c6-cfac26097931', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 140 },
  ],
  groups: [
    { universalIdentifier: 'af8ae9b2-d72a-4bf5-9303-991de0d88d0e', fieldValue: OPPORTUNITY_STAGE.NEW, position: 0, isVisible: true },
    { universalIdentifier: '65fa3cb8-2c47-4907-93c6-e85e5e089e16', fieldValue: OPPORTUNITY_STAGE.SCREENING, position: 1, isVisible: true },
    { universalIdentifier: '856b26f1-a128-477b-9860-a3952e1e2986', fieldValue: OPPORTUNITY_STAGE.MEETING, position: 2, isVisible: true },
    { universalIdentifier: 'ac084727-8fb3-4e08-b2ef-df01cd115b0d', fieldValue: OPPORTUNITY_STAGE.PROPOSAL, position: 3, isVisible: true },
    { universalIdentifier: '1d9659fe-fd6b-47b7-b352-f95223c8683a', fieldValue: OPPORTUNITY_STAGE.CUSTOMER, position: 4, isVisible: true },
    { universalIdentifier: 'e1ceb5f0-9390-4620-8df7-c4abb481f580', fieldValue: OPPORTUNITY_STAGE.SIGNED, position: 5, isVisible: true },
    { universalIdentifier: '8d577c4e-e7cb-419d-ac86-e6c44b4d0739', fieldValue: OPPORTUNITY_STAGE.LOST, position: 6, isVisible: false },
    { universalIdentifier: '67a3a8a3-eee8-4647-a342-547e7a1eda17', fieldValue: OPPORTUNITY_STAGE.PARKED, position: 7, isVisible: false },
  ],
  filters: [
    {
      universalIdentifier: '47cfe914-0719-43ba-8a52-6e80c23188d0',
      fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING],
    },
  ],
  sorts: [
    {
      universalIdentifier: '5202080a-85b3-45bd-a194-ecdb5b7d409c',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
