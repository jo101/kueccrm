import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/owner-on-project.field';
import {
  PROJECT_CHANNEL_PLAN_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_STATUS,
  PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_TARGET_SECTOR_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_TARGET_SIZE_CLASS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_TYPE,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../../objects/project.object';

export const PACK_CAMPAIGNS_ACTIVE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER = 'c231f427-6a58-47a7-93d0-5f6f388d819d';

export default defineView({
  universalIdentifier: PACK_CAMPAIGNS_ACTIVE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Campaign pack: active campaigns',
  objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconTable',
  fields: [
    { universalIdentifier: 'fe5a6f40-d24e-41eb-92f0-91ab65df988e', fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'cf1ddff6-7c7e-4896-944a-e106464d0507', fieldMetadataUniversalIdentifier: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'd67bd5ef-9ae1-4b0e-9227-7eb2ac39e65a', fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '86afed38-e9dc-47ce-894f-b5a62edf2534', fieldMetadataUniversalIdentifier: PROJECT_TARGET_SECTOR_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 180 },
    { universalIdentifier: 'a4363b4b-737c-433a-995f-c8a2c8c1618b', fieldMetadataUniversalIdentifier: PROJECT_TARGET_SIZE_CLASS_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'c793cac1-3320-45f8-8bdb-617659b73225', fieldMetadataUniversalIdentifier: PROJECT_CHANNEL_PLAN_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '197b2e12-63d3-404d-99f2-e39bbbaa3364',
      fieldMetadataUniversalIdentifier: PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_TYPE.GTM_CAMPAIGN],
    },
    {
      universalIdentifier: 'b924595d-706d-4bce-a363-35a25f2deca0',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [PROJECT_STATUS.ACTIVE],
    },
  ],
  sorts: [
    {
      universalIdentifier: '8201f89c-0568-4e7a-9d72-52579de2da28',
      fieldMetadataUniversalIdentifier: PROJECT_END_DATE_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
