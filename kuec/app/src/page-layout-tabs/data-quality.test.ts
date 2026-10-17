import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  type defineView,
  type PageLayoutWidgetManifest,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { STATUSES_WITH_DUE_TIMER } from 'src/automation/timers/work-package-timers';
import { DEPARTMENT } from 'src/constants/taxonomy';
import {
  CLOSED_OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE,
} from 'src/constants/opportunity-stage';
import { DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/decision-role-on-person.field';
import {
  FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_FUNDING_PATH,
} from 'src/fields/funding-path-on-opportunity.field';
import {
  OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_OFFERING,
} from 'src/fields/offering-on-opportunity.field';
import { OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/other-details-on-company.field';
import { OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/other-details-on-opportunity.field';
import { OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/other-details-on-task.field';
import { PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/parked-lapses-at-on-opportunity.field';
import {
  OPPORTUNITY_TYPE,
  PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/fields/playbook-type-on-opportunity.field';
import {
  COMPANY_RELATIONSHIP_TYPE,
  RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/fields/relationship-type-on-company.field';
import {
  COMPANY_SECTOR,
  SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/fields/sector-on-company.field';
import { SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/size-class-on-company.field';
import {
  OPPORTUNITY_SOURCE,
  SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/fields/source-on-opportunity.field';
import { STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/stale-from-on-opportunity.field';
import {
  TASK_TYPE,
  TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/fields/task-type-on-task.field';
import dataQualityNavigationMenuItem from 'src/navigation-menu-items/data-quality.navigation-menu-item';
import {
  CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_KIND,
  CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_STATUS,
  CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/contract.object';
import {
  ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_KIND,
  ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_OUTCOME_TYPE,
  ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/engagement.object';
import {
  MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/milestone.object';
import {
  PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_TYPE,
} from 'src/objects/project.object';
import {
  WORK_PACKAGE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/work-package.object';
import dataQualityTab, {
  DATA_QUALITY_CHECKS,
} from 'src/page-layout-tabs/data-quality.page-layout-tab';
import { chartFilterFromView } from 'src/page-layout-tabs/utils/dashboard-widgets';
import dataQualityPageLayout from 'src/page-layouts/data-quality.page-layout';
import companiesMissingKeyFieldsView from 'src/views/companies-missing-key-fields.view';
import companiesOtherWithoutDetailsView from 'src/views/companies-other-without-details.view';
import contractsOtherWithoutDetailsView from 'src/views/contracts-other-without-details.view';
import contractsPastExpiryStillSignedView from 'src/views/contracts-past-expiry-still-signed.view';
import engagementsOtherWithoutDetailsView from 'src/views/engagements-other-without-details.view';
import engagementsOutcomeOverdueView from 'src/views/engagements-outcome-overdue.view';
import milestonesOtherWithoutDetailsView from 'src/views/milestones-other-without-details.view';
import opportunitiesInQualifyOver30DaysView from 'src/views/opportunities-in-qualify-over-30-days.view';
import opportunitiesMissingKeyFieldsView from 'src/views/opportunities-missing-key-fields.view';
import opportunitiesOtherWithoutDetailsView from 'src/views/opportunities-other-without-details.view';
import opportunitiesParkedOver90DaysView from 'src/views/opportunities-parked-over-90-days.view';
import peopleMissingEmailOrDecisionRoleView from 'src/views/people-missing-email-or-decision-role.view';
import projectsOtherWithoutDetailsView from 'src/views/projects-other-without-details.view';
import tasksOtherWithoutDetailsView from 'src/views/tasks-other-without-details.view';
import workPackagesOtherWithoutDetailsView from 'src/views/work-packages-other-without-details.view';
import workPackagesWithoutDoneCriteriaView from 'src/views/work-packages-without-done-criteria.view';

type ViewDefinition = ReturnType<typeof defineView>;

const GRID_COLUMNS = 12;
const GRID_MAX_ROWS = 100;
const HYGIENE_VIEW_PREFIX = 'Hygiene: ';
const VIEW_DIRECTORY = join(__dirname, '..', 'views');

const { opportunity, company, person } = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// The brief's gaps, in the order the ops coordinator runs them on Monday, then
// the Other checks of runbooks/18-taxonomy.md.
const EXCEPTION_VIEWS_IN_ORDER: ViewDefinition[] = [
  opportunitiesMissingKeyFieldsView,
  companiesMissingKeyFieldsView,
  peopleMissingEmailOrDecisionRoleView,
  engagementsOutcomeOverdueView,
  workPackagesWithoutDoneCriteriaView,
  opportunitiesInQualifyOver30DaysView,
  opportunitiesParkedOver90DaysView,
  contractsPastExpiryStillSignedView,
  opportunitiesOtherWithoutDetailsView,
  companiesOtherWithoutDetailsView,
  engagementsOtherWithoutDetailsView,
  contractsOtherWithoutDetailsView,
  projectsOtherWithoutDetailsView,
  workPackagesOtherWithoutDetailsView,
  milestonesOtherWithoutDetailsView,
  tasksOtherWithoutDetailsView,
];

type FilterKey = [string, string, unknown];

// Filters every row must match, then filters of which any one is enough.
const EXPECTED_FILTERS: [ViewDefinition, { all: FilterKey[]; anyOf: FilterKey[] }][] = [
  [
    opportunitiesMissingKeyFieldsView,
    {
      all: [[opportunity.fields.stage.universalIdentifier, 'IS_NOT', CLOSED_OPPORTUNITY_STAGES]],
      anyOf: [
        [PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [opportunity.fields.owner.universalIdentifier, 'IS_EMPTY', ''],
        [opportunity.fields.amount.universalIdentifier, 'IS_EMPTY', ''],
        [opportunity.fields.closeDate.universalIdentifier, 'IS_EMPTY', ''],
      ],
    },
  ],
  [
    companiesMissingKeyFieldsView,
    {
      all: [],
      anyOf: [
        [SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [SIZE_CLASS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [company.fields.accountOwner.universalIdentifier, 'IS_EMPTY', ''],
      ],
    },
  ],
  [
    peopleMissingEmailOrDecisionRoleView,
    {
      all: [],
      anyOf: [
        [person.fields.emails.universalIdentifier, 'IS_EMPTY', ''],
        [DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
      ],
    },
  ],
  [
    engagementsOutcomeOverdueView,
    {
      all: [
        [ENGAGEMENT_OUTCOME_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [ENGAGEMENT_OUTCOME_DUE_AT_FIELD_UNIVERSAL_IDENTIFIER, 'IS_IN_PAST', ''],
      ],
      anyOf: [],
    },
  ],
  [
    workPackagesWithoutDoneCriteriaView,
    {
      all: [
        [WORK_PACKAGE_DONE_CRITERIA_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [
          WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
          'IS',
          [WORK_PACKAGE_STATUS.PLANNED, ...STATUSES_WITH_DUE_TIMER],
        ],
      ],
      anyOf: [],
    },
  ],
  [
    opportunitiesInQualifyOver30DaysView,
    {
      all: [
        [opportunity.fields.stage.universalIdentifier, 'IS', [OPPORTUNITY_STAGE.NEW]],
        [STALE_FROM_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_IN_PAST', ''],
      ],
      anyOf: [],
    },
  ],
  [
    opportunitiesParkedOver90DaysView,
    {
      all: [
        [opportunity.fields.stage.universalIdentifier, 'IS', [OPPORTUNITY_STAGE.PARKED]],
        [PARKED_LAPSES_AT_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_IN_PAST', ''],
      ],
      anyOf: [],
    },
  ],
  [
    contractsPastExpiryStillSignedView,
    {
      all: [
        [CONTRACT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [CONTRACT_STATUS.SIGNED]],
        [CONTRACT_EXPIRES_ON_FIELD_UNIVERSAL_IDENTIFIER, 'IS_IN_PAST', ''],
      ],
      anyOf: [],
    },
  ],
  [
    opportunitiesOtherWithoutDetailsView,
    {
      all: [
        [OTHER_DETAILS_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [opportunity.fields.stage.universalIdentifier, 'IS_NOT', [OPPORTUNITY_STAGE.LOST, OPPORTUNITY_STAGE.PARKED]],
      ],
      anyOf: [
        [SOURCE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [OPPORTUNITY_SOURCE.OTHER]],
        [PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [OPPORTUNITY_TYPE.OTHER]],
        [OFFERING_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'CONTAINS', [OPPORTUNITY_OFFERING.OTHER]],
        [FUNDING_PATH_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [OPPORTUNITY_FUNDING_PATH.OTHER]],
      ],
    },
  ],
  [
    companiesOtherWithoutDetailsView,
    {
      all: [[OTHER_DETAILS_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', '']],
      anyOf: [
        [SECTOR_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [COMPANY_SECTOR.OTHER]],
        [RELATIONSHIP_TYPE_ON_COMPANY_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [COMPANY_RELATIONSHIP_TYPE.OTHER]],
      ],
    },
  ],
  [
    engagementsOtherWithoutDetailsView,
    {
      all: [[ENGAGEMENT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', '']],
      anyOf: [
        [ENGAGEMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [ENGAGEMENT_KIND.OTHER]],
        [ENGAGEMENT_OUTCOME_TYPE_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [ENGAGEMENT_OUTCOME_TYPE.OTHER]],
        [ENGAGEMENT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [DEPARTMENT.OTHER]],
      ],
    },
  ],
  [
    contractsOtherWithoutDetailsView,
    {
      all: [[CONTRACT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', '']],
      anyOf: [
        [CONTRACT_KIND_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [CONTRACT_KIND.OTHER]],
        [CONTRACT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [DEPARTMENT.OTHER]],
      ],
    },
  ],
  [
    projectsOtherWithoutDetailsView,
    {
      all: [[PROJECT_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', '']],
      anyOf: [
        [PROJECT_PLAYBOOK_TYPE_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [PROJECT_TYPE.OTHER]],
        [PROJECT_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [DEPARTMENT.OTHER]],
      ],
    },
  ],
  [
    workPackagesOtherWithoutDetailsView,
    {
      all: [
        [WORK_PACKAGE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [WORK_PACKAGE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [DEPARTMENT.OTHER]],
      ],
      anyOf: [],
    },
  ],
  [
    milestonesOtherWithoutDetailsView,
    {
      all: [
        [MILESTONE_OTHER_DETAILS_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [MILESTONE_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [DEPARTMENT.OTHER]],
      ],
      anyOf: [],
    },
  ],
  [
    tasksOtherWithoutDetailsView,
    {
      all: [
        [OTHER_DETAILS_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER, 'IS_EMPTY', ''],
        [TASK_TYPE_ON_TASK_FIELD_UNIVERSAL_IDENTIFIER, 'IS', [TASK_TYPE.OTHER]],
      ],
      anyOf: [],
    },
  ],
];

const gridOf = (widget: PageLayoutWidgetManifest) => {
  const position = widget.position;

  if (position?.layoutMode !== 'GRID') {
    throw new Error(`${widget.title} is not on the grid`);
  }

  return position;
};

const rowsOverlap = (left: PageLayoutWidgetManifest, right: PageLayoutWidgetManifest) => {
  const a = gridOf(left);
  const b = gridOf(right);

  return a.row < b.row + b.rowSpan && b.row < a.row + a.rowSpan;
};

const cellsOverlap = (left: PageLayoutWidgetManifest, right: PageLayoutWidgetManifest) => {
  const a = gridOf(left);
  const b = gridOf(right);

  return (
    rowsOverlap(left, right) &&
    a.column < b.column + b.columnSpan &&
    b.column < a.column + a.columnSpan
  );
};

const keyOf = ([field, operand, value]: FilterKey) => JSON.stringify([field, operand, value]);

const filterKeysOf = (view: ViewDefinition, inGroup: boolean) =>
  (view.config.filters ?? [])
    .filter((filter) => (filter.viewFilterGroupUniversalIdentifier !== undefined) === inGroup)
    .map((filter) =>
      keyOf([filter.fieldMetadataUniversalIdentifier, filter.operand, filter.value]),
    )
    .sort();

const widgets = dataQualityTab.config.widgets ?? [];
const counts = widgets.filter((widget) => widget.type === 'GRAPH');
const tables = widgets.filter((widget) => widget.type === 'RECORD_TABLE');

const tableViewIdOf = (widget: PageLayoutWidgetManifest) =>
  widget.configuration.configurationType === 'RECORD_TABLE'
    ? widget.configuration.viewUniversalIdentifier
    : undefined;

describe('Data quality page', () => {
  it('is a valid standalone page with its own sidebar entry', () => {
    for (const entity of [
      dataQualityPageLayout,
      dataQualityTab,
      dataQualityNavigationMenuItem,
      ...EXCEPTION_VIEWS_IN_ORDER,
    ]) {
      expect(entity.errors).toEqual([]);
    }

    expect(dataQualityPageLayout.config.type).toBe('STANDALONE_PAGE');
    expect(dataQualityNavigationMenuItem.config).toMatchObject({
      type: 'PAGE_LAYOUT',
      pageLayoutUniversalIdentifier: dataQualityPageLayout.config.universalIdentifier,
    });
    expect(dataQualityTab.config.pageLayoutUniversalIdentifier).toBe(
      dataQualityPageLayout.config.universalIdentifier,
    );
  });

  it('pairs one count with one table per exception view, in the Monday order', () => {
    expect(counts).toHaveLength(EXCEPTION_VIEWS_IN_ORDER.length);
    expect(tables.map(tableViewIdOf)).toEqual(
      EXCEPTION_VIEWS_IN_ORDER.map((view) => view.config.universalIdentifier),
    );
    expect(DATA_QUALITY_CHECKS.map((check) => check.view.config.universalIdentifier)).toEqual(
      EXCEPTION_VIEWS_IN_ORDER.map((view) => view.config.universalIdentifier),
    );
  });

  it('counts exactly the records the table beside it lists', () => {
    for (const [index, view] of EXCEPTION_VIEWS_IN_ORDER.entries()) {
      const count = counts[index];
      const table = tables[index];
      const configuration = count.configuration;

      expect(rowsOverlap(count, table), count.title).toBe(true);
      expect(count.title).toBe(table.title);
      expect(count.objectUniversalIdentifier, count.title).toBe(
        view.config.objectUniversalIdentifier,
      );
      expect(configuration).toMatchObject({
        configurationType: 'AGGREGATE_CHART',
        aggregateOperation: 'COUNT',
      });
      expect(
        'filter' in configuration ? JSON.stringify(configuration.filter) : undefined,
        count.title,
      ).toBe(JSON.stringify(chartFilterFromView(view)));
    }
  });

  it('lets rows be fixed where they are listed', () => {
    for (const table of tables) {
      expect(
        table.configuration.configurationType === 'RECORD_TABLE' &&
          table.configuration.isUIEditable,
        table.title,
      ).toBe(true);
    }
  });

  it('keeps every widget inside the grid, without overlaps', () => {
    for (const widget of widgets) {
      const { row, column, rowSpan, columnSpan } = gridOf(widget);

      expect(column + columnSpan, widget.title).toBeLessThanOrEqual(GRID_COLUMNS);
      expect(row + rowSpan, widget.title).toBeLessThanOrEqual(GRID_MAX_ROWS);
    }

    widgets.forEach((widget, index) => {
      for (const other of widgets.slice(index + 1)) {
        expect(cellsOverlap(widget, other), `${widget.title} / ${other.title}`).toBe(false);
      }
    });
  });
});

describe('Exception views', () => {
  let hygieneViews: ViewDefinition[] = [];

  beforeAll(async () => {
    const modules = await Promise.all(
      readdirSync(VIEW_DIRECTORY)
        .filter((fileName) => fileName.endsWith('.view.ts'))
        .map(
          (fileName) =>
            import(join(VIEW_DIRECTORY, fileName)) as Promise<{ default: ViewDefinition }>,
        ),
    );

    hygieneViews = modules
      .map((viewModule) => viewModule.default)
      .filter((view) => view.config.name.startsWith(HYGIENE_VIEW_PREFIX));
  });

  it('are picker views, each one on the Data quality page', () => {
    expect(
      hygieneViews.map((view) => view.config.universalIdentifier).sort(),
    ).toEqual(EXCEPTION_VIEWS_IN_ORDER.map((view) => view.config.universalIdentifier).sort());

    for (const view of EXCEPTION_VIEWS_IN_ORDER) {
      expect(view.config.type, view.config.name).toBe('TABLE');
    }
  });

  it('filter on the gap they are named for', () => {
    for (const [view, { all, anyOf }] of EXPECTED_FILTERS) {
      expect(filterKeysOf(view, false), view.config.name).toEqual(all.map(keyOf).sort());
      expect(filterKeysOf(view, true), view.config.name).toEqual(anyOf.map(keyOf).sort());

      const groups = view.config.filterGroups ?? [];

      expect(groups.map((group) => group.logicalOperator), view.config.name).toEqual(
        anyOf.length > 0 ? ['OR'] : [],
      );
    }
  });
});
