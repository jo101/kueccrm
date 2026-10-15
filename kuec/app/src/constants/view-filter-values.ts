export const CURRENT_WORKSPACE_MEMBER_FILTER_VALUE = JSON.stringify({
  isCurrentWorkspaceMemberSelected: true,
  selectedRecordIds: [],
});

// Relative date filters carry their own timezone and week start, so "this week"
// is the Asia/Dubai week from Monday whatever the viewer's browser is set to.
export const THIS_WEEK_FILTER_VALUE = 'THIS_1_WEEK;;Asia/Dubai;;MONDAY;;';
export const THIS_MONTH_FILTER_VALUE = 'THIS_1_MONTH;;Asia/Dubai;;MONDAY;;';
export const THIS_QUARTER_FILTER_VALUE = 'THIS_1_QUARTER;;Asia/Dubai;;MONDAY;;';
