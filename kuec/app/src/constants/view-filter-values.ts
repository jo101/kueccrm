export const CURRENT_WORKSPACE_MEMBER_FILTER_VALUE = JSON.stringify({
  isCurrentWorkspaceMemberSelected: true,
  selectedRecordIds: [],
});

// Relative date filters carry their own timezone and week start, so "this week"
// is the Asia/Dubai week from Monday whatever the viewer's browser is set to.
export const THIS_WEEK_FILTER_VALUE = 'THIS_1_WEEK;;Asia/Dubai;;MONDAY;;';
export const THIS_MONTH_FILTER_VALUE = 'THIS_1_MONTH;;Asia/Dubai;;MONDAY;;';
export const THIS_QUARTER_FILTER_VALUE = 'THIS_1_QUARTER;;Asia/Dubai;;MONDAY;;';
export const THIS_YEAR_FILTER_VALUE = 'THIS_1_YEAR;;Asia/Dubai;;MONDAY;;';
export const TODAY_FILTER_VALUE = 'THIS_1_DAY;;Asia/Dubai;;MONDAY;;';

// A PAST or NEXT window stops at the current period, so "the past 12 months"
// is the past 11 months OR this month, and "within N days" is today OR the next N days.
export const PAST_11_MONTHS_FILTER_VALUE = 'PAST_11_MONTH;;Asia/Dubai;;MONDAY;;';
export const NEXT_7_DAYS_FILTER_VALUE = 'NEXT_7_DAY;;Asia/Dubai;;MONDAY;;';
export const NEXT_30_DAYS_FILTER_VALUE = 'NEXT_30_DAY;;Asia/Dubai;;MONDAY;;';
export const NEXT_90_DAYS_FILTER_VALUE = 'NEXT_90_DAY;;Asia/Dubai;;MONDAY;;';
