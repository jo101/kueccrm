import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/capability.object';

export const CAPABILITIES_ALL_VIEW_UNIVERSAL_IDENTIFIER = 'bba3b8c4-a00d-42c2-86d8-61cf80f89940';

// The Capabilities entry opens here. Pointers have no owner, so Kind stands in
// as the second column; the uVENTURE record link opens the full record.
export default defineView({
  universalIdentifier: CAPABILITIES_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All capabilities',
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlask',
  position: 0,
  fields: [
    { universalIdentifier: '570bb931-1243-469a-a1e5-3db356026435', fieldMetadataUniversalIdentifier: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: '580bac4f-07e1-4ecc-b7d0-c1438b15b976', fieldMetadataUniversalIdentifier: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '94cedc1b-0734-4623-9a28-3d4532bebe9d', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'ced08a59-b703-413f-9fd7-e1c0bfbdfa1b', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '26a313c4-6719-48e9-8ae1-b1f2d1a1c6bc', fieldMetadataUniversalIdentifier: CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '2cedef79-e712-42cb-ac44-7f22b329ad55', fieldMetadataUniversalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 160 },
  ],
  sorts: [
    {
      universalIdentifier: 'fb144650-f771-4eac-ac4c-b25338cd165c',
      fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.DESC,
    },
  ],
});
