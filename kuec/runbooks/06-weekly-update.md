# 06: The BD dashboard and the weekly update

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.3.0. Owner: the ED. Readers: the ED (Thursday), the whole team (Monday), engineers (sections 4 to 7).

The dashboard is **BD Executive** in the sidebar (called **BD** before 0.5.0). It has three tabs: **Executive**, **Team** and **Mine**; the sidebar's **BD Team** opens the same page on Team. Every chart has a table beside it, and the table lists exactly the records the chart counts. Read the chart, then read the table to see the records behind it. All periods are Asia/Dubai, and weeks start on Monday.

## 1. Thursday: the update, read from Executive top to bottom

1. Open **BD > Executive**. Press Cmd+K (Ctrl+K on Windows), choose **Edit Layout**, and clear last week's notes under the three bold lines of **Thursday update**. Keep the bold lines themselves.
2. **Signed licences this year** (n / 2): add every licence in the table beside it that was signed since last Thursday to "What closed".
3. **Signed contract value this year**: add each new row of **Contracts signed this year** to "What closed", with its value.
4. **Open pipeline by stage** (count, then Amount, then by probability): note where the value sits and what moved since last week. The probability split stands in for a weighted pipeline.
5. **Open pipeline by type**, **by company sector**, and **Opportunities created per month, by source**: if a source or sector has gone quiet, add it to "Next week".
6. **Closing this quarter** (count and Amount): read every row. Anything that will not close this quarter needs a new close date from its owner; list those under "Next week".
7. **Stale: in stage for more than 30 days**: each stale row gets a next action from its owner, or moves to Parked. Put any row that needs your decision under "What is blocked".
8. **Won and lost by month** and **Lost by reason**: add this week's wins to "What closed". A lost reason that shows up twice this quarter gets one line.
9. **Tier 1 and 2 accounts not engaged in 60 days**, **Contracts in negotiation** and **Contracts expiring in 90 days**: give each row an owner and an action for next week. A negotiation waiting on you goes under "What is blocked".
10. **Active projects by health** and **Milestones due in 30 days**: Red and Amber projects go under "What is blocked", with the decision you need. Then press **Save** and paste the three lines into the update.

## 2. Monday: the standup, read from Team

1. Open **BD > Team**. Look at **Open work packages per owner, by status**. If one person carries clearly more than the others, reassign before the round, on the board at the bottom.
2. Go through **Overdue**, **Blocked** and **Offered, not accepted** per owner. Each owner in turn either gives a new due date, says what unblocks the work and who does it, or accepts or declines on the spot.
3. **Submitted, awaiting review, per reviewer**: each reviewer names the day this week they will do the review.
4. Look at **Open opportunities per owner, by stage**, **No next action per owner**, **Engagements this month per owner, by kind** and **Active projects per owner, by health**. Every opportunity without a next action gets one, with a date, before the meeting ends.
5. Walk **Open work packages by status** one column at a time (Offered, Accepted, Submitted, Blocked). Move cards and fix owners and due dates as people report, so the board matches the room.

On the board, drag cards between Offered, Accepted and Submitted. To set Blocked, open the card and fill in Blocked reason in the same edit: the ED is notified with the reason. A card dragged to Blocked without a reason notifies the ED with "Reason: none given".

## 3. The Thursday update text

- **Who can edit it:** anyone whose role has the **Layouts** permission. Only the ED's Admin role has it. BD staff see the text but cannot change it.
- **How:** follow step 1 of section 1. **Save** keeps the text until the next edit.
- **App upgrades:** the widget belongs to the app. Each `app:install` of `kuec-bd-ops` resets it to the three empty lines, because an app install re-applies the widget's configuration. Upgrade the app after Thursday's update has gone out, never before.

## 4. What each widget counts

"Open" opportunities are every stage except Signed, Lost and Parked. "Open" work packages are Offered, Accepted, Submitted and Blocked. Each table is backed by a widget view in `kuec/app/src/views/dashboard/`. These views do not appear in the view picker.

### Executive

| Chart | Records (the table beside it) |
| --- | --- |
| Thursday update (rich text) | none |
| Signed licences this year (count, suffix "/ 2") | Type Licence, stage Signed, Stage entered at this year |
| Signed contract value this year (sum of Value, prefix AED) | Contracts Signed, Expired or Terminated with Signed on this year |
| Open pipeline by stage: count; Amount; Amount stacked by probability | Open opportunities |
| Open pipeline by type (Amount); by company sector (pie, Amount) | Open opportunities |
| Opportunities created per month, by source (stacked) | Created in the past 11 months or this month |
| Closing this quarter (count; Amount) | Open, Close date this quarter |
| Stale: in stage for more than 30 days (count) | Open, Stale from in the past |
| Won and lost by month, this quarter | Stage Signed or Lost, Stage entered at this quarter |
| Lost by reason, this quarter (pie) | Stage Lost, Stage entered at this quarter |
| Tier 1 and 2 accounts not engaged in 60 days (count) | Account tier 1 or 2, Engagement lapses at in the past |
| Contracts in negotiation (count) | Status In negotiation |
| Contracts expiring in 90 days (count) | Status Signed, Expires on today or in the next 90 days |
| Active projects by health | Status Active |
| Milestones due in 30 days (count) | Status Open, Due today or in the next 30 days |

### Team

Every chart puts the owner on the X axis, except Submitted, which uses the reviewer. Grouping on the Owner relation gives one bar per workspace member, with no per-person view to keep up to date.

| Chart | Records |
| --- | --- |
| Open work packages per owner, by status (stacked) | Open work packages |
| Overdue per owner | Open, Due in the past |
| Blocked per owner | Status Blocked |
| Offered, not accepted, per owner | Status Offered |
| Submitted, awaiting review, per reviewer | Status Submitted |
| Open opportunities per owner, by stage (stacked) | Open opportunities |
| No next action per owner | Open, Next action date empty |
| Engagements this month per owner, by kind (stacked) | Date this month |
| Active projects per owner, by health (stacked) | Status Active |
| Open work packages by status (kanban, **Allow editing** on) | Open work packages; Planned, Done, Declined, Cancelled columns hidden |

### Mine

Every view filters on Owner **is me**, so each member sees their own records: My open work packages, My overdue work packages, My submitted work packages (awaiting review), My opportunities with no next action, My engagements this week, and My opportunities closing this quarter (count and Amount).

## 5. Platform facts, checked against the 2.48.0 source

| Fact | Consequence here |
| --- | --- |
| An app cannot create a Dashboard record. Dashboards are records of the standard Dashboard object, and the manifest has no entity for them. | BD is a standalone page layout with a sidebar entry (`src/page-layouts/bd-dashboard.page-layout.ts`, `src/navigation-menu-items/bd-dashboard.navigation-menu-item.ts`). It renders the same widgets on the same 12-column grid, but it is not listed under Dashboards. |
| Clicking a bar or slice opens the matching records, except when the X axis is a relation (Owner, Reviewer, Company). | The tables are the drill-down on every tab. Charts grouped by a select or a date (stage, type, month, health) also open their records on click. |
| Chart filters use the same relative dates as views. `IS_BEFORE` only takes a fixed date. A PAST or NEXT window stops at the start of the current day, month or quarter. | "Within 90 days" is today OR the next 90 days. "Past 12 months" is the past 11 months OR this month. "More than 30 days ago" cannot be written as a filter at all, so the app stores the date the threshold is crossed (section 6). |
| Count and sum charts run in the viewer's browser. Bar and pie charts run on the server in the chart's timezone. | Every chart is set to Asia/Dubai with a Monday week, and every relative value carries Asia/Dubai, so all viewers see the same numbers. |
| The grid allows at most 100 rows per tab. | Executive uses 83 rows. 17 are free, enough for the uVENTURE frame (section 7). |
| A chart shows one aggregate. | Count and sum are separate widgets that share one table. |

## 6. Fields and automation added in 0.3.0

| Object | Field (API name) | Set by |
| --- | --- | --- |
| Opportunity | Stale from (`staleFrom`), date-time, app-written | W8: Stage entered at plus 30 days |
| Company | Engagement lapses at (`engagementLapsesAt`), date-time, app-written | W11: Last engagement plus 60 days |

The new hourly `derived-dates-sweep` (minute 30) recomputes both fields from their source dates. It repairs a lost W8 or W11 event and backfills records that existed before 0.3.0 (`runbooks/04-automation.md`). The 30 and 60 days are `STALE_AFTER_DAYS` and `ENGAGEMENT_LAPSE_AFTER_DAYS` in `src/automation/rules/age-thresholds.rule.ts`. If you change one, the next sweep rewrites every record.

## 7. Not built, and the substitutes

- **Weighted pipeline.** *Open pipeline by stage and probability* stacks Amount by Probability until the expected-value field exists (Prompt 4). When it does, add a sum of expected value by stage beside it, and keep this chart.
- **P1 per owner.** Not built. Work packages have no priority field. Add a `priority` select (P1, P2, P3) first, then a Team chart grouped by owner and filtered to P1, with its table.
- **Strategic and Key accounts.** These map to Account tier 1 (strategic) and tier 2. There is no tier called Key. Companies never engaged at all have no Engagement lapses at, so they do not appear. Least recently engaged (`runbooks/05-views.md`) lists them first.
- **uVENTURE.** No embed has been added: it is not known whether uVENTURE offers an embeddable view. Before anyone adds one, IT confirms three things: a URL that renders a read-only view, uVENTURE allows framing by the CRM origin (`Content-Security-Policy: frame-ancestors https://crm.kuec.example`, or no `X-Frame-Options: DENY`), and its session cookie works inside a frame (`SameSite=None; Secure`), or the view needs no login. Then an engineer adds an `IFRAME` widget (`configuration: { configurationType: 'IFRAME', url }`) to `bd-executive.page-layout-tab.ts` at row 83, 8 rows by 12 columns, with a new `uuidgen` id. It goes in the manifest, not the UI. The frame shows uVENTURE's own screen. No uVENTURE data is copied into Twenty (`kuec/CLAUDE.md` section 5).

## 8. Install, verify, change

### Install

1. From `kuec/app`: `yarn test:unit` (includes `src/page-layout-tabs/bd-dashboard.test.ts`), then `npx twenty plan`. For 0.3.0 the plan must show only additions and updates:
   - 2 fields (section 6);
   - 30 views with their fields, filters, filter groups, groups and sorts;
   - 1 page layout, 3 tabs and 65 widgets;
   - 1 navigation menu item;
   - 1 logic function (`derived-dates-sweep`);
   - updated code for W8 and W11.

   Any removal or recreation blocks the deploy.
2. `npx twenty app:publish --private -r prod`, then `npx twenty app:install -r prod`. Do this after the Thursday update (section 3).
3. Backfill now instead of waiting for minute 30: `yarn twenty dev:function:exec -n derived-dates-sweep`. The log reports how many opportunities and companies it repaired.

### Verify (ED, after every install)

1. The sidebar shows **BD Executive** after My work (since 0.5.0, `runbooks/12-global-features.md` section 5). It opens on Executive, with Team and Mine as tabs.
2. Executive: **Thursday update** is the first widget. Every chart has a table to its right, and each count chart's number equals that table's row count.
3. Change one test opportunity's stage. Within a minute, its Stale from is 30 days after its Stage entered at.
4. Team: the bars are labelled with member names. On the board, drag a test work package from Offered to Accepted: the card moves, and the record shows Accepted at.
5. Mine, signed in as a BD staff member: every number counts only their records.
6. Edit Layout, type a word under "What closed", Save, reload: the word is still there. Delete it and Save again.

### Change a widget

- To change what a chart counts, edit its widget view in `src/views/dashboard/`. The chart reads the same filters, and the test fails if a chart and its table drift apart.
- To change a chart itself, edit the tab file in `src/page-layout-tabs/`. Run `yarn test:unit` (grid bounds, no overlaps, a table beside every chart, owner on the Team X axis, Mine filtered to the viewer), then `npx twenty plan`.
- Never delete a widget, tab or view file. To retire one, relabel it `(deprecated)`, move it below the last row, and note the date and reason in a comment. Generate a new id with `uuidgen` for every new entity.
- Layout changes made in the UI are reset by the next install. Make them in the files.
