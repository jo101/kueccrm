import {
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/dependents-on-work-package.field';
import { DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/depends-on-on-work-package.field';
import { MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/milestone-on-work-package.field';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/opportunity-on-work-package.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-work-package.field';
import { PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/project-on-work-package.field';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/reviewer-on-work-package.field';
import {
  WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from '../objects/work-package.object';

export const WORK_PACKAGES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '68346a02-be73-4336-8953-3b59313df4c6';

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: WORK_PACKAGES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '42bc43b6-601a-4887-ab5c-24a5aefc8904', fieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'ea2a5818-dde0-43cb-8270-b001515f9e1c', fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'b08469dc-7bf3-4ac4-ad91-e484bddc635e', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: '607aa5d2-21d0-4876-a18d-12d78418b411', fieldMetadataUniversalIdentifier: WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '88ed9b9d-c9c2-46cd-b12e-7fdad6be55b7', fieldMetadataUniversalIdentifier: REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'cd84e65c-ef2c-4952-90f6-b82ad0dbb940', fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: '2e3a5b0c-8788-4b3a-ad5a-003800579744', fieldMetadataUniversalIdentifier: PROJECT_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 6, isVisible: true, size: 170 },
    { universalIdentifier: '1c05b6d2-c117-4c1f-b91c-cfdc6164a893', fieldMetadataUniversalIdentifier: MILESTONE_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 170 },
    { universalIdentifier: 'be617042-05cd-4c93-becd-8a8f55f4e488', fieldMetadataUniversalIdentifier: DEPENDS_ON_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 170 },
    { universalIdentifier: '4b984321-8c1c-4f27-be86-8cffd06ac955', fieldMetadataUniversalIdentifier: DEPENDENTS_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 170 },
    { universalIdentifier: '16ec2d7a-7d7f-4c71-82c9-3839fd4fea37', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OBJECTIVE_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 220 },
    { universalIdentifier: 'ead25af5-1ef6-462b-9fba-97e9c6142eac', fieldMetadataUniversalIdentifier: WORK_PACKAGE_EXPECTED_OUTPUT_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 220 },
    { universalIdentifier: '1ab8aa52-fc71-46ca-b321-b6602800f2cb', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 220 },
    { universalIdentifier: '47d920f4-f178-4ef2-974c-c486b9cd31ef', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 220 },
    { universalIdentifier: '3ea001fc-3b31-447d-8d76-ae7b4f0d01d7', fieldMetadataUniversalIdentifier: WORK_PACKAGE_PLAYBOOK_STEP_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 220 },
    { universalIdentifier: 'b5f01b45-a34a-4891-bcf2-e4b8a73c9aec', fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_OFFSET_BUSINESS_DAYS_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 130 },
    { universalIdentifier: '8dc06d4c-5f99-4d8f-ac61-7971b26d225c', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OFFERED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 16, isVisible: true, size: 140 },
    { universalIdentifier: '6912938c-ac90-4697-acea-cb759c85c5cc', fieldMetadataUniversalIdentifier: WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 17, isVisible: true, size: 140 },
    { universalIdentifier: 'ac0d040d-19ef-4dec-b245-a397c8abafec', fieldMetadataUniversalIdentifier: WORK_PACKAGE_SUBMITTED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 18, isVisible: true, size: 140 },
    { universalIdentifier: 'c9ee19e5-7769-4dc5-9995-342ce0bdcdc6', fieldMetadataUniversalIdentifier: WORK_PACKAGE_BLOCKED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 19, isVisible: true, size: 140 },
    { universalIdentifier: '3e38b2ce-32d2-43e1-91c3-31d69a964d5c', fieldMetadataUniversalIdentifier: WORK_PACKAGE_COMPLETED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 20, isVisible: true, size: 140 },
    { universalIdentifier: '9315b464-deeb-4679-8245-8e552760e80e', fieldMetadataUniversalIdentifier: WORK_PACKAGE_ACCEPT_REMINDER_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 21, isVisible: true, size: 140 },
    { universalIdentifier: '3e0ad405-c108-4647-88fc-22139af3a733', fieldMetadataUniversalIdentifier: WORK_PACKAGE_REASSIGNED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 22, isVisible: true, size: 140 },
    { universalIdentifier: 'ffd65f29-3aae-4e4b-8bac-d728c730bcc7', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OVERDUE_OWNER_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 23, isVisible: true, size: 140 },
    { universalIdentifier: '004683fa-a1ea-4d13-a7c5-97b654293b38', fieldMetadataUniversalIdentifier: WORK_PACKAGE_OVERDUE_ED_NOTIFIED_AT_FIELD_UNIVERSAL_IDENTIFIER, position: 24, isVisible: true, size: 140 },
  ],
  sorts: [
    {
      universalIdentifier: 'ab1578c3-baaf-44c0-b476-ff1253fd21e7',
      fieldMetadataUniversalIdentifier: WORK_PACKAGE_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
      direction: ViewSortDirection.ASC,
    },
  ],
});
