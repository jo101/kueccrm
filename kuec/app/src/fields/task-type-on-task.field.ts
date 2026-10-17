import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER = 'f3605b73-cf05-485a-9529-571a03f55ef5';

export const TASK_TYPE = {
  FOLLOW_UP: 'FOLLOW_UP',
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  PREPARE_DOCUMENT: 'PREPARE_DOCUMENT',
  REVIEW: 'REVIEW',
  APPROVAL: 'APPROVAL',
  INTERNAL: 'INTERNAL',
  ADMIN: 'ADMIN',
  OTHER: 'OTHER',
} as const;

// `type` is a reserved field name in Twenty, hence taskType.
export default defineField({
  universalIdentifier: TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.SELECT,
  name: 'taskType',
  label: 'Type',
  description: 'What sort of task it is',
  icon: 'IconCategory',
  options: [
    {
      id: '8ba64278-7fe1-4a24-a6d5-ceb5537a2931',
      value: TASK_TYPE.FOLLOW_UP,
      label: 'Follow-up',
      position: 0,
      color: 'blue',
    },
    {
      id: 'b9405650-2f63-45f0-a913-901c7b6087e0',
      value: TASK_TYPE.CALL,
      label: 'Call',
      position: 1,
      color: 'green',
    },
    {
      id: 'a537155a-fcc9-40cb-857e-64062dc45ec0',
      value: TASK_TYPE.EMAIL,
      label: 'Email',
      position: 2,
      color: 'purple',
    },
    {
      id: 'cbfef88e-65e8-4337-930e-cdb1ff197e6e',
      value: TASK_TYPE.PREPARE_DOCUMENT,
      label: 'Prepare document',
      position: 3,
      color: 'orange',
    },
    {
      id: '3c22be34-8036-435f-b516-c4a9b640e835',
      value: TASK_TYPE.REVIEW,
      label: 'Review',
      position: 4,
      color: 'turquoise',
    },
    {
      id: 'e58d5522-789b-46a8-82bc-da262e23b616',
      value: TASK_TYPE.APPROVAL,
      label: 'Approval',
      position: 5,
      color: 'pink',
    },
    {
      id: '08fbfec2-6e7a-409c-9fdb-5b6146a2e42a',
      value: TASK_TYPE.INTERNAL,
      label: 'Internal',
      position: 6,
      color: 'sky',
    },
    {
      id: '740d746e-817e-48c2-a78b-65376156d5f0',
      value: TASK_TYPE.ADMIN,
      label: 'Admin',
      position: 7,
      color: 'amber',
    },
    {
      id: '2eaddb56-ef74-4ac9-8396-db8e8f1e402f',
      value: TASK_TYPE.OTHER,
      label: 'Other',
      position: 8,
      color: 'gray',
    },
  ],
});
