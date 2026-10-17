import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import { CLIENT_DEADLINE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/client-deadline-on-opportunity.field';
import { CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/contracts-on-opportunity.field';
import { ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/engagements-on-opportunity.field';
import { LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lost-reason-category-on-opportunity.field';
import { LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/lost-reason-on-opportunity.field';
import { NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-date-on-opportunity.field';
import { NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-flagged-on-on-opportunity.field';
import { NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/next-action-on-opportunity.field';
import { PLAYBOOK_APPLIED_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/playbook-applied-on-opportunity.field';
import { PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/playbook-type-on-opportunity.field';
import { PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/probability-on-opportunity.field';
import { PROJECTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/projects-on-opportunity.field';
import { SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/sharepoint-folder-on-opportunity.field';
import { SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/source-on-opportunity.field';
import { STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/stage-entered-at-on-opportunity.field';
import { WORK_PACKAGES_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/work-packages-on-opportunity.field';

export const OPPORTUNITIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = 'b7e7ad01-5f22-49ed-b64a-b464738bd69a';

const opportunityFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields;

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: OPPORTUNITIES_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '1b112d49-6966-4cec-8981-db17336b4bda', fieldMetadataUniversalIdentifier: opportunityFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'ad3ad312-797a-4bd0-bb2f-f9a15168d386', fieldMetadataUniversalIdentifier: opportunityFields.owner.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '56a282d8-5634-4ffb-b6eb-b18e4cca6103', fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'ffd84a69-7fc8-4f8b-81dd-6bb0b14140c3', fieldMetadataUniversalIdentifier: opportunityFields.stage.universalIdentifier, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '6c9eb949-2eaf-41fd-8621-b6ad022655bb', fieldMetadataUniversalIdentifier: opportunityFields.amount.universalIdentifier, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '4a0bdabb-e48e-4dcd-8047-110a0d0013a3', fieldMetadataUniversalIdentifier: opportunityFields.company.universalIdentifier, position: 5, isVisible: true, size: 170 },
    { universalIdentifier: '8359290e-7b90-4d69-a157-b544fd71f516', fieldMetadataUniversalIdentifier: opportunityFields.pointOfContact.universalIdentifier, position: 6, isVisible: true, size: 170 },
    { universalIdentifier: '573f4fab-279c-48a9-a096-e57d5fbf3d49', fieldMetadataUniversalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 7, isVisible: true, size: 140 },
    { universalIdentifier: 'a782364e-f377-4e2f-9654-6c06fb570a14', fieldMetadataUniversalIdentifier: SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 8, isVisible: true, size: 140 },
    { universalIdentifier: 'ae3ffc27-da8b-45ff-b53f-4776464ff872', fieldMetadataUniversalIdentifier: PROBABILITY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 9, isVisible: true, size: 140 },
    { universalIdentifier: '3c148fa3-018c-46fe-9502-3589fcbe4949', fieldMetadataUniversalIdentifier: NEXT_ACTION_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 10, isVisible: true, size: 220 },
    { universalIdentifier: '835098e8-3abe-4512-a1f5-da96123dd5ff', fieldMetadataUniversalIdentifier: NEXT_ACTION_DATE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 11, isVisible: true, size: 140 },
    { universalIdentifier: '1581d8fd-bcf4-45b6-b9a4-23a82deb89ab', fieldMetadataUniversalIdentifier: NEXT_ACTION_FLAGGED_ON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 12, isVisible: true, size: 140 },
    { universalIdentifier: '63321054-ebb2-4ecd-9a7c-7f3a268dc777', fieldMetadataUniversalIdentifier: STAGE_ENTERED_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 13, isVisible: true, size: 140 },
    { universalIdentifier: 'f87480b6-c1ce-4ed8-a6c4-f934dc4f0fd2', fieldMetadataUniversalIdentifier: CLIENT_DEADLINE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 14, isVisible: true, size: 140 },
    { universalIdentifier: 'c55dddd3-6fe7-4513-8ef9-8e17a0f1b215', fieldMetadataUniversalIdentifier: LOST_REASON_CATEGORY_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 15, isVisible: true, size: 140 },
    { universalIdentifier: '152e5443-faad-4edf-9121-bc3cc06c8ad7', fieldMetadataUniversalIdentifier: LOST_REASON_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 16, isVisible: true, size: 220 },
    { universalIdentifier: '6bff153a-1333-4469-9ad0-cbd7dfe9b5ac', fieldMetadataUniversalIdentifier: PLAYBOOK_APPLIED_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 17, isVisible: true, size: 130 },
    { universalIdentifier: '41a71894-91e0-4d3e-8173-84f040a963a7', fieldMetadataUniversalIdentifier: PROJECTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 18, isVisible: true, size: 170 },
    { universalIdentifier: '95a83cc7-4c51-4769-b527-746970aee1b0', fieldMetadataUniversalIdentifier: WORK_PACKAGES_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 19, isVisible: true, size: 170 },
    { universalIdentifier: '30f6ae50-b19a-44a7-b3cb-f070ac2db07b', fieldMetadataUniversalIdentifier: ENGAGEMENTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 20, isVisible: true, size: 170 },
    { universalIdentifier: 'f54b04d1-7367-4b94-9678-6a47355a9c9e', fieldMetadataUniversalIdentifier: CONTRACTS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 21, isVisible: true, size: 170 },
    { universalIdentifier: '0181669c-096a-45eb-9c6d-0ce75c07bb71', fieldMetadataUniversalIdentifier: SHAREPOINT_FOLDER_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, position: 22, isVisible: true, size: 220 },
  ],
  sorts: [
    {
      universalIdentifier: 'f7102d9f-4055-4bfc-9ef4-2546eb2da7bc',
      fieldMetadataUniversalIdentifier: opportunityFields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
