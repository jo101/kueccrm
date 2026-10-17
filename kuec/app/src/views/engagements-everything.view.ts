import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-engagement.field';
import { OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-engagement.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-engagement.field';
import {
  ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/engagement.object';

export const ENGAGEMENTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '57667ed8-89df-40ea-819e-245c1631b0d6';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: ENGAGEMENTS_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: 'a15128a0-9d2b-4e19-bab3-9fa006f3dc64', fieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'c56bc5ac-ea75-470c-83ec-14ff96f2e256', fieldMetadataUniversalIdentifier: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '189a98f6-e8bf-4a16-80dc-c758d270f7fc', fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0fed4c62-c16e-40ed-8dcd-908ae14a6c9f', fieldMetadataUniversalIdentifier: ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'a6d2e2f1-139d-4c7f-84ee-049a797346fe', fieldMetadataUniversalIdentifier: COMPANY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'b11565e2-dd6b-4a80-8bbb-54c33e7135d0', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: '0809a1f9-d746-4c14-8509-0eadc08439e9', fieldMetadataUniversalIdentifier: ENGAGEMENT_NEXT_STEP_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 220 },
    { universalIdentifier: '2d636fd7-952a-4a8e-9815-c78dd7e286f8', fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 220 },
    { universalIdentifier: 'aff8139b-c373-4143-9962-85484b4565de', fieldMetadataUniversalIdentifier: ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 140 },
    { universalIdentifier: '36c698df-8c7a-4ca8-b244-8c2ee8438b9a', fieldMetadataUniversalIdentifier: ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 140 },
    { universalIdentifier: '8b915a07-2b71-4fe2-8a8e-5e5ba8b2346d', fieldMetadataUniversalIdentifier: ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: '22b06d57-0d18-4943-bd06-225145aefc53',
      fieldMetadataUniversalIdentifier: ENGAGEMENT_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
