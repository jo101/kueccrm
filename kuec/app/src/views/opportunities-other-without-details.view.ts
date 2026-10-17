import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { OPPORTUNITY_STAGE } from '../constants/opportunity-stage';
import {
  FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_FUNDING_PATH,
} from '../fields/funding-path-on-opportunity.field';
import {
  OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_OFFERING,
} from '../fields/offering-on-opportunity.field';
import { OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/other-details-on-opportunity.field';
import {
  OPPORTUNITY_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/playbook-type-on-opportunity.field';
import {
  OPPORTUNITY_SOURCE,
  SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/source-on-opportunity.field';

export const OPPORTUNITIES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = '4326f95b-98fc-4e98-b996-403c5da13cbf';
const OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER = 'c61eeecd-dd68-4482-83b6-213f88a9f0d0';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// Open or Signed opportunities with any of Source, Type, Offering or Funding path
// set to Other and Other details empty. Funding path is the hidden seventh
// column, under the six-column cap.
export default defineView({
  universalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: 'cdf62952-be9a-47d9-b468-b912d3ae44b2', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '3d210d89-081b-48e3-b322-794d29c0c68c', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '339e0391-11ec-4628-907a-7c97dd10eb8e', fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '6973fd37-bfa1-4968-b6a3-8d306216a760', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '749b2c13-182c-4acd-b6d3-382957db6f27', fieldMetadataUniversalIdentifier: OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'e6a44372-7ada-4dff-b263-24b14ac5b5f7', fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
    { universalIdentifier: '1e86073d-1fe6-4991-8395-e7a5442481c5', fieldMetadataUniversalIdentifier: FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: false, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: '6b398168-0f7b-43e4-abfb-a4e372052b59',
      fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '0c84e783-b7ce-4f62-8453-237310365a44',
      fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: [OPPORTUNITY_STAGE.LOST, OPPORTUNITY_STAGE.PARKED],
    },
    {
      universalIdentifier: '4868999a-1806-4991-b514-b21515fc140b',
      fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_SOURCE.OTHER],
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '10199cbf-926d-4187-b310-b4ef48bbeb85',
      fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_TYPE.OTHER],
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: '0fe43e30-3cd4-43e9-bef2-821df74fba06',
      fieldMetadataUniversalIdentifier: OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.CONTAINS,
      value: [OPPORTUNITY_OFFERING.OTHER],
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 2,
    },
    {
      universalIdentifier: 'b54576ec-e15e-4506-9279-81bb00c16c03',
      fieldMetadataUniversalIdentifier: FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [OPPORTUNITY_FUNDING_PATH.OTHER],
      viewFilterGroupUniversalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER,
      positionInViewFilterGroup: 3,
    },
  ],
  filterGroups: [
    { universalIdentifier: OPPORTUNITIES_OTHER_WITHOUT_DETAILS_OR_GROUP_UNIVERSAL_IDENTIFIER, logicalOperator: ViewFilterGroupLogicalOperator.OR },
  ],
});
