import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-project.field';
import {
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../objects/project.object';

export const PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER = 'ad5a06cd-2f04-4c6e-be77-560ec03987dc';

export default defineView({
  universalIdentifier: PROJECT_PORTFOLIO_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Portfolio',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconBriefcase',
  position: 0,
  fields: [
    { universalIdentifier: 'fc46da00-bfec-4ee7-8699-e8cb83c737ee', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '05431b80-4892-4e31-b485-ade498c1e104', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9e052496-c307-4d43-9c19-c17ef7afbc6d', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '880ae197-d5b1-4efd-bac1-bf0a0c2a6941', fieldMetadataUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '59158f77-a3a2-413e-8e65-1639c2079d80', fieldMetadataUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
  ],
  filters: [
    {
      universalIdentifier: 'c735212c-4c21-4b14-93dd-5e69c06b01d5',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
  ],
  sorts: [
    {
      universalIdentifier: '30811252-a6d2-4892-bdd3-725336258aa2',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
