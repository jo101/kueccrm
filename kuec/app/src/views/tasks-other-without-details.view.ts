import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';
import { OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/other-details-on-task.field';
import {
  TASK_TYPE,
  TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
} from '../fields/task-type-on-task.field';

export const TASKS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER = '9102cac9-0af2-45f6-af0c-7de9d090b350';

const taskFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.fields;

// Type set to Other with Other details empty. Tasks have no owner field, so
// the assignee stands in as the second column.
export default defineView({
  universalIdentifier: TASKS_OTHER_WITHOUT_DETAILS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Hygiene: Other without details',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 19,
  fields: [
    { universalIdentifier: 'ebb8e625-0fb1-4418-a7df-fd7e2427d8e6', fieldMetadataUniversalIdentifier: taskFields.title.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd37924b1-2a06-44c3-8ecb-c104c2fd87ba', fieldMetadataUniversalIdentifier: taskFields.assignee.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'a075c823-2072-4898-b820-33f4e0cf034d', fieldMetadataUniversalIdentifier: TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'bc74a803-e7ab-46c9-a995-cfdf47a7f96a', fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 220 },
  ],
  filters: [
    {
      universalIdentifier: '47c79e6c-f2e8-458e-b46f-e22da34dfb49',
      fieldMetadataUniversalIdentifier: OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '0824457f-fa89-448e-9f4e-f00616184896',
      fieldMetadataUniversalIdentifier: TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS,
      value: [TASK_TYPE.OTHER],
    },
  ],
});
