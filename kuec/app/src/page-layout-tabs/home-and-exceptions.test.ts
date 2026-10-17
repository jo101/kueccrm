import {
  type defineView,
  type PageLayoutWidgetManifest,
} from 'twenty-sdk/define';
import { describe, expect, it } from 'vitest';

import { CURRENT_WORKSPACE_MEMBER_FILTER_VALUE } from 'src/constants/view-filter-values';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-work-package.field';
import exceptionsNavigationMenuItem from 'src/navigation-menu-items/exceptions.navigation-menu-item';
import homeNavigationMenuItem from 'src/navigation-menu-items/home.navigation-menu-item';
import myWorkNavigationMenuItem from 'src/navigation-menu-items/my-work.navigation-menu-item';
import exceptionsTab from 'src/page-layout-tabs/exceptions.page-layout-tab';
import homeTab from 'src/page-layout-tabs/home.page-layout-tab';
import exceptionsPageLayout from 'src/page-layouts/exceptions.page-layout';
import homePageLayout from 'src/page-layouts/home.page-layout';
import blockedView from 'src/views/blocked-work-packages.view';
import myWorkDueWithin7DaysView from 'src/views/home/home-my-work-due-within-7-days.view';
import needsYourDecisionView from 'src/views/home/home-needs-your-decision.view';
import otherWorkByStatusView from 'src/views/home/home-other-work-by-status.view';
import myWorkView from 'src/views/my-work.view';
import opportunitiesWithoutNextActionView from 'src/views/opportunities-without-next-action.view';
import overdueView from 'src/views/overdue-work-packages.view';
import submittedForMyReviewView from 'src/views/submitted-for-my-review.view';

type ViewDefinition = ReturnType<typeof defineView>;

const HOME_VIEWS = [needsYourDecisionView, myWorkDueWithin7DaysView, otherWorkByStatusView];

const tableConfigurationOf = (widget: PageLayoutWidgetManifest) => {
  if (widget.configuration.configurationType !== 'RECORD_TABLE') {
    throw new Error(`${widget.title} is not a table`);
  }

  return widget.configuration;
};

const filterKeysOf = (view: ViewDefinition) =>
  (view.config.filters ?? []).map((filter) =>
    JSON.stringify([filter.fieldMetadataUniversalIdentifier, filter.operand, filter.value]),
  );

// The guidance widget opens each page (src/i18n/guidance.json); the tables follow it.
const tablesOf = (widgets: PageLayoutWidgetManifest[] | undefined) =>
  (widgets ?? []).slice(1).map((widget) => ({
    title: widget.title,
    type: widget.type,
    viewUniversalIdentifier: tableConfigurationOf(widget).viewUniversalIdentifier,
    isUIEditable: tableConfigurationOf(widget).isUIEditable,
  }));

describe('Home and Exceptions pages', () => {
  it('are valid manifest entities', () => {
    for (const entity of [
      homePageLayout,
      exceptionsPageLayout,
      homeTab,
      exceptionsTab,
      homeNavigationMenuItem,
      exceptionsNavigationMenuItem,
      ...HOME_VIEWS,
    ]) {
      expect(entity.errors).toEqual([]);
    }
  });

  // A navigation menu item can only open a STANDALONE_PAGE layout.
  it('are standalone pages opened from the sidebar, above My work', () => {
    for (const [layout, item] of [
      [homePageLayout, homeNavigationMenuItem],
      [exceptionsPageLayout, exceptionsNavigationMenuItem],
    ] as const) {
      expect(layout.config.type).toBe('STANDALONE_PAGE');
      expect(item.config).toMatchObject({
        type: 'PAGE_LAYOUT',
        pageLayoutUniversalIdentifier: layout.config.universalIdentifier,
      });
      expect(item.config.position).toBeLessThan(myWorkNavigationMenuItem.config.position);
    }

    expect(homeNavigationMenuItem.config.position).toBeLessThan(
      exceptionsNavigationMenuItem.config.position,
    );
  });

  it('puts three read-only native tables on Home, fed by the Home views', () => {
    expect(homeTab.config.layoutMode).toBe('GRID');
    expect(tablesOf(homeTab.config.widgets)).toEqual([
      {
        title: 'Needs your decision',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: needsYourDecisionView.config.universalIdentifier,
        isUIEditable: false,
      },
      {
        title: 'Your next actions',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: myWorkDueWithin7DaysView.config.universalIdentifier,
        isUIEditable: false,
      },
      {
        title: 'Other work is progressing',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: otherWorkByStatusView.config.universalIdentifier,
        isUIEditable: false,
      },
    ]);
  });

  it('puts three editable native tables on Exceptions, over Blocked, Overdue and No next action', () => {
    expect(exceptionsTab.config.layoutMode).toBe('GRID');
    expect(tablesOf(exceptionsTab.config.widgets)).toEqual([
      {
        title: 'Blocked',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: blockedView.config.universalIdentifier,
        isUIEditable: true,
      },
      {
        title: 'Overdue',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: overdueView.config.universalIdentifier,
        isUIEditable: true,
      },
      {
        title: 'No next action',
        type: 'RECORD_TABLE',
        viewUniversalIdentifier: opportunitiesWithoutNextActionView.config.universalIdentifier,
        isUIEditable: true,
      },
    ]);
  });

  it('stacks each page full width, without overlaps', () => {
    for (const tab of [homeTab, exceptionsTab]) {
      let nextRow = 0;

      for (const widget of tab.config.widgets ?? []) {
        expect(widget.position, widget.title).toMatchObject({
          layoutMode: 'GRID',
          row: nextRow,
          column: 0,
          columnSpan: 12,
        });

        nextRow += widget.position?.layoutMode === 'GRID' ? widget.position.rowSpan : 0;
      }
    }
  });
});

describe('Home views', () => {
  it('Needs your decision is the Blocked view OR the Submitted for my review view', () => {
    const groups = needsYourDecisionView.config.filterGroups ?? [];
    const [rootGroup, ...childGroups] = groups;
    const filters = needsYourDecisionView.config.filters ?? [];
    const filterKeysInGroup = (groupUniversalIdentifier: string) =>
      filters
        .filter((filter) => filter.viewFilterGroupUniversalIdentifier === groupUniversalIdentifier)
        .map((filter) =>
          JSON.stringify([filter.fieldMetadataUniversalIdentifier, filter.operand, filter.value]),
        )
        .sort();

    expect(rootGroup).toMatchObject({ logicalOperator: 'OR' });
    expect(rootGroup.parentViewFilterGroupUniversalIdentifier).toBeUndefined();
    expect(childGroups).toHaveLength(2);

    for (const group of childGroups) {
      expect(group).toMatchObject({
        logicalOperator: 'AND',
        parentViewFilterGroupUniversalIdentifier: rootGroup.universalIdentifier,
      });
    }

    expect(childGroups.map((group) => filterKeysInGroup(group.universalIdentifier))).toEqual([
      filterKeysOf(blockedView).sort(),
      filterKeysOf(submittedForMyReviewView).sort(),
    ]);
  });

  it('Your next actions keeps every My work filter and narrows to late or due within 7 days', () => {
    const keys = filterKeysOf(myWorkDueWithin7DaysView);

    for (const myWorkKey of filterKeysOf(myWorkView)) {
      expect(keys).toContain(myWorkKey);
    }

    const dueFilters = (myWorkDueWithin7DaysView.config.filters ?? []).filter(
      (filter) => filter.viewFilterGroupUniversalIdentifier !== undefined,
    );

    expect(dueFilters.map(({ operand, value }) => [operand, value])).toEqual([
      ['IS_IN_PAST', ''],
      ['IS_RELATIVE', 'THIS_1_DAY;;Asia/Dubai;;MONDAY;;'],
      ['IS_RELATIVE', 'NEXT_7_DAY;;Asia/Dubai;;MONDAY;;'],
    ]);
    expect(myWorkDueWithin7DaysView.config.filterGroups).toEqual([
      expect.objectContaining({ logicalOperator: 'OR' }),
    ]);
  });

  it('Other work is progressing counts open work held by someone else, by status', () => {
    expect(otherWorkByStatusView.config.filters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldMetadataUniversalIdentifier: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
          operand: 'IS_NOT',
          value: CURRENT_WORKSPACE_MEMBER_FILTER_VALUE,
        }),
      ]),
    );
    expect(otherWorkByStatusView.config.mainGroupByFieldMetadataUniversalIdentifier).toBeDefined();
    expect(
      (otherWorkByStatusView.config.groups ?? [])
        .filter((group) => group.isVisible)
        .map((group) => group.fieldValue),
    ).toEqual(['OFFERED', 'ACCEPTED', 'SUBMITTED', 'BLOCKED']);
    expect(otherWorkByStatusView.config.fields?.[0].aggregateOperation).toBe('COUNT');
  });

  it('are widget views laid out like the other views: six columns, owner second, sorted on the third', () => {
    for (const view of HOME_VIEWS) {
      const columns = [...(view.config.fields ?? [])].sort(
        (left, right) => left.position - right.position,
      );

      expect(view.config.type, view.config.name).toBe('TABLE_WIDGET');
      expect(columns.length, view.config.name).toBeLessThanOrEqual(6);
      expect(columns[1].fieldMetadataUniversalIdentifier, view.config.name).toBe(
        OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
      );
      expect(view.config.sorts?.[0].fieldMetadataUniversalIdentifier, view.config.name).toBe(
        columns[2].fieldMetadataUniversalIdentifier,
      );
    }
  });
});
