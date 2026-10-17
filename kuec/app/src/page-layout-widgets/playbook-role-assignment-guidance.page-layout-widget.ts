import { definePageLayoutWidget } from 'twenty-sdk/define';
import { PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER } from '../objects/playbook-role-assignment.object';
import {
  getAppObjectHomeTabUniversalIdentifier,
  guidanceRecordPageWidget,
} from './utils/guidance-record-page-widget';

export const PLAYBOOK_ROLE_ASSIGNMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER = '9f837d25-72aa-4c2e-90e6-8041a959c946';

export default definePageLayoutWidget(
  guidanceRecordPageWidget({
    universalIdentifier: PLAYBOOK_ROLE_ASSIGNMENT_GUIDANCE_WIDGET_UNIVERSAL_IDENTIFIER,
    guidancePageKey: 'playbookRoleAssignment',
    objectUniversalIdentifier: PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER,
    pageLayoutTabUniversalIdentifier:
      getAppObjectHomeTabUniversalIdentifier(PLAYBOOK_ROLE_ASSIGNMENT_UNIVERSAL_IDENTIFIER),
  }),
);
