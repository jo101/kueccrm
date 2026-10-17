import {
  defineView,
  ViewType,
} from 'twenty-sdk/define';
import {
  CAPABILITY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/capability.object';

export const CAPABILITIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = 'e0ea52da-b9da-4d3d-9990-601876df2605';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: CAPABILITIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '9b521fa4-b9e9-4783-be41-8886ffed87a0', fieldMetadataUniversalIdentifier: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: '434aa9ec-d117-4d32-a884-461057f555a6', fieldMetadataUniversalIdentifier: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '0f2e1cf5-d2aa-4b0b-87c0-8de9d00fd79e', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 150 },
    { universalIdentifier: 'c958a0b9-3f3c-4bb2-9a64-368215845f8c', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: '973461c2-0909-4e9d-a22e-c50c31986fbb', fieldMetadataUniversalIdentifier: CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: '61b27bbb-3217-401c-b627-8f8f760849d7', fieldMetadataUniversalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 160 },
    { universalIdentifier: 'c733ae1a-0f82-46cc-be43-3efacd645e0e', fieldMetadataUniversalIdentifier: CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 150 },
    { universalIdentifier: '3dfecac3-1849-427d-8ff0-07ef229229ed', fieldMetadataUniversalIdentifier: CAPABILITY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 180 },
    { universalIdentifier: 'b365e8e6-c449-4b0e-9915-93a456af3139', fieldMetadataUniversalIdentifier: CAPABILITY_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 140 },
    { universalIdentifier: '0a6c8ed6-c0b7-48e8-a4e4-edf209d9fbda', fieldMetadataUniversalIdentifier: CAPABILITY_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 220 },
  ],
});
