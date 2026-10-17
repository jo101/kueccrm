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
  CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER,
} from '../objects/capability.object';

export const CAPABILITIES_NOT_SEEN_IN_UVENTURE_VIEW_UNIVERSAL_IDENTIFIER = '2229990e-b34f-41fb-a511-0d77fab24256';

// The Monday sweep checks it: the nightly uVENTURE snapshot stopped listing
// these, so their cases need the owner's look (runbooks/14-hygiene.md).
export default defineView({
  universalIdentifier: CAPABILITIES_NOT_SEEN_IN_UVENTURE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Not seen in uVENTURE for 7 days',
  objectUniversalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconEyeOff',
  position: 2,
  fields: [
    { universalIdentifier: '439cec94-0c79-46ef-9ed6-2ffff111b8c2', fieldMetadataUniversalIdentifier: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: '0689a8ef-b1e4-48f5-98e8-fa5301222fe6', fieldMetadataUniversalIdentifier: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '9ecf0caf-5648-414e-b235-afccdd600676', fieldMetadataUniversalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 160 },
    { universalIdentifier: '1821769c-d069-4d4f-bbfd-bb0c639b9bad', fieldMetadataUniversalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 170 },
    { universalIdentifier: 'c6adfc8e-b7c8-4a98-afc9-3ff625637534', fieldMetadataUniversalIdentifier: CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 220 },
    { universalIdentifier: 'f73a1278-7404-4f1d-a9a4-253c170123c2', fieldMetadataUniversalIdentifier: CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 150 },
  ],
  filters: [
    {
      universalIdentifier: 'cdf81b7b-5bf9-403b-b1d8-37ea2462fdd4',
      fieldMetadataUniversalIdentifier: CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '4a9e353c-0f1c-4216-a969-17b352d8139c',
      fieldMetadataUniversalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
