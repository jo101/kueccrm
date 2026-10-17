import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS,
  CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/capability.object';

export const CAPABILITIES_NOT_AVAILABLE_VIEW_UNIVERSAL_IDENTIFIER = '36c5d248-c8f3-4709-b5b7-d7bdf0d81ad8';

// Check here before promising a lab, a machine or a technology to a client.
export default defineView({
  universalIdentifier: CAPABILITIES_NOT_AVAILABLE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Not available to offer',
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconBan',
  position: 1,
  fields: [
    { universalIdentifier: '7b5d5e97-adea-4442-86b9-01df7e95f6c6', fieldMetadataUniversalIdentifier: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: '03477e17-0fd2-4891-acfc-96ea02cb114b', fieldMetadataUniversalIdentifier: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '0518beb3-ee4f-4794-b05d-7428acf7c2d5', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'ea39cee0-a182-4d1e-af8f-f0ad0f4adafa', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '159d38f1-e447-416c-9764-f89a42db4bef', fieldMetadataUniversalIdentifier: CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '61c3fc82-d0c8-4311-ab6b-64b904d34dbd', fieldMetadataUniversalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 160 },
  ],
  filters: [
    {
      universalIdentifier: '0d958d56-06cd-4228-9e11-227b42dbf704',
      fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [CAPABILITY_STATUS.LIMITED, CAPABILITY_STATUS.UNAVAILABLE, CAPABILITY_STATUS.WITHDRAWN],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'c010367d-ba5b-4430-9565-18d4a46851f6',
      fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
