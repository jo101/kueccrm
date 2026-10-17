import {
  PageLayoutTabLayoutMode,
  type PageLayoutWidgetGridPosition,
  type PageLayoutWidgetManifest,
  type ViewConfig,
} from 'twenty-sdk/define';

import {
  buildGuidanceBody,
  GUIDANCE_WIDGET_TITLE,
} from '../../i18n/guidance-widget-body';

type DashboardView = {
  config: Pick<
    ViewConfig,
    'universalIdentifier' | 'objectUniversalIdentifier' | 'filters' | 'filterGroups'
  >;
};

export const DASHBOARD_TIMEZONE = 'Asia/Dubai';
// CalendarStartDay.MONDAY
export const DASHBOARD_FIRST_DAY_OF_THE_WEEK = 1;

export const CHART_DEFAULTS = {
  displayDataLabel: true,
  timezone: DASHBOARD_TIMEZONE,
  firstDayOfTheWeek: DASHBOARD_FIRST_DAY_OF_THE_WEEK,
} as const;

export const BAR_CHART_DEFAULTS = {
  ...CHART_DEFAULTS,
  layout: 'VERTICAL',
  axisNameDisplay: 'NONE',
  color: 'auto',
} as const;

export const gridPosition = (
  row: number,
  column: number,
  rowSpan: number,
  columnSpan: number,
): PageLayoutWidgetGridPosition => ({
  layoutMode: PageLayoutTabLayoutMode.GRID,
  row,
  column,
  rowSpan,
  columnSpan,
});

// The chart counts exactly the records its table lists: both read the filters
// of the same widget view, so the two cannot drift apart.
export const chartFilterFromView = (view: DashboardView) => ({
  recordFilters: (view.config.filters ?? []).map((filter) => ({
    fieldMetadataUniversalIdentifier: filter.fieldMetadataUniversalIdentifier,
    operand: filter.operand,
    value:
      typeof filter.value === 'string'
        ? filter.value
        : JSON.stringify(filter.value),
    recordFilterGroupId: filter.viewFilterGroupUniversalIdentifier,
    subFieldName: filter.subFieldName,
    relationTargetFieldMetadataUniversalIdentifier:
      filter.relationTargetFieldMetadataUniversalIdentifier,
  })),
  recordFilterGroups: (view.config.filterGroups ?? []).map((filterGroup) => ({
    id: filterGroup.universalIdentifier,
    logicalOperator: filterGroup.logicalOperator,
    parentRecordFilterGroupId:
      filterGroup.parentViewFilterGroupUniversalIdentifier,
  })),
});

export const recordTableWidget = ({
  universalIdentifier,
  title,
  view,
  position,
  isUIEditable = false,
}: {
  universalIdentifier: string;
  title: string;
  view: DashboardView;
  position: PageLayoutWidgetGridPosition;
  isUIEditable?: boolean;
}): PageLayoutWidgetManifest => ({
  universalIdentifier,
  title,
  type: 'RECORD_TABLE',
  objectUniversalIdentifier: view.config.objectUniversalIdentifier,
  position,
  configuration: {
    configurationType: 'RECORD_TABLE',
    viewUniversalIdentifier: view.config.universalIdentifier,
    isUIEditable,
  },
});

// Ten short lines, five per language, at the full width of the grid.
export const GUIDANCE_ROW_SPAN = 6;
const GRID_COLUMNS = 12;

export const guidanceTabWidget = ({
  universalIdentifier,
  guidancePageKey,
}: {
  universalIdentifier: string;
  guidancePageKey: string;
}): PageLayoutWidgetManifest => ({
  universalIdentifier,
  title: GUIDANCE_WIDGET_TITLE.DASHBOARD_TAB,
  type: 'STANDALONE_RICH_TEXT',
  position: gridPosition(0, 0, GUIDANCE_ROW_SPAN, GRID_COLUMNS),
  configuration: {
    configurationType: 'STANDALONE_RICH_TEXT',
    body: buildGuidanceBody(guidancePageKey),
  },
});

// Every tab opens with its guidance; the widgets keep their layout, one guidance height lower.
export const belowGuidance = (
  widgets: PageLayoutWidgetManifest[],
): PageLayoutWidgetManifest[] =>
  widgets.map((widget) =>
    widget.position?.layoutMode === PageLayoutTabLayoutMode.GRID
      ? {
          ...widget,
          position: { ...widget.position, row: widget.position.row + GUIDANCE_ROW_SPAN },
        }
      : widget,
  );
