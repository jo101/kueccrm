import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';
import { fieldDescription, objectDescription } from '../i18n/field-guidance';

export const CAPABILITY_UNIVERSAL_IDENTIFIER = '0223f14e-0439-4c1f-b389-7df40d0f04c2';

// Mirrors CAPABILITY_TYPE in kuec/playbooks/lookups.json.
export const CAPABILITY_KIND = {
  LAB: 'LAB',
  EQUIPMENT: 'EQUIPMENT',
  TECHNICAL_SERVICE: 'TECHNICAL_SERVICE',
  EXPERTISE: 'EXPERTISE',
  STARTUP: 'STARTUP',
  SUBSIDIARY: 'SUBSIDIARY',
  TECHNOLOGY: 'TECHNOLOGY',
  SPACE: 'SPACE',
  INVENTION_DISCLOSURE: 'INVENTION_DISCLOSURE',
  OTHER: 'OTHER',
} as const;

export type CapabilityKind = (typeof CAPABILITY_KIND)[keyof typeof CAPABILITY_KIND];

// Mirrors CAPABILITY_STATUS in kuec/playbooks/lookups.json.
export const CAPABILITY_STATUS = {
  AVAILABLE: 'AVAILABLE',
  LIMITED: 'LIMITED',
  UNAVAILABLE: 'UNAVAILABLE',
  WITHDRAWN: 'WITHDRAWN',
  OTHER: 'OTHER',
} as const;

export type CapabilityStatus = (typeof CAPABILITY_STATUS)[keyof typeof CAPABILITY_STATUS];

export const CAPABILITY_SOURCE_SYSTEM = {
  UVENTURE: 'UVENTURE',
} as const;

export const CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER = '6c588826-4923-4455-841c-48e6473e177f';
export const CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER = '459d99c4-4f58-405f-8d7f-c2355e5a990a';
export const CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '4380b3c3-80a1-4d41-8ba4-e7f9bbd334a5';
export const CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER = 'e9490a01-34ee-4a2a-8a52-f7c8cc3e49fa';
export const CAPABILITY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER = '35016cc6-d1e2-4f09-9eb1-ccb26d7636f8';
export const CAPABILITY_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER = '9706c6de-3f91-40e2-8e00-e6f1e9a868c6';
export const CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER = 'e8ecc681-c220-475d-a9ea-c7482e109114';
export const CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER = '452b294f-a730-49f4-b633-96cdf95f3012';
export const CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER = '7f2199ca-a879-4699-82af-97154a1867aa';
export const CAPABILITY_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER = '7346b8b5-b70f-4485-9487-5ad22b18418c';

// A pointer to a technology, disclosure, lab, item of equipment or other
// capability whose record lives in uVENTURE (kuec/CLAUDE.md section 5). Only
// the uVENTURE feed writes it; every person role reads it and nothing else.
// Nothing beyond these fields is ever copied from uVENTURE.
export default defineObject({
  universalIdentifier: CAPABILITY_UNIVERSAL_IDENTIFIER,
  nameSingular: 'capability',
  namePlural: 'capabilities',
  labelSingular: 'Capability',
  labelPlural: 'Capabilities',
  description: objectDescription('capability'),
  icon: 'IconFlask',
  labelIdentifierFieldMetadataUniversalIdentifier:
    CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: fieldDescription('capability.name'),
      icon: 'IconAbc',
      isSearchable: true,
    },
    {
      universalIdentifier: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'kind',
      label: 'Kind',
      description: fieldDescription('capability.kind'),
      icon: 'IconCategory',
      options: [
        { id: 'a30268e1-5a24-4b3f-a77c-7fca9fcb7d10', value: CAPABILITY_KIND.LAB, label: 'Lab', position: 0, color: 'blue' },
        { id: '182f000f-464f-491b-b1b5-8319cd8b12d0', value: CAPABILITY_KIND.EQUIPMENT, label: 'Equipment', position: 1, color: 'orange' },
        { id: '1b2b4aaa-57dc-471c-b516-25c2db6794db', value: CAPABILITY_KIND.TECHNICAL_SERVICE, label: 'Technical service', position: 2, color: 'green' },
        { id: '89eb17ae-e810-45fa-acd0-0539539c16ec', value: CAPABILITY_KIND.EXPERTISE, label: 'Expertise', position: 3, color: 'sky' },
        { id: '97486d69-2230-4afc-8a12-f96657917236', value: CAPABILITY_KIND.STARTUP, label: 'Startup', position: 4, color: 'pink' },
        { id: '5c6077b8-92a2-4620-9641-053ea15fd0b8', value: CAPABILITY_KIND.SUBSIDIARY, label: 'Subsidiary', position: 5, color: 'turquoise' },
        { id: '4d24fbe9-466f-4ac5-8c24-3c3c3aa5b452', value: CAPABILITY_KIND.TECHNOLOGY, label: 'Technology', position: 6, color: 'purple' },
        { id: 'e81c77a2-f347-47ce-b40f-601942437208', value: CAPABILITY_KIND.SPACE, label: 'Space', position: 7, color: 'amber' },
        { id: 'e7d912be-3630-419f-98b2-3f726c8373ad', value: CAPABILITY_KIND.INVENTION_DISCLOSURE, label: 'Invention disclosure', position: 8, color: 'violet' },
        { id: '01280df1-54c3-4191-855d-ab19c1c1caf7', value: CAPABILITY_KIND.OTHER, label: 'Other', position: 9, color: 'gray' },
      ],
    },
    {
      universalIdentifier: CAPABILITY_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      description: fieldDescription('capability.status'),
      icon: 'IconProgressCheck',
      options: [
        { id: '1aa81861-11af-4cd0-b053-9a6523c32a44', value: CAPABILITY_STATUS.AVAILABLE, label: 'Available to offer', position: 0, color: 'green' },
        { id: '58277142-a2ef-4deb-ab35-bc57a549f4cf', value: CAPABILITY_STATUS.LIMITED, label: 'Limited availability', position: 1, color: 'amber' },
        { id: 'e3e5722d-5537-4c7e-bf25-af4abb4dc21e', value: CAPABILITY_STATUS.UNAVAILABLE, label: 'Temporarily unavailable', position: 2, color: 'orange' },
        { id: 'ae5ce8fb-664e-449f-b5c3-189167c8d656', value: CAPABILITY_STATUS.WITHDRAWN, label: 'Withdrawn', position: 3, color: 'red' },
        { id: '38afc380-2fbb-45b8-806e-6c4295a0e9a2', value: CAPABILITY_STATUS.OTHER, label: 'Other', position: 4, color: 'gray' },
      ],
    },
    {
      universalIdentifier: CAPABILITY_UVENTURE_RECORD_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.LINKS,
      name: 'uventureRecord',
      label: 'uVENTURE record',
      description: fieldDescription('capability.uventureRecord'),
      icon: 'IconLink',
    },
    // Integration identity (runbooks/16-integration-map.md section 2.2): OPEN
    // so the app can write them, locked for people in roles/utils/field-locks.ts.
    {
      universalIdentifier: CAPABILITY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'externalId',
      label: 'External id',
      description: fieldDescription('capability.externalId'),
      icon: 'IconId',
      isUnique: true,
    },
    {
      universalIdentifier: CAPABILITY_SOURCE_SYSTEM_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'sourceSystem',
      label: 'Source system',
      description: fieldDescription('capability.sourceSystem'),
      icon: 'IconDatabaseImport',
      options: [
        { id: '7414ad32-979c-4b5f-bd86-2c25d03747e9', value: CAPABILITY_SOURCE_SYSTEM.UVENTURE, label: 'uVENTURE', position: 0, color: 'purple' },
      ],
    },
    {
      universalIdentifier: CAPABILITY_STATUS_CHANGED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'statusChangedAt',
      label: 'Status changed at',
      description: fieldDescription('capability.statusChangedAt'),
      icon: 'IconCalendarClock',
      writability: MetadataWritability.APPLICATION,
    },
    // Stamped by every nightly snapshot that lists the record; not audit-logged
    // so the stamp does not fill the timeline.
    {
      universalIdentifier: CAPABILITY_LAST_SEEN_IN_UVENTURE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'lastSeenInUventureAt',
      label: 'Last seen in uVENTURE',
      description: fieldDescription('capability.lastSeenInUventureAt'),
      icon: 'IconEye',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    // Last seen plus 7 days, so a view can list what uVENTURE stopped listing:
    // view filters have no "older than N days".
    {
      universalIdentifier: CAPABILITY_STALE_FROM_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'staleFrom',
      label: 'Stale from',
      description: fieldDescription('capability.staleFrom'),
      icon: 'IconHourglassHigh',
      isAuditLogged: false,
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: CAPABILITY_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'otherDetails',
      label: 'Other details',
      description: fieldDescription('capability.otherDetails'),
      icon: 'IconNotes',
    },
  ],
});
