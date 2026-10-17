import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/account-tier-on-company.field';
import { ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/engagement-lapses-at-on-company.field';
import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/last-engagement-at-on-company.field';
import { SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/sector-on-company.field';

export const PACK_PIPELINE_TIERED_ACCOUNTS_VIEW_UNIVERSAL_IDENTIFIER = '1437c400-0214-4132-93a5-034eaf9ae98c';

export default defineView({
  universalIdentifier: PACK_PIPELINE_TIERED_ACCOUNTS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Pipeline pack: tiered accounts',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'e82519be-a054-4585-be7b-6146a477c35c', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '658f9423-162b-4a55-bc88-2507531dd6f3', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.accountOwner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'e33b384a-009c-4f91-89dc-c54c7ec51e72', fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'cf52ceae-9fcd-403d-a17b-c9500e4bc89a', fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: '7aa542a0-64dc-426c-ad20-27803d64d412', fieldMetadataUniversalIdentifier: SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'f7c96ff8-8b5f-4f72-874f-2518618d31df', fieldMetadataUniversalIdentifier: ENGAGEMENT_LAPSES_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: '066594c1-e2ab-42c2-9ece-e811aa31c46f',
      fieldMetadataUniversalIdentifier: ACCOUNT_TIER_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'ea1e37b2-052e-4055-ad08-18f3d6303361',
      fieldMetadataUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
