# 05: Views and sidebar (kuec-bd-ops)

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.2.0. Owner: engineering lead. Readers: engineers, the ops coordinator, and the ED for the expert views.

Every view and sidebar entry is in the app manifest, so each install or upgrade re-applies it:

- Views: `kuec/app/src/views/*.view.ts` (`defineView`), one file per view.
- Sidebar: `kuec/app/src/navigation-menu-items/*.navigation-menu-item.ts` (`defineNavigationMenuItem`).
- Widget views behind the BD dashboard tables: `kuec/app/src/views/dashboard/` (types Table widget and Kanban widget, which stay out of the view picker). They are covered by `runbooks/06-weekly-update.md` and its own rules test, not by this runbook.
- Rules test: `kuec/app/src/views/views.test.ts` (`yarn test:unit`). It fails if a view shows more than 6 columns (expert views excepted), does not lead with name then owner, sorts on anything but its third column, or if an object lacks exactly one expert view.

Nothing in this runbook is set in the Settings UI except the stage options it depends on (`config/dashboards/opportunity-stages.md`).

## 1. Platform facts, checked against the 2.48.0 source

| Fact | Consequence here |
| --- | --- |
| View types are table, kanban and calendar. | Only these three are used. |
| Grouping in the UI is Select fields only. | Every grouped view groups on a `SELECT`. "By person" needs one filtered view per member (deferred, section 6). |
| **Relative dates exist.** Date and date-time filters support `IS_RELATIVE` (this, past or next N days, weeks, months, quarters or years, with a timezone and week start), `IS_IN_PAST`, `IS_IN_FUTURE` and `IS_TODAY`, next to Is, Before, After and Is empty (`packages/twenty-shared/src/utils/filter/utils/filterOperandsMap.ts`). | Overdue, Due this week, This month and Closing this quarter are real filtered views here, not just sort orders. The dashboards (Prompt 6) can use the same filters. Relative values carry `Asia/Dubai` and a Monday week start (`kuec/app/src/constants/view-filter-values.ts`), so "this week" is the Dubai week whatever the viewer's browser timezone. `IS_IN_PAST` compares with the current instant. |
| An app cannot set an object's default view. Manifest views are always added next to the engine-owned "All ..." view. | The sidebar entries open the intended default view directly (section 4). After that, Twenty reopens the last view each user picked. |
| The engine-owned "All ..." view (key `INDEX`) is left out of the view picker once the object has any other view, is never reopened as a last-used view, and cannot take saved filters: its only save action is **Save as new view** (`packages/twenty-front/src/modules/views/view-picker/utils/computeViewPickerVisibleViews.ts`, `isUsableLastVisitedView.ts`, `components/UpdateViewButtonGroup.tsx`). | Nobody lands on an unfiltered list by default, so keeping Lost and Parked out of default views needs no UI step. `views.test.ts` checks that every opportunity view except Lost with reasons, Parked, Hygiene: Parked over 90 days and Everything (expert) excludes both stages (`14-hygiene.md` section 7). |
| View visibility is Workspace (everyone) or Unlisted (only the person who created it). There is no per-role view access, and an app cannot create Unlisted views. | The expert views are Workspace views with no sidebar entry (section 3). |
| A kanban column header shows one aggregate. | Pipeline columns show the sum of Amount. Count and sum together are in the table footers of By type, By source, By probability, Lost with reasons (per group), Proposals out and Closing this quarter: Count on Name, Sum on Amount. |
| Install validates every view filter: the operand must suit the field type, the value must parse, and a select value must be an existing option. | The stage options Signed, Lost and Parked must exist before the app is installed (section 5). |
| "Is me" is a relation filter with `isCurrentWorkspaceMemberSelected`. | My work, Offered to me and Submitted for my review show each user their own records. |
| CSV export is the **Export view** command (command menu or the view's options), on index pages only, gated by the role permission **Export CSV**. It exports the view's visible columns with its filters and sort. | Checked per view in section 5. |

Two fields from the brief map to standard fields: `estimatedValue` is the standard **Amount**, and `expectedCloseDate` is the standard **Close date**. Contract `expiresAt` is the existing **Expires on**.

## 2. Fields added in 0.2.0 for these views

All are additive. Option ids are permanent; labels can be relabelled later. Never delete an option: relabel it `(deprecated)` instead.

| Object | Field (API name) | Type | Options |
| --- | --- | --- | --- |
| Opportunity | Source (`source`) | Select | Replaced in 0.8.0 by the KUEC taxonomy: `18-taxonomy.md` |
| Opportunity | Probability (`probability`) | Select | 10%, 25%, 50%, 75%, 90% |
| Opportunity | Lost reason category (`lostReasonCategory`) | Select | No response, Price too high, No budget, Wrong timing, Went to a competitor, Not a technical fit, No capacity on our side, Other (relabelled and reordered in 0.10.0, `20-guidance.md` section 2). The existing text **Lost reason** keeps the detail. |
| Company | Account tier (`accountTier`) | Select | Tier 1 (strategic), Tier 2 (active), Tier 3 (watch) |
| Company | Sector (`sector`) | Select | Oil and gas, Energy and utilities, Defence and security, Aerospace, Healthcare and life sciences, Information technology, telecoms and digital, Advanced manufacturing, Transport and logistics, Government, Other (to be replaced by the UAE industrial cluster list, `18-taxonomy.md`) |
| Company | Offset obligor (`isOffsetObligor`) | Boolean, default false | |
| Person | Decision role (`decisionRole`) | Select | Decision maker, Budget holder, Technical evaluator, Influencer, End user, Gatekeeper |
| Person | Champion (`isChampion`) | Boolean, default false | |
| Engagement | Outcome (`outcome`) | Text | |
| Engagement | Owner (`owner`) | Relation to workspace member | Inverse: Owned engagements |
| Milestone | Owner (`owner`) | Relation to workspace member | Inverse: Owned milestones |
| Project | End date (`endDate`) | Date | |

The option lists are a first cut by engineering. The ED should confirm them before go-live; a relabel needs no data change.

0.8.0 replaces the options of Engagement Kind, Opportunity Source and Type, Contract Kind and Project Type with the KUEC taxonomy, and adds Engagement **Outcome type**, Opportunity **Offering** and **Funding path**, Task **Type**, Company **Relationship type**, **Department** on Engagement, Project, Contract, Work package and Milestone, and **Other details** on each object with an Other option. Every list, option and description: `18-taxonomy.md`.

0.7.0 adds Company **Size class** (`sizeClass`, select: Startup, Small or medium business, Large enterprise, Government or semi-government) and two dates the app writes, Opportunity **Parked lapses at** and Engagement **Outcome due at**, for the hygiene views (`14-hygiene.md` section 2).

## 3. Views

Column order follows one rule: name, owner, the date that matters, then at most three more. The default sort is on that date, ascending: oldest first for overdue lists, soonest first for upcoming ones. Exceptions are noted. "Open" work packages are Offered, Accepted, Submitted or Blocked (the same list the overdue timer uses). "Open" opportunities are every stage except Signed, Lost and Parked.

### Work packages

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| My work (sidebar default) | Table | Owner is me; status open | | Due, ascending | Title, Owner, Due, Status, Opportunity, Project |
| Offered to me | Table | Owner is me; status Offered | | Due | Title, Owner, Due, Offered at, Opportunity, Project |
| Submitted for my review | Table | Reviewer is me; status Submitted | | Due | Title, Owner, Due, Submitted at, Opportunity, Project |
| Blocked | Table | Status Blocked | | Blocked at, oldest first | Title, Owner, Blocked at, Blocked reason, Due, Opportunity |
| By status | Kanban | | Status; Declined and Cancelled columns hidden | Due | Title, Owner, Due, Opportunity, Project. Column header: count |
| Planned | Table | Status Planned (waiting on a dependency) | | Due | Title, Owner, Due, Depends on, Opportunity, Project |
| Overdue | Table | Status open; Due in the past | | Due, oldest first | Title, Owner, Due, Status, Opportunity, Project |
| Due this week | Table | Status open; Due this week (Asia/Dubai, Monday start) | | Due | as Overdue |
| Everything (expert) | Table | | | Due | all 25 fields |

### Opportunities

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| Pipeline (sidebar default) | Kanban | | Stage; Lost and Parked hidden | Close date | Name, Owner, Close date, Amount, Company, Next action date. Column header: sum of Amount |
| Licence pipeline | Kanban | Type is Licence | Stage; Lost and Parked hidden | Close date | as Pipeline |
| By type | Table | Open | Type; deprecated options hidden (none yet) | Close date | Name, Owner, Close date, Type, Stage, Amount; count and sum per group |
| By source | Table | Open | Source; deprecated options (Referral, Outreach, Event or workshop) hidden | Close date | Name, Owner, Close date, Source, Stage, Amount; count and sum |
| By probability | Table | Open | Probability | Close date | Name, Owner, Close date, Probability, Stage, Amount; count and sum |
| No next action | Table | Open; Next action date is empty | | Stage entered at, oldest first | Name, Owner, Stage entered at, Stage, Next action, Company |
| Proposals out | Table | Stage is Proposal | | Next action date | Name, Owner, Next action date, Next action, Amount, Company |
| Closing this quarter | Table | Open; Close date this quarter (Asia/Dubai) | | Close date | Name, Owner, Close date, Stage, Probability, Amount |
| Lost with reasons | Table | Stage is Lost | Lost reason category | Stage entered at, newest first (exception: a post-mortem list, not a work list) | Name, Owner, Stage entered at, Lost reason category, Lost reason, Amount |
| Parked | Table | Stage is Parked | | Next action date (the revisit date) | Name, Owner, Next action date, Stage entered at, Next action, Company |
| Everything (expert) | Table | | | Close date | all 26 fields (0.5.0 adds SharePoint folder; 0.8.0 adds Offering, Funding path, Other details) |

"Proposals out" uses the standard stage `PROPOSAL` (label Proposal). If the workspace relabels it, the view follows; if a new option replaces it, update the filter in `proposals-out.view.ts`.

### Projects

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| Portfolio (sidebar default) | Table | Status Active | | End date | Name, Owner, End date, Health, Percent complete |
| By health | Table | Status Active | Health | End date | Name, Owner, End date, Health, Percent complete, Type |
| At risk | Table | Status Active; Health Amber or Red | | End date | Name, Owner, End date, Health, Percent complete, Opportunity |
| Everything (expert) | Table | | | End date | all 14 fields (0.5.0 adds Company) |

The brief listed Portfolio's columns as name, owner, health, percentComplete, endDate. They are reordered so the date is third, per the column rule.

### Milestones

| View | Type | Filter | Sort | Columns |
| --- | --- | --- | --- | --- |
| Calendar | Calendar, month, on Due | | | Name, Owner, Due, Status, Project |
| Missed | Table | Status is not Done; Due in the past | Due, oldest first | Name, Owner, Due, Status, Project |
| Open (sidebar default) | Table | Status Open | Due | Name, Owner, Due, Project |
| Everything (expert) | Table | | Due | all 7 fields |

Missed includes Open milestones past their due date as well as those set to Missed, because nothing sets Missed automatically.

### Engagements

| View | Type | Filter | Sort | Columns |
| --- | --- | --- | --- | --- |
| Calendar | Calendar, month, on Date | | | Subject, Owner, Date, Kind, Company |
| This month (sidebar default) | Table | Date this month (Asia/Dubai) | Date | Subject, Owner, Date, Kind, Company, Opportunity |
| Without outcome | Table | Outcome is empty; Date in the past | Date, oldest first | Subject, Owner, Date, Kind, Company, Next step |
| Everything (expert) | Table | | Date, newest first | all 8 fields |

### Companies

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| By tier | Table | | Account tier | Last engagement | Name, Account owner, Last engagement, Account tier, Sector, Offset obligor |
| By sector | Table | | Sector | Last engagement | Name, Account owner, Last engagement, Sector, Account tier, Domain |
| Offset obligors | Table | Offset obligor is true | | Last engagement | Name, Account owner, Last engagement, Account tier, Sector |
| Least recently engaged | Table | | | Last engagement, oldest first | as Offset obligors |
| Everything (expert) | Table | | | Last engagement | all 18 fields (0.5.0 adds Name (Arabic), Search keywords, Projects; 0.7.0 adds Size class) |

### People

People have no owner and no date of their own. The company is the second column and there is no default sort.

| View | Type | Filter | Group | Columns |
| --- | --- | --- | --- | --- |
| Decision makers | Table | Decision role is not empty | Decision role | Name, Company, Job title, Decision role, Champion, Emails |
| Champions | Table | Champion is true | | Name, Company, Job title, Decision role, Emails, Phones |
| Missing email | Table | Emails is empty | | Name, Company, Job title, Decision role, Phones, Linkedin |
| Everything (expert) | Table | | | all 10 fields (0.5.0 adds Name (Arabic)) |

### Contracts

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| By status | Table | | Status | Expires on | Name, Owner, Expires on, Status, Kind, Counterparty |
| Expiring (sidebar default) | Table | Status Signed; Expires on not empty | | Expires on, soonest first (past dates first: lapsed and not renewed) | Name, Owner, Expires on, Counterparty, Kind, Value |
| Everything (expert) | Table | | | Expires on | all 10 fields |

### Leads (0.9.0)

`runbooks/19-leads.md` section 8 explains each one.

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| Lead inbox (sidebar default) | Table | Status New; Owner is me | | Status entered at, oldest first | Name, Owner, Status entered at, Source, Company, Campaign |
| My leads | Table | Owner is me; Status not Dead or Converted | | Next action date | Name, Owner, Next action date, Next action, Status, Company |
| Qualified not converted | Table | Status Qualified | | Status entered at, oldest first | Name, Owner, Status entered at, Qualification score, Offering interest, Company |
| Nurture review due | Table | Status Nurture; Nurture review date today or past | | Nurture review date | Name, Owner, Nurture review date, Need, Company, Source |
| Dead this month by reason | Table | Status Dead; Status entered at this month | Dead reason | Status entered at, newest first | Name, Owner, Status entered at, Dead reason, Source, Company. Footer: count |
| By source | Table | | Source; deprecated sources hidden | Status entered at, newest first | Name, Owner, Status entered at, Status, Source, Campaign. Footer: count |
| By campaign | Table | Campaign not empty | | Status entered at, newest first | Name, Owner, Status entered at, Campaign, Status, Source |
| Hygiene: Other without details | Table | Other details empty; Source, Offering interest, Department or Dead reason Other | | | Name, Owner, Source, Department, Dead reason, Other details |
| Everything (expert) | Table | | | Status entered at, newest first | all 31 fields |

### Documents (0.9.0)

| View | Type | Filter | Group | Sort | Columns |
| --- | --- | --- | --- | --- | --- |
| Documents by type (sidebar default) | Table | | Type | | Name, Owner, Status, Confidentiality, SharePoint or uVENTURE link, Company. Footer: count |
| Documents expiring in 60 days | Table | Status not Expired or Superseded; Expires on today or in the next 60 days | | Expires on | Name, Owner, Expires on, Type, Status, SharePoint or uVENTURE link |
| Hygiene: Other without details | Table | Other details empty; Type, Status or Confidentiality Other | | | Name, Owner, Type, Status, Confidentiality, Other details |
| Everything (expert) | Table | | | Expires on | all 17 fields |

### Hygiene views (0.7.0)

Each object below has one or more views named **Hygiene: ...** at positions 15 to 17, after its working views and before Everything (expert): Opportunities (missing key fields, in Qualify over 30 days, Parked over 90 days), Companies (missing key fields), People (missing email or decision role), Engagements (outcome overdue), Work packages (no done criteria), Contracts (past expiry, still Signed). Companies and People also have **Added in the last 7 days** (position 18) for the weekly duplicate sweep. Filters, columns and how each is worked: `14-hygiene.md` sections 1 and 4. 0.8.0 adds **Hygiene: Other without details** at position 19 on Opportunities, Companies, Engagements, Contracts, Projects, Work packages, Milestones and Tasks (`18-taxonomy.md` section 4); the Tasks one is the app's only task view, so Tasks has no expert view. 0.9.0 adds the same view on Leads and Documents. The Data quality page shows each Hygiene view as a count beside the view itself.

### Capability

Since 0.11.0 (the decision of 2026-10-15 superseded by `21-uventure-readiness.md`): a read-only pointer list the uVENTURE feed keeps. Pointers have no owner, so **Kind** stands in as the second column.

| View | Layout | Filter | Sort | Columns |
| --- | --- | --- | --- | --- |
| All capabilities (sidebar default) | Table | | Status changed at, newest first | Name, Kind, Status changed at, Status, uVENTURE record, Last seen in uVENTURE |
| Not available to offer | Table | Status Limited, Temporarily unavailable or Withdrawn | Status changed at, newest first | As above |
| Not seen in uVENTURE for 7 days | Table | Stale from in the past | Last seen, oldest first | Name, Kind, Last seen in uVENTURE, Status, uVENTURE record, Stale from |
| Everything (expert) | Table | | | Every column |

### Campaign target

GTM pack (0.11.0). A target has no owner of its own: **Campaign** stands in as the second column.

| View | Layout | Filter | Sort | Columns |
| --- | --- | --- | --- | --- |
| To work | Table | Status To contact, Contacted or Responded | Last update, oldest first | Name, Campaign, Last update, Status, Company |
| Everything (expert) | Table | | | Every column |

### Expert views

Each object has one **Everything (expert)** view with every business field, position 20 so it sits last in the view picker, and no sidebar entry. 2.48 cannot restrict a view to roles, so every member can open it. By convention only the ED and the ops coordinator use it; it is for checks and exports, not daily work. If a later Twenty version adds per-role view access, restrict these views then and update this section.

## 4. Sidebar

Since 0.5.0 the order and the reasons for it are in `runbooks/12-global-features.md` section 5; positions are in `kuec/app/src/constants/sidebar-positions.ts`. The entries that open a view:

| Entry | Opens |
| --- | --- |
| Leads (0.9.0) | Leads > Lead inbox |
| Pipeline | Opportunities > Pipeline |
| My work | Work packages > My work |
| Projects (was Portfolio) | Projects > Portfolio |
| Engagements | Engagements > This month |
| Contracts | Contracts > Expiring |
| Documents (0.9.0) | Documents > Documents by type |
| Milestones | Milestones > Open |

Companies and People are app entries that open the object (the last view each person used). Twenty's own Companies and People entries are removed in the UI (`config/dashboards/sidebar.md`). Every other view is reached from the view picker at the top of the object page.

## 5. Install, upgrade and verify

### Order

1. `config/dashboards/opportunity-stages.md`: Signed, Lost and Parked exist on Opportunity > Stage. Without them the install fails with "Filter on Stage uses option(s) ... that do not exist".
2. From `kuec/app`: `npx twenty plan`. Read it. For 0.2.0 it must show only additions: 14 fields (section 2 plus the two inverse owner relations), 44 views with their fields, filters, groups and sorts, and 6 navigation menu items. The object files now export their field ids as constants; the id values are unchanged, so the plan shows no change to existing fields. Any removal or recreation blocks the deploy (`kuec/CLAUDE.md` section 2).
3. `npx twenty app:publish --private -r prod`, then `npx twenty app:install -r prod`.

### Verify (ops coordinator, after every install or upgrade)

Signed in as a BD staff member with at least one open work package:

1. The sidebar shows the entries of `runbooks/12-global-features.md` section 5 in that order, and each opens the listed view.
2. My work lists only your open work packages, earliest due first.
3. Opportunities > Pipeline: columns New to Signed, Lost and Parked hidden, each header shows a sum of Amount.
4. Work packages > Due this week: a work package due next Monday is absent and one due this Friday is present (Asia/Dubai week).
5. Each object's view picker lists the views of section 3, with Everything (expert) last.

### CSV export from every view

Export needs the **Export CSV** permission on the user's role: the ED, the ops coordinator, BD officers and the department roles hold it; engineers and the Leadership viewer do not (`13-roles.md`).

For each view below, open it, run **Export view** from the command menu (or the view's options menu), open the file, and record a pass when the CSV has the view's visible columns in order and the same row count as the view. For the calendar views, check that the export runs and lists the view's records.

| Object | Views | Checked by, date |
| --- | --- | --- |
| Work packages | My work, Offered to me, Submitted for my review, Blocked, By status, Planned, Overdue, Due this week, Hygiene: no done criteria, Everything (expert) | |
| Opportunities | Pipeline, Licence pipeline, By type, By source, By probability, No next action, Proposals out, Closing this quarter, Lost with reasons, Parked, Hygiene: missing key fields, Hygiene: in Qualify over 30 days, Hygiene: Parked over 90 days, Everything (expert) | |
| Projects | Portfolio, By health, At risk, Everything (expert) | |
| Milestones | Calendar, Missed, Open, Everything (expert) | |
| Engagements | Calendar, This month, Without outcome, Hygiene: outcome overdue, Everything (expert) | |
| Companies | By tier, By sector, Offset obligors, Least recently engaged, Hygiene: missing key fields, Added in the last 7 days, Everything (expert) | |
| People | Decision makers, Champions, Missing email, Hygiene: missing email or decision role, Added in the last 7 days, Everything (expert) | |
| Contracts | By status, Expiring, Hygiene: past expiry, still Signed, Everything (expert) | |
| Leads | Lead inbox, My leads, Qualified not converted, Nurture review due, Dead this month by reason, By source, By campaign, Hygiene: Other without details, Everything (expert) | |
| Documents | Documents by type, Documents expiring in 60 days, Hygiene: Other without details, Everything (expert) | |

A user without Export CSV does not see the command; that is the expected result for a role that should not export.

## 6. Deferred and follow-ups

- **One view per team member** (work packages and opportunities, named by first name). Deferred until the roster is final: workspace member ids differ per install, so a manifest view cannot name a member by id. The version-stable way is a relation-target filter on Owner > Email (`relationTargetFieldMetadataUniversalIdentifier` = the workspace member's `userEmail` field, operand Contains, value the work email). Run `npx twenty plan` on staging first to confirm 2.48 accepts that filter. Each view then carries a work email in the repo, and a leaver's view is relabelled `(deprecated)`, never deleted. Until then, each person uses My work, and the ED sees load per person on the dashboards (Prompt 6).
- **W8 and the lost reason category.** W8 asks the owner to fill the text Lost reason when an opportunity is lost. Lost with reasons groups on Lost reason category, so W8 should also check the category. That is an automation change with its own tests.
- **Engagement and milestone owners are new.** Existing records have no owner, so they sit in a blank group of grouped views and are absent from "is me" filters until someone sets it.

## 7. Changing a view

- Edit the view file and run `yarn test:unit`, then `npx twenty plan`.
- Never delete a view file: the next install drops the view. To retire one, rename it with a `(deprecated)` suffix, move it to position 99, and note the date and reason in a comment.
- Generate new ids with `uuidgen` for every new view, column, filter, group and sort. Never reuse or edit an existing id.
- Edits made in the UI to a shipped view can be reverted by the next install. To keep a personal variant, use **Save as new view** in the view picker.
