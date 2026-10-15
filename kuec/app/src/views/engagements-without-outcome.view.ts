import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENTS_WITHOUT_OUTCOME_VIEW_UNIVERSAL_IDENTIFIER = 'c3cfcad7-157a-411a-9b0d-c9793ea832e9';

export default defineView({
  universalIdentifier: ENGAGEMENTS_WITHOUT_OUTCOME_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Without outcome',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconClipboardX',
  position: 2,
  fields: [
    { universalIdentifier: '6c9e9720-cd7f-4ee5-8cee-f99534553b2e', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '5f45aa13-848e-4ced-b9fb-431ef56da3b7', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'f5b5fcb5-755f-4528-8045-27c7b1d55adc', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'ffebbaca-36c6-4ed7-8e7a-d13f00fa433f', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8494cab1-b377-401c-9faf-3ac8b96ecf3b', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '82eecf91-df2d-46db-9047-b051e01f801b', fieldMetadataUniversalIdentifier: ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '85b9d770-cca0-4778-a864-ee500bc92e39',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '5f32d044-2c04-4ee4-8251-df2d68d4de26',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '247e2091-4503-4ad8-a4c7-44fab0662964',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
