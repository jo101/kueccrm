import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  type definePageLayoutTab,
  type defineView,
  type PageLayoutWidgetManifest,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from 'src/constants/view-filter-values';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-contract.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-engagement.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-lead.field';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-milestone.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-project.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-work-package.field';
import { REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/referred-by-member-on-lead.field';
import { REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/reviewer-on-work-package.field';
import executiveTab, {
  BD_THURSDAY_UPDATE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/page-layout-tabs/bd-executive.page-layout-tab';
import mineTab from 'src/page-layout-tabs/bd-mine.page-layout-tab';
import teamTab from 'src/page-layout-tabs/bd-team.page-layout-tab';
import { chartFilterFromView } from 'src/page-layout-tabs/utils/dashboard-widgets';

type TabDefinition = ReturnType<typeof definePageLayoutTab>;
type ViewDefinition = ReturnType<typeof defineView>;

const GRID_COLUMNS = 12;
const GRID_MAX_ROWS = 100;
const MAX_VISIBLE_COLUMNS = 6;
const WIDGET_VIEW_DIRECTORY = join(__dirname, '..', 'views', 'dashboard');

const OWNER_FIELDS = [
  OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.fields.owner.universalIdentifier,
];

const SECOND_COLUMN_OWNER_FIELDS = [
  ...OWNER_FIELDS,
  OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.accountOwner.universalIdentifier,
];

const TABS: TabDefinition[] = [executiveTab, teamTab, mineTab];

const gridOf = (widget: PageLayoutWidgetManifest) => {
  const position = widget.position;

  if (position?.layoutMode !== 'GRID') {
    throw new Error(`${widget.title} is not on the grid`);
  }

  return position;
};

const rowsOverlap = (
  left: PageLayoutWidgetManifest,
  right: PageLayoutWidgetManifest,
): boolean => {
  const a = gridOf(left);
  const b = gridOf(right);

  return a.row < b.row + b.rowSpan && b.row < a.row + a.rowSpan;
};

const cellsOverlap = (
  left: PageLayoutWidgetManifest,
  right: PageLayoutWidgetManifest,
): boolean => {
  const a = gridOf(left);
  const b = gridOf(right);

  return (
    rowsOverlap(left, right) &&
    a.column < b.column + b.columnSpan &&
    b.column < a.column + a.columnSpan
  );
};

const widgetsOf = (tab: TabDefinition) => tab.config.widgets ?? [];

describe('BD dashboard', () => {
  const viewsByUniversalIdentifier = new Map<string, ViewDefinition>();

  beforeAll(async () => {
    const fileNames = readdirSync(WIDGET_VIEW_DIRECTORY).filter((fileName) =>
      fileName.endsWith('.view.ts'),
    );
    const modules = await Promise.all(
      fileNames.map(
        (fileName) =>
          import(join(WIDGET_VIEW_DIRECTORY, fileName)) as Promise<{
            default: ViewDefinition;
          }>,
      ),
    );

    for (const { default: view } of modules) {
      viewsByUniversalIdentifier.set(view.config.universalIdentifier, view);
    }
  });

  const viewOf = (widget: PageLayoutWidgetManifest): ViewDefinition => {
    const configuration = widget.configuration;

    if (configuration.configurationType !== 'RECORD_TABLE') {
      throw new Error(`${widget.title} is not a table`);
    }

    const view = viewsByUniversalIdentifier.get(
      configuration.viewUniversalIdentifier ?? '',
    );

    if (view === undefined) {
      throw new Error(`${widget.title} reads a view outside src/views/dashboard`);
    }

    return view;
  };

  it('tabs and widget views are valid manifest entities', () => {
    for (const tab of TABS) {
      expect(tab.errors, tab.config.title).toEqual([]);
    }

    for (const view of viewsByUniversalIdentifier.values()) {
      expect(view.errors, view.config.name).toEqual([]);
    }
  });

  it('keeps every widget inside the grid, without overlaps', () => {
    for (const tab of TABS) {
      const widgets = widgetsOf(tab);

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
    }
  });

  it('puts a table beside every chart, listing exactly the records it counts', () => {
    for (const tab of TABS) {
      const widgets = widgetsOf(tab);
      const tables = widgets.filter((widget) => widget.type === 'RECORD_TABLE');

      for (const chart of widgets.filter((widget) => widget.type === 'GRAPH')) {
        const besideChart = tables.filter((table) => rowsOverlap(chart, table));
        const chartFilter =
          'filter' in chart.configuration ? chart.configuration.filter : undefined;

        expect(
          besideChart.some((table) =>
            JSON.stringify(chartFilterFromView(viewOf(table))) ===
            JSON.stringify(chartFilter),
          ),
          chart.title,
        ).toBe(true);
      }
    }
  });

  it('opens Executive with the Thursday update', () => {
    const [firstWidget] = widgetsOf(executiveTab);

    expect(firstWidget.universalIdentifier).toBe(
      BD_THURSDAY_UPDATE_WIDGET_UNIVERSAL_IDENTIFIER,
    );
    expect(gridOf(firstWidget)).toMatchObject({ row: 0, column: 0, columnSpan: GRID_COLUMNS });
  });

  it('puts the owner, the reviewer or the referrer on the X axis of every Team chart', () => {
    for (const chart of widgetsOf(teamTab).filter((widget) => widget.type === 'GRAPH')) {
      const configuration = chart.configuration;

      expect(configuration.configurationType, chart.title).toBe('BAR_CHART');

      if (configuration.configurationType === 'BAR_CHART') {
        expect(
          [
            ...OWNER_FIELDS,
            REVIEWER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
            REFERRED_BY_MEMBER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
          ],
          chart.title,
        ).toContain(configuration.primaryAxisGroupByFieldMetadataUniversalIdentifier);
      }
    }
  });

  it('allows editing on the Team board only', () => {
    for (const tab of TABS) {
      for (const table of widgetsOf(tab).filter((widget) => widget.type === 'RECORD_TABLE')) {
        const configuration = table.configuration;
        const isBoard = viewOf(table).config.type === 'KANBAN_WIDGET';

        expect(
          configuration.configurationType === 'RECORD_TABLE' && configuration.isUIEditable,
          table.title,
        ).toBe(isBoard && tab === teamTab);
      }
    }
  });

  it('filters every Mine widget to records owned by the viewer', () => {
    for (const table of widgetsOf(mineTab).filter((widget) => widget.type === 'RECORD_TABLE')) {
      expect(
        viewOf(table).config.filters?.some(
          (filter) =>
            OWNER_FIELDS.includes(filter.fieldMetadataUniversalIdentifier) &&
            filter.operand === 'IS' &&
            filter.value === CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
        ),
        table.title,
      ).toBe(true);
    }
  });

  it('builds widget views like the other views: widget types, six columns, owner second, sorted on the third', () => {
    for (const view of viewsByUniversalIdentifier.values()) {
      const columns = [...(view.config.fields ?? [])].sort(
        (left, right) => left.position - right.position,
      );

      expect(['TABLE_WIDGET', 'KANBAN_WIDGET'], view.config.name).toContain(view.config.type);
      expect(columns.filter((column) => column.isVisible !== false).length, view.config.name)
        .toBeLessThanOrEqual(MAX_VISIBLE_COLUMNS);
      expect(SECOND_COLUMN_OWNER_FIELDS, view.config.name).toContain(
        columns[1]?.fieldMetadataUniversalIdentifier,
      );

      const [sort] = view.config.sorts ?? [];

      if (sort !== undefined) {
        expect(sort.fieldMetadataUniversalIdentifier, view.config.name).toBe(
          columns[2]?.fieldMetadataUniversalIdentifier,
        );
      }
    }
  });

  it('gives every widget view to exactly one table', () => {
    const tables = TABS.flatMap(widgetsOf).filter((widget) => widget.type === 'RECORD_TABLE');
    const viewIds = tables.map((table) => viewOf(table).config.universalIdentifier);

    expect(new Set(viewIds).size).toBe(viewIds.length);
    expect(new Set(viewIds)).toEqual(new Set(viewsByUniversalIdentifier.keys()));
  });
});
