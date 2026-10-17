import {
  defineObject,
  FieldType,
  MetadataWritability,
} from 'twenty-sdk/define';

export const WORK_PACKAGE_UNIVERSAL_IDENTIFIER = '8455b49c-d156-4855-8cf9-04f6966c92eb';

export const WORK_PACKAGE_STATUS = {
  PLANNED: 'PLANNED',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  SUBMITTED: 'SUBMITTED',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
} as const;

export type WorkPackageStatus =
  (typeof WORK_PACKAGE_STATUS)[keyof typeof WORK_PACKAGE_STATUS];

export const WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER = '39aad314-0575-4891-b48b-7d69ac389b95';
export const WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER = '3e4b730f-457a-41d5-8a60-aab393fd32f7';
export const WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER = '89da620c-73c8-402f-add1-e7603bd00466';
export const WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER = '3fcce0a2-71f4-484b-a71b-eb65927f116b';
export const WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER = '81907466-c986-4671-aacb-0441af9bb4c4';
export const WORK_PACKAGE_DECLINED_REASON_FIELD_UNIVERSAL_IDENTIFIER = 'a62a91b7-c5f9-4a65-8e99-a1b4a51ac3fc';
export const WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER = 'eb6e8f40-fae2-4397-89d1-eae1fd9d4206';
export const WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER = 'eba0a5a1-ac5e-4abc-ac6f-a373cb0074be';
export const WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER = '52bcf262-410c-473c-bc73-482ffdd5555b';
export const WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER = 'ec5e3261-1cf6-44f5-b1ef-9f45654139c8';
export const WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER = '95d7dac4-ad89-40cf-8e14-81d95de8b525';
export const WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER = '52562444-b79f-4d67-b5dd-b5c49a77709e';
export const WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER = '358cfea6-34ac-41a1-a6d0-f06f9466f8c0';
export const WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER = 'e323cfac-930a-40cb-ac9d-68e157840fea';
export const WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER = '54a535c1-d39b-4aad-8637-3680aa6a0c8a';
export const WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER = '5a32efd0-55b6-4c38-bf78-9811d8754297';
export const WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER = '3535b5db-0174-4121-9ac9-ce8be2926ae2';
export const WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '87062c11-2f25-46f1-b31e-2a71a545d558';
export const WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER = 'd28399c6-e6f2-43ce-b2b0-6ca33c959429';

export default defineObject({
  universalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'workPackage',
  namePlural: 'workPackages',
  labelSingular: 'Work package',
  labelPlural: 'Work packages',
  description:
    'A unit of work in a case, with one owner, a due date and done criteria',
  icon: 'IconChecklist',
  labelIdentifierFieldMetadataUniversalIdentifier:
    WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Title',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${WORK_PACKAGE_STATUS.PLANNED}'`,
      options: [
        { id: 'd5c7768f-8351-4c84-864a-82ee5da36b45', value: WORK_PACKAGE_STATUS.PLANNED, label: 'Planned', position: 0, color: 'gray' },
        { id: 'f31d38c0-d470-478d-b11f-5d63bae49427', value: WORK_PACKAGE_STATUS.OFFERED, label: 'Offered', position: 1, color: 'sky' },
        { id: '45d15137-a593-4fff-9881-b294c2d196c6', value: WORK_PACKAGE_STATUS.ACCEPTED, label: 'Accepted', position: 2, color: 'blue' },
        { id: '46c28b0a-6a40-48b8-b8d4-2e487ffbfe9a', value: WORK_PACKAGE_STATUS.SUBMITTED, label: 'Submitted', position: 3, color: 'purple' },
        { id: 'b78bd9d7-8384-462a-b71e-4bf1092720f6', value: WORK_PACKAGE_STATUS.BLOCKED, label: 'Blocked', position: 4, color: 'red' },
        { id: '29b511f2-4cef-4692-a299-d4f90084fba5', value: WORK_PACKAGE_STATUS.DONE, label: 'Done', position: 5, color: 'green' },
        { id: '5c233d75-7850-40bd-a2b3-f0c4150d4f62', value: WORK_PACKAGE_STATUS.DECLINED, label: 'Declined', position: 6, color: 'orange' },
        { id: 'c658b1a1-12fc-499e-b65e-2911b423a65c', value: WORK_PACKAGE_STATUS.CANCELLED, label: 'Cancelled', position: 7, color: 'gray' },
      ],
    },
    {
      universalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'dueAt',
      label: 'Due',
      icon: 'IconCalendarDue',
    },
    {
      universalIdentifier: WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'objective',
      label: 'Objective',
      icon: 'IconTarget',
      isSearchable: true,
    },
    {
      universalIdentifier: WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'expectedOutput',
      label: 'Expected output',
      icon: 'IconFileDescription',
    },
    {
      universalIdentifier: WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'doneCriteria',
      label: 'Done criteria',
      icon: 'IconListCheck',
    },
    {
      universalIdentifier: WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'blockedReason',
      label: 'Blocked reason',
      icon: 'IconBarrierBlock',
    },
    {
      universalIdentifier: WORK_PACKAGE_DECLINED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'declinedReason',
      label: 'Declined reason',
      description: 'Why the owner could not take this work, typed when declining',
      icon: 'IconThumbDown',
    },
    {
      universalIdentifier: WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'playbookStep',
      label: 'Playbook step',
      description: 'Playbook key and step key, e.g. TECHNOLOGY_LICENSING.OUTREACH',
      icon: 'IconRoute',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.NUMBER,
      name: 'dueOffsetBusinessDays',
      label: 'Due offset (business days)',
      description: 'Business days from release to due, from the playbook',
      icon: 'IconCalendarStats',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'offeredAt',
      label: 'Offered at',
      icon: 'IconSend',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'acceptedAt',
      label: 'Accepted at',
      icon: 'IconThumbUp',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'submittedAt',
      label: 'Submitted at',
      icon: 'IconUpload',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'blockedAt',
      label: 'Blocked at',
      icon: 'IconBarrierBlock',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'completedAt',
      label: 'Completed at',
      icon: 'IconCircleCheck',
      writability: MetadataWritability.APPLICATION,
    },
    {
      universalIdentifier: WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'acceptReminderSentAt',
      label: 'Acceptance reminder sent at',
      description: 'Set when the 2-business-day acceptance escalation fired',
      icon: 'IconBellRinging',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
    {
      universalIdentifier: WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'reassignedAt',
      label: 'Reassigned at',
      description: 'Set when the 5-business-day acceptance escalation reassigned it',
      icon: 'IconUserShare',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
    {
      universalIdentifier: WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'overdueOwnerNotifiedAt',
      label: 'Overdue owner notified at',
      icon: 'IconAlarm',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
    {
      universalIdentifier: WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.DATE_TIME,
      name: 'overdueEdNotifiedAt',
      label: 'Overdue ED notified at',
      icon: 'IconAlarm',
      writability: MetadataWritability.APPLICATION,
      isAuditLogged: false,
    },
  ],
});
