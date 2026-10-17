# 14: Data hygiene

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.7.0. Owner: the ops coordinator (sections 4 to 7), the engineering lead (sections 1, 2, 8 and 9). Readers: the ops coordinator, the ED, BD officers (section 3), engineers.

The automation chases open work: next actions, acceptance, overdue and blocked work packages (`04-automation.md`). This runbook covers the records the automation does not chase: missing fields, records left in one state too long, and duplicates. The system finds them. The ops coordinator clears them every Monday in 15 minutes, and the ED decides what only the ED can decide once a month.

Everything here is in the app manifest except the people: there is no Settings-UI step and no click-runbook for it.

## 1. The exception views

One view per gap. Each one is a normal table view, named **Hygiene: ...**, in its object's view picker after the working views (positions 15 to 17) and before Everything (expert). Each one is also on the **Data quality** page (section 5).

| # | Object | View | Lists | Who fixes it |
| --- | --- | --- | --- | --- |
| 1 | Opportunities | Hygiene: missing key fields | Open (not Signed, Lost or Parked) and missing any of **Type**, **Owner**, **Amount** or **Close date** | The owner. No owner: the ops coordinator sets one (section 4) |
| 2 | Companies | Hygiene: missing key fields | Missing any of **Sector**, **Size class** or **Account owner** | The account owner, else the ops coordinator |
| 3 | People | Hygiene: missing email or decision role | **Emails** or **Decision role** empty | The company's account owner |
| 4 | Engagements | Hygiene: outcome overdue | **Outcome** empty 2 days after the engagement's **Date** | The engagement's owner |
| 5 | Work packages | Hygiene: no done criteria | Planned, Offered, Accepted, Submitted or Blocked, with **Done criteria** empty | The ops coordinator or the ED: BD officers cannot edit Done criteria (`13-roles.md`) |
| 6 | Opportunities | Hygiene: in Qualify over 30 days | Stage Qualify (API value `NEW`, still labelled New until the stage relabel) entered more than 30 days ago | The owner decides: advance, park or lose |
| 7 | Opportunities | Hygiene: Parked over 90 days | Stage Parked, entered more than 90 days ago | The ops coordinator proposes Lost (section 4, step 4) |
| 8 | Contracts | Hygiene: past expiry, still Signed | Status Signed, **Expires on** before today | The ops coordinator, after asking the owner: BD officers can only read contracts |
| 9 to 18 | Opportunities, Companies, Engagements, Contracts, Projects, Work packages, Milestones, Tasks; Leads and Documents since 0.9.0 | Hygiene: Other without details (0.8.0, position 19) | Any taxonomy list set to **Other** and **Other details** empty | See `18-taxonomy.md` section 4 |

Field names from the brief, mapped to the data model:

| Brief | Field in Twenty |
| --- | --- |
| Opportunity `type` | **Type** (`playbookType`; `type` is reserved in Twenty) |
| Opportunity `owner` | standard **Owner** |
| Opportunity `estimatedValue` | standard **Amount** |
| Opportunity `expectedCloseDate` | standard **Close date** |
| Company `sector` | **Sector** |
| Company `sizeClass` | **Size class** (`sizeClass`), new in 0.7.0 |
| Company `relationshipOwner` | standard **Account owner** |
| Person `email` | standard **Emails** (primary email) |
| Person `decisionRole` | **Decision role** |
| Engagement `outcome` | **Outcome** |
| Work package `doneCriteria` | **Done criteria** |
| Contract `expiresAt` | **Expires on** |

Each "missing" view shows the fields it checks as columns, so the empty cell says what to fill. Sort orders: opportunities by Stage entered at, oldest first; companies by Last engagement, most recent first (live relationships before the import's long tail); engagements, work packages and contracts by their date, oldest first. People have no date and no sort.

Two older views overlap and stay as they are: People > **Missing email** (a subset of view 3) and Engagements > **Without outcome** (every past engagement without an outcome, including today's, for the owner's own day-to-day use).

Companies and People also have **Added in the last 7 days** (position 18): everything created in the past 7 days or today, newest first, for the duplicate sweep (section 4, step 3). They are not exceptions and have no count.

## 2. Fields added in 0.7.0

| Object | Field (API name) | Type | Set by |
| --- | --- | --- | --- |
| Company | Size class (`sizeClass`) | Select: Startup, Small or medium business (SME until 0.10.0), Large enterprise, Government or semi-government | People. A first cut: the ED confirms the options before go-live; relabelling one needs no data change. Values from the day-one register are not imported yet (`09-import.md` section 8) |
| Opportunity | Parked lapses at (`parkedLapsesAt`) | Date and time, app-written | W8 on every stage change: Stage entered at plus 90 days when the new stage is Parked, empty in any other stage |
| Engagement | Outcome due at (`outcomeDueAt`) | Date and time, app-written | W11 when Date changes: Date plus 2 days |

The hourly `derived-dates-sweep` recomputes both dates from their sources and repairs any that differ, like Stale from and Engagement lapses at before them (`04-automation.md`). It checks Outcome due at only on engagements that have a date and no outcome, since nothing else reads it.

Why stored dates: a 2.48 view filter cannot say "more than N days ago". `IS_BEFORE` takes a fixed date, relative windows end at the start of the current day, and filter groups support only AND and OR (a NOT group throws in `packages/twenty-shared/src/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter.ts`). So the app stores the instant a record crosses the threshold, and the view filters on it with "is in past". View 6 reads the existing Stale from (Stage entered at plus 30 days).

The thresholds are `STALE_AFTER_DAYS` (30), `PARKED_LAPSE_AFTER_DAYS` (90) and `OUTCOME_DUE_AFTER_DAYS` (2) in `kuec/app/src/automation/rules/age-thresholds.rule.ts`. They are calendar days, not business days: the views are read once a week, so the difference never changes what the Monday run sees. Changing one is a code change; the next sweep rewrites every record.

## 3. Naming conventions

Enforced by this runbook, not by the system: Twenty does not validate names. The ops coordinator corrects any name that breaks a rule whenever the record passes through the Monday run, and checks every new company and person in the duplicate sweep. The ED sends back a badly named record at the Thursday review.

| Record | Rule | Right | Wrong |
| --- | --- | --- | --- |
| Company | **Name**: the legal name in English as on the trade licence, legal form included. **Name (Arabic)**: the legal name in Arabic. Acronyms and everyday names go in **Search keywords**, so search still finds them | Name `Al Noor Advanced Materials LLC`, Name (Arabic) `النور للمواد المتقدمة ذ.م.م`, Search keywords `Al Noor` | `Al Noor`, `al noor materials`, Arabic in Name |
| Opportunity | `Company – Type – Topic`. Company is the short name people use (the acronym from Search keywords if it has one). Type is the opportunity's Type label: `Licence` or `RFQ`. Topic is a few words naming the technology or service | `ADNOC – Licence – Corrosion sensor coating` | `ADNOC opportunity`, `New RFQ`, `Corrosion sensor` |
| Project | `Company – Deliverable – Year`, the year the project starts | `EDGE – Materials test campaign – 2026` | `EDGE project`, `Test campaign` |
| Work package | Verb plus object, in the imperative, sentence case. No company name: the linked opportunity or project carries it | `Draft technical assessment`, `Book workshop venue` | `Technical assessment`, `TA draft`, `ADNOC assessment` |

The separator is an en dash with a space on each side, as in the brief. Type it with Alt+0150 on Windows or Option and hyphen on a Mac, or copy it from an existing name. A hyphen typed by mistake is corrected at the next Monday run; it is not worth a message.

Playbook work packages take their titles from `kuec/playbooks/templates.json`, and today those titles are nouns (`Technical assessment`, `Outreach`). Section 9 lists the proposed renames. Until they ship, playbook titles are left as they are: the rule applies to work packages people create by hand.

## 4. Monday: the 15-minute hygiene run

The ops coordinator, every Monday before the daily standup, so any task it creates is on My work by the standup. Open **Data quality** in the sidebar. The page lists the sixteen exception views top to bottom, each count beside its table. A count of 0 means skip to the next.

"Fix" means set the missing value yourself when the record or a quick look (the company website, the email signature, the proposal folder) gives the answer in under a minute. "Assign" means one Twenty task per owner per view, not per row: Ctrl+K > **Create record** > **Task**, title `Hygiene: <view name>`, assignee the owner, due Wednesday, with every record of theirs in that view under **Relations**. A row with no owner gets an owner first: the creator, or the account owner of its company, or the owner of its opportunity. If none of these is right, add it to the ED's list for the standup.

1. **Run the exception views top to bottom (8 minutes). Fix or assign each row.**
   1. *Opportunities missing key fields.* Fix Type from the playbook in use. Assign Amount (best estimate in AED) and Close date (the expected month is enough) to the owner.
   2. *Companies missing key fields.* Fix Sector and Size class from the company website. Account owner is the BD officer who holds the relationship; if nobody does yet, the owner of the company's newest open opportunity.
   3. *People missing email or decision role.* Fix an email that is in a signature or an invite. Assign the decision role to the company's account owner.
   4. *Engagements without outcome after 2 days.* Assign to the engagement's owner. An engagement that led nowhere still gets an outcome: `No outcome: <why>`.
   5. *Work packages without done criteria.* Write the done criteria yourself, from the objective and the expected output, and tell the owner. If you cannot tell what done looks like, assign the question to the reviewer.
   6. *Opportunities in Qualify over 30 days.* Assign to the owner, who decides this week: advance (next stage, with a next action and date), park (Parked, with the revisit date as Next action date) or lose (Lost, with a reason).
   7. *Parked over 90 days.* Propose Lost: for each new row, put this in the owner's hygiene task: "Parked since <date>. It moves to Lost next Monday unless you revive it. Which lost reason category fits?" Step 4 closes the ones nobody revives.
   8. *Contracts past expiry, still Signed.* Ask the owner and update the record: renewed or extended means a new **Expires on**; ended means status **Expired**.
   9. *Other and no details* (ten rows, one per object; Leads and Documents since 0.9.0). Assign to whoever picked Other; fix contracts and work packages yourself. Either Other details says what it is, or the record gets the option that fits after all (`18-taxonomy.md` section 4). Recurring Other details texts are evidence for the quarterly taxonomy review (`18-taxonomy.md` section 6).
2. **Look for patterns (in the same pass).** Several rows from one person, or the same gap every week, goes on the ED's list for the standup. A gap that keeps coming back is a training or playbook question for the monthly review (section 6), not a weekly chase.
3. **Duplicate sweep on Company and Person (4 minutes).** Open Companies > **Added in the last 7 days**. For each row, press Ctrl+K and search for the first word of its name, its acronym and its website's domain. Then do the same for People > **Added in the last 7 days**, by last name and by email domain. Twenty itself only refuses an exact domain or email match (`12-global-features.md` section 3.1), so near-duplicates ("Gulf Drilling" and "Gulf Drilling Services LLC") are found here. Merge each one found, older record surviving, by the procedure in `12-global-features.md` section 3.3. Rename any new record that breaks section 3.
4. **Archive Parked over 90 days: Parked to Lost (2 minutes).** For each row whose owner was told last Monday (step 1.7) and has not revived it:
   1. Set **Lost reason category**: the owner's answer, or **Other** if none came.
   2. Set **Lost reason**: `Hygiene close <date>: parked since <date>, no objection from <owner>`. The `Hygiene close` prefix lets the monthly review tell these apart from losses on a live deal.
   3. Then set **Stage** to **Lost**. With the reason already filled in, W8 creates no "Record lost reason" task.

   If the owner objects, the objection is a revival: they move it to an open stage with a next action and a date this week. Staying Parked is not an option after 90 days. Lost deletes nothing: if the client comes back, move the same opportunity back to an open stage and its history comes with it.

Done when every row is fixed, assigned, or on the ED's list. If the 15 minutes run out (the first weeks after the day-one import, when views 2 and 3 are long), stop and carry on next Monday from the top. The views are sorted so the records the team uses now come first.

## 5. The Data quality page

**Data quality** in the sidebar, last of the app entries (`12-global-features.md` section 5). One standalone page, sixteen rows, in the order of section 4 step 1. Each row is a count on the left and the exception view itself on the right. The count reads the view's filters (`chartFilterFromView`), so the number and the table cannot disagree. The tables are editable, so rows are fixed in place; record permissions still decide who can change what. The sidebar entry shows for every member: 2.48 cannot limit a page or a sidebar entry to some roles.

It is a page and not an entry under Dashboards: an app cannot create a Dashboard record, and a hand-built dashboard would need every filter typed in twice and would drift from the views. Built the same way as BD and Home (`06-weekly-update.md` section 5). Files: `src/page-layouts/data-quality.page-layout.ts`, `src/page-layout-tabs/data-quality.page-layout-tab.ts` (the ordered list `DATA_QUALITY_CHECKS`), `src/navigation-menu-items/data-quality.navigation-menu-item.ts`.

## 6. The monthly review

The ED and the ops coordinator, 30 minutes on the first Monday of the month, after the hygiene run. On the Friday before, the ops coordinator exports the two lists below (Export view, `05-views.md` section 5) and sends them to the ED.

### 6.1 Lost reasons, read against the playbooks

Open Opportunities > **Lost with reasons** (grouped by Lost reason category, newest first) and read every opportunity lost since the last review. Read the `Hygiene close` rows separately: they are deals nobody qualified out in time, so they count against Qualify and Bid or no-bid, whatever category they carry.

For each category that shows up twice or more, or any reason the ED recognises, find the playbook step that should have caught it:

| Lost reason category | Look first at |
| --- | --- |
| Price | RFQ: Quote or proposal. Licensing: Term sheet |
| Timing | RFQ: Bid or no-bid (the client's deadline). Licensing: Outreach, Term sheet |
| No budget | RFQ: Bid or no-bid, Scoping (the budget signal). Licensing: Partner shortlist |
| Went to a competitor | RFQ: Bid or no-bid, Submission, Follow-up |
| Technical fit | Licensing: Technical assessment. RFQ: Scoping |
| No response | Licensing: Outreach. RFQ: Follow-up |
| Our capacity | RFQ: Bid or no-bid, Internal approval |
| Other | The Lost reason text |

What the team keeps getting wrong is a playbook change, not a reminder. If the step does not ask for the check, add it. If it asks and the check is still missed, make it a done criterion the reviewer signs off, or move the gate earlier. Never send a "please remember to" message instead. The ED words the change. An engineer makes it in `kuec/playbooks/templates.json` (the single source), runs `node kuec/playbooks/render-playbooks.ts` and `yarn playbooks:sync` in `kuec/app`, and ships it with the next app release. New cases get the new step. Cases already open keep the work packages they have.

Write the month's decisions in the review note on SharePoint (BD Ops > Hygiene reviews): each change, and each recurring reason you looked at and left alone, with why.

### 6.2 Stale accounts: re-engage or drop

The list is the table **Tier 1 and 2 accounts not engaged in 60 days** on BD Executive, plus Tier 1 and Tier 2 companies at the top of Companies > **Least recently engaged** with no engagement at all. For each company the ED decides:

- **Re-engage.** The account owner logs a planned engagement or takes a task to make one within two weeks. The company leaves the list when that engagement is logged.
- **Drop.** Set **Account tier** to **Tier 3 (watch)** and add a note on the company: `Dropped by the ED on <date>: <reason>`. Keep the account owner: dropping changes the priority, not who holds the relationship. Tier 3 is not on the stale list, so the decision holds until someone raises the tier again.

## 7. Retention: nothing is deleted

- **Lost and Parked opportunities stay.** So do Expired and Terminated contracts, and Declined and Cancelled work packages. Their history and their lost reasons are what the monthly review reads.
- **They are filtered out of default views.** Every opportunity view excludes Lost and Parked, by a stage filter or by hidden kanban columns. The exceptions are the views that exist to show them: Lost with reasons, Parked, Hygiene: Parked over 90 days, and Everything (expert). `src/views/views.test.ts` fails if a new opportunity view leaks them. Twenty's own "All opportunities" view is not a way round this: 2.48 leaves it out of the view picker once other views exist, never reopens it as a last-used view, and offers only Save as new view on it (`05-views.md` section 1). So no Settings step is needed. The sidebar's Pipeline hides Lost and Parked columns; the Work packages board hides Declined and Cancelled.
- **Delete is for mistakes only.** That means a test record, or a record created twice before anything was attached to it. Merging a duplicate (section 4, step 3) is the one routine destroy. Only the ED and the ops coordinator can delete or merge (`13-roles.md`). A wrong delete is restored from **See deleted** on the object's list. Never use **Permanently destroy** outside a merge.
- **Closing is a stage, not a deletion.** A dead deal goes to Lost with a reason. A deal on hold goes to Parked with a revisit date. A deal that comes back moves back to an open stage.

## 8. Install and verify (0.7.0)

1. From `kuec/app`: `yarn test:unit`. It includes `src/page-layout-tabs/data-quality.test.ts` (one count and one table per exception view, in order, each count reading its table's filters; every view named `Hygiene: ...` is on the page; the filters of each view) and the retention check in `src/views/views.test.ts`.
2. `npx twenty plan`. Read it. It must show only additions and updates:
   - 3 fields: Company Size class, Opportunity Parked lapses at, Engagement Outcome due at;
   - 10 views (8 Hygiene, 2 Added in the last 7 days) with 60 view fields, 24 filters, 5 filter groups and 9 sorts, plus 1 view field (Size class) on Companies > Everything (expert), plus Twenty's own field-list entries for the 3 new fields;
   - 1 page layout, 1 tab and 16 widgets;
   - 1 navigation menu item;
   - updated code for W8, W11 and `derived-dates-sweep`.

   Any removal or recreation blocks the deploy (`kuec/CLAUDE.md` section 2).
3. `npx twenty app:publish --private -r prod`, then `npx twenty app:install -r prod`, after the Thursday update (`06-weekly-update.md` section 3).
4. Backfill now instead of waiting for minute 30: `yarn twenty dev:function:exec -n derived-dates-sweep`. Until it runs, opportunities parked before 0.7.0 and engagements logged before it have no stored date, so views 4 and 7 miss them.

Verify (ops coordinator):

1. The sidebar ends Milestones, **Data quality**, Tasks. The page shows eight rows, and each count equals its table's row count.
2. Create a test engagement dated three days ago with no outcome. Within a minute, Outcome due at is its date plus 2 days, and it is listed in Hygiene: outcome overdue. Write an outcome: it leaves the list.
3. Set a test opportunity to Parked. Within a minute, Parked lapses at is Stage entered at plus 90 days. Move it back to an open stage: Parked lapses at is empty.
4. Create a test contract, status Signed, Expires on yesterday: it is listed in Hygiene: past expiry, still Signed.
5. Each object's view picker shows its Hygiene views after the working views and before Everything (expert).
6. Delete the test records afterwards: test records are the mistakes section 7 allows deleting.
7. Run Export view on each new view (`05-views.md` section 5).

## 9. Changing this, and open items

- **A new gap.** Add a view file in `src/views/` named `Hygiene: ...` (new ids with `uuidgen`) and an entry in `DATA_QUALITY_CHECKS`. The data quality test fails until the page carries it. Add it to sections 1 and 4 here.
- **Retiring a gap.** Never delete the view: relabel it `(deprecated)`, take it off the page, move it to position 99, and note the date and reason (`05-views.md` section 7).
- **Playbook work package titles.** Proposed, for the ED to approve as one playbook change (section 6.1 for how it ships). They are not applied:

  | Playbook | Now | Proposed |
  | --- | --- | --- |
  | Technology licensing | Technical assessment | Draft technical assessment |
  | | Commercial route scoping | Scope commercial route |
  | | Partner shortlist | Shortlist licensee partners |
  | | Outreach | Contact shortlisted partners |
  | | Term sheet | Negotiate term sheet |
  | | Licence signed | Sign licence agreement |
  | RFQ / technical service | Bid or no-bid | Decide bid or no-bid |
  | | Scoping | Scope client requirement |
  | | Quote or proposal | Draft quote or proposal |
  | | Internal approval | Obtain internal approval |
  | | Submission | Submit proposal |
  | | Follow-up | Follow up on submission |
  | | Delivery hand-off | Hand off to delivery |
  | Industry workshop | Objective | Set workshop objective |
  | | Audience and target roles | Define audience and target roles |
  | | Invitations | Send invitations |
  | | Logistics | Confirm logistics |
  | | Run | Run the workshop |
  | | Outcomes into opportunities | Log outcomes as opportunities |

  The project templates in `kuec/playbooks/project-templates.json` (Scoping, Internal approval, Submission, Kick-off, Delivery plan, Execution, Client acceptance, Close-out) need the same treatment. Renaming is safe for open cases: a retried playbook run finds its work packages by playbook step, not by title (`src/automation/playbooks/instantiate-case.ts`).
- **Intake.** The intake route in `design/wireframes.md` section 4 names a new opportunity `{Company}: {first 8 words}`. It must follow section 3 (`Company – Type – Topic`) when it is built.
- **Stage relabel.** Qualify is still labelled New until the relabel in the Phase B build list. View 6 follows the API value `NEW`, so it needs no change when that happens.
- **Size class from the import.** The register's size values are held, not imported (`09-import.md` section 8). Until they are mapped and imported, every imported company is in view 2.
