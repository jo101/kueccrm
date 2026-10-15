import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLOSED_OPPORTUNITY_STAGES } from '../../constants/opportunity-stage';
import { PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/playbook-type-on-opportunity.field';

export const BD_OPEN_PIPELINE_BY_TYPE_AND_SECTOR_VIEW_UNIVERSAL_IDENTIFIER = 'e36c8989-b011-4f23-ab2d-4d2f29c8d69e';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

export default defineView({
  universalIdentifier: BD_OPEN_PIPELINE_BY_TYPE_AND_SECTOR_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'BD: Open pipeline by type and sector',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: '9749d1b5-eb86-46fa-93a3-a5f57e859726', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '537ac8a3-1716-4acf-8f04-8e842d12a1e2', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '8e70cdf2-6031-4116-8582-947745b6a4a4', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'f81fbe65-62fd-46a7-9b31-938154308906', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '4728ca56-01e2-41e5-a369-0dc353899a0d', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: 'c851dc9e-b0ef-4fe9-8add-4fed0e00d56d', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '822cf7a7-36dd-45cd-9dd3-9603be2cf996',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: CLOSED_OPPORTUNITY_STAGES,
    },
  ],
  sorts: [
    {
      universalIdentifier: '3f70629d-8a7f-41b9-9485-d54e5afb9ab7',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
