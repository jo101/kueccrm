import {
  PageLayoutTabLayoutMode,
  type PageLayoutWidgetGridPosition,
  type PageLayoutWidgetManifest,
  type ViewConfig,
} from 'twenty-sdk/define';

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
