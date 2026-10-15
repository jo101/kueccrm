import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/account-tier-on-company.field';
import { IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-offset-obligor-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sector-on-company.field';

export const OFFSET_OBLIGORS_VIEW_UNIVERSAL_IDENTIFIER = '1c6c6ee4-223c-43a2-b187-456fe915bcd4';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: OFFSET_OBLIGORS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Offset obligors',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconScale',
  position: 2,
  fields: [
    { universalIdentifier: 'acb207db-d848-4d18-960a-177ca7773504', fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '47511c8c-0be7-4364-b10b-aeac48644296', fieldMetadataUniversalIdentifier: companyFields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '907448ec-5089-44ef-9983-e736add779dc', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '0ea67e62-f62a-46d3-bb28-a0648a1bd672', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '8925893e-00a3-42a1-84a9-bf1903e7bd35', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: '76fb1a8b-6e69-4e80-83ea-8e81ba647779',
      fieldMetadataUniversalIdentifier: IS_OFFSET_OBLIGOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: 'true',
    },
  ],
  sorts: [
    {
      universalIdentifier: '9dd2083b-c300-42c1-985d-6edb44c2b79b',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
