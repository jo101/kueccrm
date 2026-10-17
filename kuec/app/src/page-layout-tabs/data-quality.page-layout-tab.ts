import {
  AggregateOperations,
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  type PageLayoutWidgetManifest,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  type ViewConfig,
} from 'twenty-sdk/define';
import { CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/document.object';
import { ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/lead.object';
import { MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/data-quality.page-layout';
import companiesMissingKeyFieldsView from '../views/companies-missing-key-fields.view';
import companiesOtherWithoutDetailsView from '../views/companies-other-without-details.view';
import contractsOtherWithoutDetailsView from '../views/contracts-other-without-details.view';
import contractsPastExpiryStillSignedView from '../views/contracts-past-expiry-still-signed.view';
import documentsOtherWithoutDetailsView from '../views/documents-other-without-details.view';
import engagementsOtherWithoutDetailsView from '../views/engagements-other-without-details.view';
import engagementsOutcomeOverdueView from '../views/engagements-outcome-overdue.view';
import leadsOtherWithoutDetailsView from '../views/leads-other-without-details.view';
import milestonesOtherWithoutDetailsView from '../views/milestones-other-without-details.view';
import opportunitiesInQualifyOver30DaysView from '../views/opportunities-in-qualify-over-30-days.view';
import opportunitiesMissingKeyFieldsView from '../views/opportunities-missing-key-fields.view';
import opportunitiesOtherWithoutDetailsView from '../views/opportunities-other-without-details.view';
import opportunitiesParkedOver90DaysView from '../views/opportunities-parked-over-90-days.view';
import peopleMissingEmailOrDecisionRoleView from '../views/people-missing-email-or-decision-role.view';
import projectsOtherWithoutDetailsView from '../views/projects-other-without-details.view';
import tasksOtherWithoutDetailsView from '../views/tasks-other-without-details.view';
import workPackagesOtherWithoutDetailsView from '../views/work-packages-other-without-details.view';
import workPackagesWithoutDoneCriteriaView from '../views/work-packages-without-done-criteria.view';
import {
  CHART_DEFAULTS,
  chartFilterFromView,
  gridPosition,
  recordTableWidget,
} from './utils/dashboard-widgets';

export const DATA_QUALITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '8ed87583-d8ec-468e-ba9c-3ffd28c633ff';

type DataQualityCheck = {
  title: string;
  view: {
    config: Pick<
      ViewConfig,
      'universalIdentifier' | 'objectUniversalIdentifier' | 'filters' | 'filterGroups'
    >;
  };
  countFieldMetadataUniversalIdentifier: string;
  countWidgetUniversalIdentifier: string;
  tableWidgetUniversalIdentifier: string;
};

const { opportunity, company, person, task } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// The order of the Monday hygiene run (runbooks/14-hygiene.md section 4); the
// Other checks come last (runbooks/18-taxonomy.md).
export const DATA_QUALITY_CHECKS: DataQualityCheck[] = [
  {
    title: 'Opportunities missing type, owner, amount or close date',
    view: opportunitiesMissingKeyFieldsView,
    countFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '303ac185-00f2-4bc7-aa6a-d4a70a8d126e',
    tableWidgetUniversalIdentifier: 'a3ef4084-1279-4fe5-99c8-1ae380f4332e',
  },
  {
    title: 'Companies missing sector, size class or account owner',
    view: companiesMissingKeyFieldsView,
    countFieldMetadataUniversalIdentifier: company.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '573a23a2-9a26-496e-8d86-38d56d199b2b',
    tableWidgetUniversalIdentifier: '49b4b4e5-3a49-4ec3-8412-4dcfd1cb8579',
  },
  {
    title: 'People missing email or decision role',
    view: peopleMissingEmailOrDecisionRoleView,
    countFieldMetadataUniversalIdentifier: person.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '2cec73b2-c5ea-4cdf-a130-d7558c2d4f83',
    tableWidgetUniversalIdentifier: 'd84cd619-ae93-4c1a-9b1e-820644c928a6',
  },
  {
    title: 'Engagements without outcome after 2 days',
    view: engagementsOutcomeOverdueView,
    countFieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '468fcc93-3ce1-4b9a-91bd-91b190c86ce1',
    tableWidgetUniversalIdentifier: '7a7a2631-dc88-4026-ac09-7ea8dacfd2e5',
  },
  {
    title: 'Work packages without done criteria',
    view: workPackagesWithoutDoneCriteriaView,
    countFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: 'f11547d8-3ea5-4dfc-9bad-48c920c08809',
    tableWidgetUniversalIdentifier: '38119ee0-a8b1-407f-87bd-418a97213d3d',
  },
  {
    title: 'Opportunities in Qualify over 30 days',
    view: opportunitiesInQualifyOver30DaysView,
    countFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '36602b3b-775e-4cba-8ba9-f884c19aa713',
    tableWidgetUniversalIdentifier: 'a4c5f07e-d25a-4a52-b4d3-c6d38d00d3bc',
  },
  {
    title: 'Parked over 90 days: propose Lost',
    view: opportunitiesParkedOver90DaysView,
    countFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: 'aee4b09f-4570-44f9-9562-60479304249b',
    tableWidgetUniversalIdentifier: '1d21f5bc-4b3e-4fee-bf3e-19a5da7656da',
  },
  {
    title: 'Contracts past expiry, still Signed',
    view: contractsPastExpiryStillSignedView,
    countFieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '08b39bae-54d6-438c-9c81-2aa5ccfe082a',
    tableWidgetUniversalIdentifier: '580e05f4-e20f-45be-8ec4-24fd06879969',
  },  {
    title: 'Opportunities with Other and no details',
    view: opportunitiesOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: opportunity.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '2d686d4e-cfa1-4f51-bc95-cb3f69060910',
    tableWidgetUniversalIdentifier: '7f4a8c8d-15cc-4cd0-ac19-90522bc7a009',
  },
  {
    title: 'Companies with Other and no details',
    view: companiesOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: company.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: '627e8d2b-271b-402d-9bc8-1ff077030a8b',
    tableWidgetUniversalIdentifier: '2f499946-77d5-40a1-ac0b-887abeae1ce2',
  },
  {
    title: 'Engagements with Other and no details',
    view: engagementsOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '4771178a-6c47-4a3f-a8fc-5a6cc2545a0c',
    tableWidgetUniversalIdentifier: '1e36049b-4ddc-440b-90f7-80f0f2184ae1',
  },
  {
    title: 'Contracts with Other and no details',
    view: contractsOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: 'd5010c88-f3d2-40be-82ae-718b6546a70a',
    tableWidgetUniversalIdentifier: 'fd7eed54-81b1-47cd-9ee2-1cab0da674ab',
  },
  {
    title: 'Projects with Other and no details',
    view: projectsOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: 'e902bcbf-d66c-4d54-8979-815d5e559e63',
    tableWidgetUniversalIdentifier: '7dd4f4db-a8ec-4011-92f1-c8478060afe6',
  },
  {
    title: 'Work packages with Other and no details',
    view: workPackagesOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '3e19746a-ffb7-43e6-a983-b7509a8a4140',
    tableWidgetUniversalIdentifier: '3c32221f-4f99-4fca-a13f-38a70bd2777e',
  },
  {
    title: 'Milestones with Other and no details',
    view: milestonesOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '3dafacbd-f3a2-493b-b60e-a626a3abb41a',
    tableWidgetUniversalIdentifier: 'f7685be3-6796-4673-8b7e-3fbb92933d4b',
  },
  {
    title: 'Tasks with Other and no details',
    view: tasksOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: task.fields.id.universalIdentifier,
    countWidgetUniversalIdentifier: 'cd4a0670-47f6-4973-8dc4-2ac94554dfd2',
    tableWidgetUniversalIdentifier: 'c9a8f114-917e-430c-adb1-f380395c6f79',
  },
  {
    title: 'Leads with Other and no details',
    view: leadsOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: '89a322b7-76d2-4434-927e-4ef87cf357ba',
    tableWidgetUniversalIdentifier: '934dbb7d-854b-4111-a44d-f05d1592ccc4',
  },
  {
    title: 'Documents with Other and no details',
    view: documentsOtherWithoutDetailsView,
    countFieldMetadataUniversalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    countWidgetUniversalIdentifier: 'c40659af-2018-45dc-95c4-e1ef21035f53',
    tableWidgetUniversalIdentifier: 'ba36a377-b7a2-4ac4-8b19-b13f962ba997',
  },
];

const ROWS_PER_CHECK = 5;
const COUNT_COLUMN = 0;
const COUNT_WIDTH = 3;
const TABLE_COLUMN = 3;
const TABLE_WIDTH = 9;

const widgetsFor = (check: DataQualityCheck, index: number): PageLayoutWidgetManifest[] => {
  const row = index * ROWS_PER_CHECK;

  return [
    {
      universalIdentifier: check.countWidgetUniversalIdentifier,
      title: check.title,
      type: 'GRAPH',
      objectUniversalIdentifier: check.view.config.objectUniversalIdentifier,
      position: gridPosition(row, COUNT_COLUMN, ROWS_PER_CHECK, COUNT_WIDTH),
      configuration: {
        configurationType: 'AGGREGATE_CHART',
        aggregateFieldMetadataUniversalIdentifier: check.countFieldMetadataUniversalIdentifier,
        aggregateOperation: AggregateOperations.COUNT,
        filter: chartFilterFromView(check.view),
        ...CHART_DEFAULTS,
      },
    },
    // Rows are fixed where they are listed; record permissions still decide who can change what.
    recordTableWidget({
      universalIdentifier: check.tableWidgetUniversalIdentifier,
      title: check.title,
      view: check.view,
      position: gridPosition(row, TABLE_COLUMN, ROWS_PER_CHECK, TABLE_WIDTH),
      isUIEditable: true,
    }),
  ];
};

export default definePageLayoutTab({
  universalIdentifier: DATA_QUALITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: DATA_QUALITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Data quality',
  position: 0,
  icon: 'IconChecklist',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: DATA_QUALITY_CHECKS.flatMap(widgetsFor),
});
