import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

import { LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/last-engagement-at-on-company.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../../fields/stage-entered-at-on-opportunity.field';
import {
  MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from '../../objects/milestone.object';
import {
  PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from '../../objects/project.object';
import {
  WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../../objects/work-package.object';

export type FieldReference = {
  objectUniversalIdentifier: string;
  fieldUniversalIdentifier: string;
};

// Fields only automation, the ED and the ops coordinator may change. A field
// added later under one of these names must be added to LOCKED_FIELDS too;
// roles.test.ts fails until it is.
export const LOCKED_FIELD_NAMES = [
  'offeredAt',
  'completedAt',
  'stageEnteredAt',
  'lastEngagementAt',
  'percentComplete',
  'health',
  'playbookStep',
  'externalId',
  'sourceSystem',
  'serviceCaseId',
  'version',
] as const;

export const LOCKED_FIELDS: FieldReference[] = [
  {
    objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier: MILESTONE_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: MILESTONE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
    fieldUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
    fieldUniversalIdentifier: LAST_ENGAGEMENT_AT_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: PROJECT_PERCENT_COMPLETE_FIELD_UNIVERSAL_IDENTIFIER,
  },
  {
    objectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifier: PROJECT_HEALTH_FIELD_UNIVERSAL_IDENTIFIER,
  },
];

export const toUpdateLocks = (fields: FieldReference[]) =>
  fields.map((field) => ({ ...field, canUpdateFieldValue: false }));
