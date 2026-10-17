# kuec-bd-ops build backlog

The SDK-app build order for the operation in `journeys.md`, ranked by friction removed per day of engineering, with the four screens of the brief (`wireframes.md`) first. Written against Twenty 2.48.0 and `kuec-bd-ops` 0.7.0. Everything here lives in `kuec/app` (one app, no core changes) and is additive: new UUIDs generated once with `uuidgen`, nothing renamed or removed except page-layout widgets retired the way `kuec/CLAUDE.md` section 2 describes, and `plan` read before every apply.

Contents

1. How the order is set
2. Before anything: prerequisites
3. Build order
4. Items
5. After four weeks: measure and re-rank
6. Data model additions
7. Logic functions added
8. Decisions for the ED
9. Phone acceptance checks

---

## 1. How the order is set

**Friction removed** is minutes per week across the team, taken from the friction log (`journeys.md` section 13): for each friction an item addresses, the share it removes times that friction's minutes per week. **Days** are one engineer's days, including unit tests on a fixed clock, `plan` review, a staging deploy, the runbook and test-doc updates, and for front components the English and Arabic catalogs and RTL. **Score** = friction removed / days.

Rules, in order:

1. The brief's four screens (Work package card, Home, Exceptions, Intake) come first.
2. An item goes after anything it depends on. A component two items share is costed to whichever ships first.
3. Otherwise by score, highest first; ties go to the item that removes more minutes in total.

**Rule 2 inside the four.** Exceptions alone scores higher than Home (37.9 against 25.7), but it is built from Home's decision items, inline forms and person picker. Costed together, Home and Exceptions remove 294 minutes a week for 10 days whichever goes first, and Home alone removes more of it, so Home goes first. Intake is last of the four: it removes the most error-prone friction (cases set up wrong) but it happens only four times a week.

**Volumes behind the estimates.** These are assumptions, to be replaced with counts from the app's own data after four weeks (section 5).

| Volume | Assumed |
| --- | --- |
| Team | 4 BD officers, 3 engineers in the Developer and Data analyst playbook roles, the ED, the ops coordinator, Legal and Finance part-time |
| New cases per month | 10 RFQ or technical service, 2 licence, 2 industry challenge, 1 startup or portfolio request, 2 site visits, 3 delivery projects; 1 workshop per quarter; 1 partnership and 1 campaign per half-year |
| Open opportunities at any time | 40 |
| Work package transitions per week | 90 (about 15 active cases, 6 steps, 4 transitions per step, spread over 4 weeks) |
| Reviews per week | 20 |
| Engagements logged per week | 25 |
| Blocks per week; declines and reassignments per week | 3; 6 |
| Notification tasks created per week | 60 |

The friction log totals about **1,400 minutes a week** (23 hours across the team). B1 to B4 remove about 750 of them (53%) in 27 days; B1 to B7 about 1,000 (71%) in 40 days; all eighteen items about 1,300 (93%) in 75.5 days.

## 2. Before anything: prerequisites

Not ranked: every journey fails without them. Confirm each still applies on the current `main` before starting it.

| # | What | Why | Days |
| --- | --- | --- | --- |
| P1 | Add `scripts` to `exclude` in `kuec/app/tsconfig.json` (or `"include": ["src"]`); bring `src/import/import-target-values.test.ts` inside `tsconfig.spec.json` | The SDK runs `tsc` before `dev`, `build` and `publish`, and the import scripts break it (`tests/report.md`, blockers 1 and 5) | 0.25 |
| P2 | Make W01 finish: `publishWorkPackageTransition` on the case's timeline fails inside the function runtime | Without it `playbookApplied`, the next action and the step-1 offer task never happen (`tests/report.md`, blocker 2). T10 on 2026-10-17 shows W01 creating work packages, not finishing | 1 to 2 |
| P3 | Click-runbook `config/dashboards/opportunity-stage-labels.md` (brief 8.5): New, Screening, Meeting, Proposal relabelled Qualify, Scope, Propose, Negotiate; Customer (deprecated) hidden in `pipeline.view.ts` and `licence-pipeline.view.ts` | Every screen uses the stage labels; Intake and W12 move stages by them | 0.5 |
| P4 | Every member who can be given a step holds a role that writes work package Status, Accepted at, Blocked reason, Declined reason (and B1's `outcome`, `outputLink`) | Engineer and department roles cannot change work packages today (`runbooks/13-roles.md` decision 6), so a developer, data analyst, Legal or Finance member cannot accept, submit or approve a step, and it is taken from them after 5 working days. Decision D6 | 0.5 |

## 3. Build order

| Rank | Item | Removes (journeys section 13) | Minutes per week | Days | Score | Days so far | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **B1** Work package card, complete | F1 80%, F3 90%, F21, F20 20% | 336 | 8 | 41.9 | 8 | P2, P4, D1, D2, D7 |
| 2 | **B2** Home | F2 80%, F6 50%, F4 30%, F15 30% | 180 | 7 | 25.7 | 15 | B1 |
| 3 | **B3** Exceptions | F10 80%, F2 10%, F15 20%, F6 15%, F20 30% | 114 | 3 | 37.9 | 18 | B2 |
| 4 | **B4** Intake | F19, F22 80%, F7 10%, F6 20% | 116 | 9 | 12.9 | 27 | P2, P3, B2 |
| 5 | **B5** Notification hygiene | F4 70% | 42 | 2 | 21.0 | 29 | none |
| 6 | **B6** Company 360 | F8 90%, F7 60%, F9 70%, F6 15% | 115 | 6 | 19.2 | 35 | B2 |
| 7 | **B7** Team board | F11, F15 50%, F17 80%, F2 5% | 92 | 5 | 18.4 | 40 | B1, B2 |
| 8 | **B8** Industry challenge and Startup partnering playbooks | F16 60% | 36 | 2.5 | 14.4 | 42.5 | B4, D4 |
| 9 | **B9** Debrief: several cases from one visit or event | F23 80%, F7 20% | 50 | 3.5 | 14.2 | 46 | B4 |
| 10 | **B10** Notification format | F5 70% | 21 | 1.5 | 14.0 | 47.5 | B1, D9 |
| 11 | **B11** Milestones follow their work package; Agree recovery | F13 40%, F18 30% | 29 | 2.5 | 11.6 | 50 | D10 |
| 12 | **B12** Step facts on the card | F14 90% | 28 | 3 | 9.3 | 53 | B1 |
| 13 | **B13** Project room | F13 60%, F18 20%, F7 10% | 41 | 5 | 8.2 | 58 | B6, B11 |
| 14 | **B14** Long-cycle templates: partnership, portfolio support, campaign | F16 40% | 24 | 3 | 8.0 | 61 | B4, B8, D5 |
| 15 | **B15** Delivery hand-off creates the project | F24 90% | 10 | 1.5 | 6.6 | 62.5 | D3 |
| 16 | **B16** Targets: shortlists, campaign targets, invitees | F12 90% | 36 | 6 | 6.0 | 68.5 | B13 |
| 17 | **B17** Portfolio | F18 50% | 15 | 3 | 5.0 | 71.5 | B11 |
| 18 | **B18** Team member page and Ask for more time | F20 50%, F2 5% | 17 | 4 | 4.2 | 75.5 | B7 |

With two engineers, B1 to B4 take about three and a half weeks of calendar time and the whole list about eight. B5, B11 and B15 have no front component and can run in parallel with a screen.

Sensitivity: minutes are not the only value. Portfolio (B17) is how the ED reports upward; if that weighs more than minutes saved, move it up to rank 12. It depends only on B11. Targets (B16) unblocks the licence playbook's partner follow-up rules and the campaign journey; if a campaign is planned this half-year, move it before B14.

---

## 4. Items

Each item lists what ships, the data model and logic it adds, what it removes, and when it is done. Paths are under `kuec/app/src/` unless stated.

### B1. Work package card, complete (brief section 5)

- **Ships.** Extends `front-components/work-package-card.front-component.tsx` and `front-components/work-package-card/` to the brief's whole button matrix (5.4):
  - Reviewer: **Approve** and **Send back**, with the bid variant on Bid or no-bid.
  - Gates read from `templates.json` `gates`: a step followed by a gate whose `onNo` is Lost or Cancelled shows **Approve: go ahead**, **Send back** and the text link **Stop the case**, which asks for a reason.
  - ED-owned steps with no reviewer (Internal approval): **Approve** and **Send back to {previous owner}** directly, without Accept first. Send back returns the previous step to In progress with a Note and this one to Not started.
  - Request help addressed to the reviewer, else the case owner, else the ED (D2), with "Can you keep working while you wait?"; "No, I'm stuck" blocks with a reason of at least 3 words.
  - Owner on Blocked: **I can continue now**. The ED and the ops coordinator on Blocked: **Back to work**, **Give to someone else**, **Keep waiting**. On Declined: **Give to {suggested}**, **Choose someone else**.
  - Context section (brief 5.3), Submit with the link field and the brief's three step questions (5.6).
  - New record page layout `page-layouts/work-package.page-layout.ts`: the card first, then Fields, Tasks, Notes, Timeline (today the card sits after Fields on the generated Home tab, below the fold on a phone).
  - Shared `front-components/shared/person-picker.tsx` with open counts from `countOpenWorkPackagesByMember`, the counter W01 uses. B2, B3 and B7 reuse it.
- **Data model.** Work package `outputLink`, `outcome`, `blockAcknowledgedAt` (section 6). `bd-officer.role.ts` and the role P4 settles on gain write on `outcome` and `outputLink` (D7); `roles.test.ts` pins it.
- **Logic.** Route `work-package-help`; `w13-declined-and-sent-back` (Declined: the ops coordinator, per D1; Sent back: the owner); `w14-apply-outcome`; `w15-closed-case-stops-work` (an opportunity going Lost by any path cancels its open and planned steps with a Note; the timer rules skip steps of a Parked case until its stage moves again; the hourly sweep applies the same pure rule).
- **Docs.** `runbooks/10-cadence-en.md` and `10-cadence-ar.md` section 5 (Blocked from the card, help to the reviewer), `tests/05-screens.md`.
- **Removes.** F1 80% (60), F3 90% (203), F21 (69), F20 20% (4): 336 minutes a week. **Days** 8. **Score** 41.9.
- **Done when.** Brief 8.6 checks 4, 5 and 7 pass on the card; a reviewer approves from the card and the next owner gets exactly one offer; "No, I'm stuck" refuses a reason under 3 words; a case set to Lost on the native record has no open step and sends no overdue notice the next day; M1.

### B2. Home (brief section 3)

- **Ships.** `front-components/home.front-component.tsx` as the only widget on the existing Home page. The three table widgets are removed from `page-layout-tabs/home.page-layout-tab.ts`; their views stay and become the blocks' "Open as list" targets. `plan` must show those three widget removals and nothing else. Four variants (`journeys.md` 11.1): staff, ED, ops coordinator, Leadership viewer, chosen from playbook role assignments and from a refused work package read. Blocks, items and inline forms as in the brief, with the D1 change for Declined items. Shared kit for B3, B6, B7: decision item, inline form, freshness footer, remembered row counts. Route `work-package-nudge` for the ops coordinator's **Nudge** (re-sends the offer email as the app, at most once per working day per work package).
- **Data model.** None. Tight deadline items appear once B4 adds their fields.
- **Removes.** F2 80% (108), F6 50% (38), F4 30% (18), F15 30% (16): 180. **Days** 7. **Score** 25.7.
- **Done when.** Brief 8.6 checks 3, 5 and 7 pass on Home; each variant shows for a test member of that kind (ED, ops coordinator, BD officer, Engineer, Leadership viewer) and the Leadership viewer sees no error; M2.

### B3. Exceptions (brief section 6)

- **Ships.** `front-components/exceptions.front-component.tsx` on the existing Exceptions page, table widgets retired as in B2. Brief section 6 entire: **New due date** (writes `dueAt` and a Note; W03 re-arms both levels), **Give to someone else**, **Remind {reviewer}**, **Set the next step**, **Ask {owner}** (reuses W04's task when there is one), **Choose an owner**. Imports `needsNextActionFlag`, `STATUSES_WITH_DUE_TIMER` and the business-day calendar from the app so the page and the escalations cannot disagree. Due-date requests appear here once B18 ships.
- **Removes.** F10 80% (72), F2 10% (14), F15 20% (11), F6 15% (11), F20 30% (6): 114. **Days** 3. **Score** 37.9.
- **Done when.** Brief 8.6 check 6: for the same clock, Blocked, Late and No next step match what W03, W04 and W05 sent, item for item.

### B4. Intake (brief sections 2 and 4)

- **Ships.** `front-components/intake.front-component.tsx`, `command-menu-items/new-request.command-menu-item.ts`, the Home primary action, `front-components/shared/tile-keywords.ts`. Routes `intake-preview` and `intake-confirm` (brief 8.3). Tiles 1, 3, 4 and 6; tiles 2 and 5 stay hidden until B8 adds their playbooks. Changes to the brief from `journeys.md`: source per tile (1 to 3 Inbound (web, email, phone), 4 Referral: faculty, 5 Referral: partner; labels from `runbooks/18-taxonomy.md`); **Who will own this case?** for the ED and the ops coordinator; tile 6 warns when the event is fewer than 40 working days away and raises the ED's tight-deadline card.
- **Data model.** Opportunity `uventureRecord` (required by `kuec/CLAUDE.md` section 5 and missing today), `intakeRequestId`, `deadlineRiskFlaggedAt`, `deadlineRiskAcknowledgedAt`.
- **Logic.** `w12-stage-follows-step` (brief 9.2), extended: on release, when the opportunity's next action is empty or equals the previous step's title, it becomes the new step's title and due date, so W04 stops nagging owners of cases that are moving. `runbooks/04-automation.md` renames its "W12 (Teams channel)" paragraph to "Teams posts", so only one thing is called W12.
- **Removes.** F19 (88), F22 80% (8), F7 10% (5), F6 20% (15): 116. **Days** 9. **Score** 12.9.
- **Done when.** Brief 8.6 checks 1 and 2; a licence case opened by the ED for a BD officer shows the BD officer as owner and offers step 1 to the least-loaded developer; a second Confirm with the same `intakeRequestId` creates nothing.

### B5. Notification hygiene

- **Ships.** Logic `notification-task-close`. Fast path on `workPackage.updated` (`status`, `ownerId`, `dueAt`), `opportunity.updated` (`nextAction`, `nextActionDate`, `stage`) and `project.updated` (`status`); sweep at minute 15 of every hour (`15 * * * *`, the same minute in Asia/Dubai). `createTargetedTask` records each task it creates in the app's key-value store with its kind, record and anchor; the pure rule `isNotificationStillDue(kind, record, now)` decides, and the function marks stale tasks Done as the app. Help tasks are never closed automatically: a person answers them. W03 change: a Submitted work package's day-0 overdue notice goes to the reviewer ("Late in your review: {title}"); the +2 notice still goes to the ED.
- **Removes.** F4 70% (42). **Days** 2. **Score** 21.0.
- **Done when.** Fixed-clock unit tests per kind: closes when the condition clears, not before; a re-offer creates one new task and reopens none; the sweep run twice changes nothing the second time.

### B6. Company 360

- **Ships.** `front-components/company-360.front-component.tsx`; record page layout `page-layouts/company.page-layout.ts` (360 first, then Fields and Twenty's tabs). **Log a contact** (S3), built as a module so B13 reuses it on projects. **Add a person** (search by email first, then create linked to the company). People by decision role and influence; open cases; contacts; contracts with "Expiry not set" and "Expires in 60 days"; projects with health. Blocks the viewer's role cannot read are left out with one line, not an error.
- **Data model.** Person `influence`.
- **Removes.** F8 90% (54), F7 60% (29), F9 70% (21), F6 15% (11): 115. **Days** 6. **Score** 19.2.
- **Done when.** Logging a contact on a company with one open case updates that case's next action through W11 without the person choosing it; with two open cases nothing is linked until they choose; the Leadership viewer sees no people or contacts and no error.

### B7. Team board

- **Ships.** `front-components/team-board.front-component.tsx`; `page-layouts/team-board.page-layout.ts` (STANDALONE_PAGE), its tab, and a sidebar item after Exceptions (`constants/sidebar-positions.ts`). Columns, flags, **Reassign**, **Give to {suggested}**, **Change reviewer**, "Only what needs attention", the phone layout (`journeys.md` 11.2). Logic `w16-work-package-reassigned`: an `ownerId` change made by a person tells the previous owner "Given to {name}: {title}"; W02's own reassignment is skipped (it already notifies).
- **Removes.** F11 (50), F15 50% (27), F17 80% (8), F2 5% (7): 92. **Days** 5. **Score** 18.4.
- **Done when.** A reassignment by the ops coordinator produces one offer email to the new owner, one notice to the previous one, and armed acceptance timers; a Planned card changes owner without being offered; a BD officer sees no Reassign; M2.

### B8. Industry challenge and Startup partnering playbooks

- **Ships.** The two playbooks of brief 9.1 in `kuec/playbooks/templates.json` after the ED signs them off (D4), with their playbook pages; `scripts/sync-playbooks.mjs` and `kuec/playbooks/render-playbooks.ts` run. Intake tiles 2 and 5 switched on; tile 5's "What does {startup} need?" with three choices (`journeys.md` 8.1); tile 2's uVENTURE challenge link. Views "Portfolio companies" and "Portfolio companies not engaged in 60 days".
- **Data model.** Opportunity Type options `INDUSTRY_CHALLENGE`, `STARTUP_PARTNERING`; company `portfolioRelation`; opportunity `portfolioCompany`.
- **Removes.** F16 60% (36). **Days** 2.5. **Score** 14.4.
- **Done when.** T1-style acceptance test per playbook: the work packages, owners, dates and step keys are right and created once.

### B9. Debrief: several cases from one visit or event

- **Ships.** Intake's debrief mode, `front-components/debrief.front-component.tsx` sharing Intake's modules; command `command-menu-items/debrief-this-visit.command-menu-item.ts` (record selection on engagements); entries from Company 360's engagement rows and the Project room's **Turn interest into opportunities**; route `debrief-confirm` (one `intake-confirm` per line, idempotent per line id); Home item "Debrief your visit to {company}" (an engagement I own, dated before today, with no outcome); one summary email to the ED per debrief.
- **Data model.** Opportunity `originEngagement`, `originProject`.
- **Removes.** F23 80% (40), F7 20% (10): 50. **Days** 3.5. **Score** 14.2.
- **Done when.** A three-line debrief creates three opportunities with three different playbooks, each linked to the engagement, and re-confirming creates nothing; Company 360 groups them under the visit.

### B10. Notification format

- **Ships.** `automation/notifications/compose-notification-message.ts` and `send-email.ts`: the subject leads with the action verb and stays under 70 characters; the body is the existing 20-word line, up to three fact lines, then the link on its own line; the recipient's locale (English or Arabic, Western digits); the Teams Adaptive Card gains an **Open** button. `runbooks/04-automation.md` updated (D9).
- **Removes.** F5 70% (21). **Days** 1.5. **Score** 14.0.
- **Done when.** Unit tests for every message kind in both languages; M1 and M3.

### B11. Milestones follow their work package; Agree recovery

- **Ships.** Logic `w17-milestone-follows-work`: the work package a milestone is closed by goes Done, the milestone goes Done; a daily sweep at 07:50 Asia/Dubai (`50 3 * * *`, before W10 at 08:00) marks an Open milestone Missed, with `missedAt`, when its due date has passed and its work package is not Done. `automation/rules/project-health.rule.ts`: Red only for a milestone missed after `recoveryAgreedAt`; W10 follows. Route `project-recovery`: the ED only (checked against playbook role assignments), writes as the app: Health Amber, `recoveryAgreedAt`, a Note with the plan, the new date on the closing work package and the milestone. Until B13 and B17 carry the button, a record-selection command "Agree recovery" on projects opens a small side-panel form.
- **Data model.** Milestone `missedAt`; project `recoveryAgreedAt`.
- **Removes.** F13 40% (20), F18 30% (9): 29. **Days** 2.5. **Score** 11.6.
- **Done when.** Fixed-clock tests: Done follows the work package; Missed appears on the first 07:50 after the due date and not before; Red clears only through the route and returns on the next miss.

### B12. Step facts on the card

- **Ships.** Questions asked at the moment the person knows the answer, read from `templates.json` or a step table next to the card rules: amount and close date at Commercial route scoping and at Quote or proposal; lost reason category with Don't bid; **Chased, no answer** on Follow-up with the RFQ template's third-chase Parked rule; "How many working days will the work take?" at Delivery plan (sets Execution's existing `dueOffsetBusinessDays` and the project's `endDate`); "Did the client accept the work?" at Client acceptance; a during-gate's deciders and evidence as the done-criteria checkbox text; uVENTURE hand-offs listed in Done criteria and a Task for the case owner on Signed; "uVENTURE record: not linked yet" on step 1 of a licence; stakeholder gaps ("No budget holder recorded at {company}") once B14's partnership playbook exists.
- **Data model.** Opportunity `unansweredFollowUps`.
- **Removes.** F14 90% (28). **Days** 3. **Score** 9.3.
- **Done when.** A licence case reaching Partner shortlist has Amount and Close date without anyone opening the record; the third Chased, no answer parks the case and tells the owner and the ED once.

### B13. Project room

- **Ships.** `front-components/project-room.front-component.tsx`; record page layout `page-layouts/project.page-layout.ts` (room first, then Fields, Tasks, Notes, Timeline). Header with health in words and its reason, the primary-action rule (`journeys.md` 11.3), milestones in order with their work packages, engagements with Log a contact (B6's module, project prefilled), **Close the project**, **Agree recovery** (B11's route), **Turn interest into opportunities** (B9). Workshop and campaign funnels appear when B16 lands.
- **Data model.** Engagement `project`.
- **Removes.** F13 60% (30), F18 20% (6), F7 10% (5): 41. **Days** 5. **Score** 8.2.
- **Done when.** For each project type, the room shows the right primary action at each stage of its journey; the Leadership viewer sees header and milestones only, with no error.

### B14. Long-cycle templates: partnership, portfolio support, campaign

- **Ships**, after the ED signs the content off (D5): opportunity playbook `STRATEGIC_PARTNERSHIP` (`journeys.md` section 7) and the ED's seventh Intake tile with its visibility line; project templates `PARTNERSHIP` (steering meetings, annual report, renewal decision 6 months before the contract expires), `PORTFOLIO_SUPPORT` (Need agreed, Support delivered, Outcome recorded) and `CAMPAIGN` (Objective, Target list, Outreach, Convert, Review) in `kuec/playbooks/project-templates.json`; the Intake tile "Run a campaign into a sector" with a sector picker; the Project room's "Add a workshop to this campaign".
- **Data model.** Opportunity Type option `STRATEGIC_PARTNERSHIP`; project Type options `PARTNERSHIP`, `PORTFOLIO_SUPPORT`, `CAMPAIGN`; project `targetSector`, `parentProject`; contract kind options `MOU`, `SPONSORSHIP`.
- **Removes.** F16 40% (24). **Days** 3. **Score** 8.0.
- **Done when.** T1-style test per template. If D8 creates a separate object for sponsored chairs, the partnership playbook moves to it and this item grows by that object's views and automation.

### B15. Delivery hand-off creates the project

- **Ships.** Logic `w18-delivery-project-on-signed`: on `opportunity.updated` to Signed for RFQ / technical service and Industry challenge cases, creates a project ("{opportunity}: delivery", company, opportunity, owner the least-loaded active Developer), then sets Type Delivery in a second write so W09 starts (W09 ignores created records, `runbooks/04-automation.md` section 2). One delivery project per opportunity. The Delivery hand-off card's Context links to it.
- **Removes.** F24 90% (10). **Days** 1.5. **Score** 6.6.
- **Done when.** Signing an RFQ case yields one Delivery project with five work packages and five milestones, Kick-off offered to a developer; signing again or a retry yields nothing more.

### B16. Targets: shortlists, campaign targets, invitees

- **Ships.** Object `target` (section 6) with views "Shortlist", "Campaign targets" and "Invitees"; RECORD_TABLE widgets on the opportunity record page (licence cases) and in the Project room (workshops, campaigns); Log a contact's "Where does this leave {company}?"; logic `target-follow-up` (an engagement on a target's company stamps `lastContactAt`; a daily 08:00 sweep, `0 4 * * *`, creates a follow-up Task after 10 working days without a reply and closes the target after another 10; a licence case with no target In discussion for 30 working days raises **Park it** on the ED's Home); the workshop go/no-go card 5 working days before the event, from the template's gate; Project room funnels; **Add from the registry**; the card's done-criteria checks (named contacts on a shortlist, invitees per expected attendee).
- **Data model.** Object `target`; project `expectedAttendees`.
- **Removes.** F12 90% (36). **Days** 6. **Score** 6.0.
- **Done when.** Fixed-clock tests for the 10 and 10 working-day rules and the go/no-go date; a workshop's lead and opportunity counts read correctly with zero and with several.

### B17. Portfolio

- **Ships.** `front-components/portfolio.front-component.tsx`; `page-layouts/portfolio.page-layout.ts` (STANDALONE_PAGE), its tab, a sidebar item after BD Executive. Bands, reason lines, Ready to close, **Agree recovery**, opportunities created per campaign and workshop (B9's `originProject`). Reads only Project, Milestone, Opportunity and Company.
- **Removes.** F18 50% (15). **Days** 3. **Score** 5.0.
- **Done when.** Signed in as the Leadership viewer, the page renders every band with no permission error.

### B18. Team member page and Ask for more time

- **Ships.** `front-components/team-member.front-component.tsx` on two surfaces: the side panel for a colleague (`ViewFrontComponent` with the member's id) and a standalone page "My week" for oneself, linked from Home's footer. Route `work-package-more-time` (the owner only): a Task for the ops coordinator and a Note on the work package; the request appears on the ops coordinator's Home and on Exceptions with **New due date** preset to the asked date.
- **Removes.** F20 50% (10), F2 5% (7): 17. **Days** 4. **Score** 4.2.
- **Done when.** A BD officer's request reaches the ops coordinator once, and approving it on Exceptions moves the date and re-arms W03.

### B19. Convert command on a lead

Added with the lead layer in `kuec-bd-ops` 0.9.0 (`runbooks/19-leads.md`); not yet ranked against B1 to B18.

- **Ships.** `command-menu-items/convert-lead.command-menu-item.ts` (record selection on Lead, one record) opening a small front component: the type it will create (from Offering interest, editable), the next action and date, Confirm. Route `lead-convert` (`isAuthRequired: true`) calls `convertLead` from `src/automation/leads/convert-lead.ts`, the same code L5 runs on a status change, with the request id as the conversion key. The route sets the lead to Converted itself, so the two paths cannot both convert.
- **Removes.** The status round trip for a cross-sell (Converted to Qualified to Converted, `19-leads.md` section 4).
- **Done when.** Convert on a Converted lead creates a second opportunity linked to it, a double click creates one, and a role that cannot write opportunities sees no command.

---

## 5. After four weeks: measure and re-rank

Telemetry is off and Twenty records no view analytics, so hits are counted from the app's own data, and minutes from a short timing session.

| Friction | Count from |
| --- | --- |
| F1, F3 | Work package transitions per week (timeline rows of the seven work package activity types) |
| F2 | Not countable; timing session only |
| F4, F5 | Tasks created by the app per week, and how many the app closed (B5) against how many people closed |
| F6, F14 | W04 "Set next action" tasks per week; hygiene view counts each Monday (`runbooks/14-hygiene.md`) |
| F7, F8, F9, F23 | Engagements and people created per week; engagements with no opportunity linked |
| F10, F15, F20, F21 | Reassigned, Blocked and Declined timeline rows; Notes "Due date moved" |
| F19, F22 | Opportunities created through Intake (`intakeRequestId` set) against natively; opportunities deleted within a day of creation |

Timing: 30 minutes with two BD officers and the ops coordinator, each doing five tasks the native way and the new way (accept and submit a step, set a next step, log a contact, reassign, open a case). Replace the estimates in `journeys.md` section 13 with the measured figures, recompute section 3, and re-order everything not yet built. An item whose score drops below 3 gets a second look before it is built.

---

## 6. Data model additions

All additive. App-stamped fields get `writability: APPLICATION`; every field BD roles must not write is added to the role locks and to `roles.test.ts` in the same change.

| Item | Object | Field (API name) | Type | Label | Written by |
| --- | --- | --- | --- | --- | --- |
| B1 | Work package | `outputLink` | LINKS | SharePoint link | owner |
| B1 | Work package | `outcome` | SELECT: `BID`, `NO_BID`, `CLIENT_YES`, `CLIENT_NO`, `NO_ANSWER`, `SIGNED`, `NOT_SIGNED`, `ACCEPTED_BY_CLIENT`, `CHANGES_REQUESTED` | Outcome | owner |
| B1 | Work package | `blockAcknowledgedAt` | DATE_TIME | Block seen by ED at | the ED (locked for every other role) |
| B4 | Opportunity | `uventureRecord` | LINKS | uVENTURE record | owner |
| B4 | Opportunity | `intakeRequestId` | TEXT | Intake request id | app |
| B4 | Opportunity | `deadlineRiskFlaggedAt` | DATE_TIME | Deadline risk flagged at | app |
| B4 | Opportunity | `deadlineRiskAcknowledgedAt` | DATE_TIME | Deadline risk accepted at | the ED |
| B6 | Person | `influence` | SELECT: `HIGH`, `MEDIUM`, `LOW` | Influence | BD roles |
| B8 | Opportunity | `playbookType` options | `INDUSTRY_CHALLENGE`, `STARTUP_PARTNERING` | Industry challenge, Startup partnering | n/a |
| B8 | Company | `portfolioRelation` | SELECT: `PORTFOLIO_STARTUP`, `SUBSIDIARY` | Portfolio relation | BD roles |
| B8 | Opportunity | `portfolioCompany` | RELATION, many to one Company (inverse on Company: "Startup cases") | Startup | owner |
| B9 | Opportunity | `originEngagement` | RELATION, many to one Engagement (inverse: "Cases from this") | From visit or meeting | app (Debrief) |
| B9 | Opportunity | `originProject` | RELATION, many to one Project (inverse: "Cases from this") | From workshop or campaign | app (Debrief) |
| B11 | Milestone | `missedAt` | DATE_TIME | Missed at | app |
| B11 | Project | `recoveryAgreedAt` | DATE_TIME | Recovery agreed at | app |
| B12 | Opportunity | `unansweredFollowUps` | NUMBER | Unanswered follow-ups | owner (card) |
| B13 | Engagement | `project` | RELATION, many to one Project (inverse: "Engagements") | Project | BD roles |
| B14 | Opportunity | `playbookType` option | `STRATEGIC_PARTNERSHIP` | Strategic partnership | n/a |
| B14 | Project | `playbookType` options | `PARTNERSHIP`, `PORTFOLIO_SUPPORT`, `CAMPAIGN` | Partnership, Portfolio support, Campaign | n/a |
| B14 | Project | `targetSector` | SELECT, the company Sector options | Target sector | owner |
| B14 | Project | `parentProject` | RELATION, many to one Project (inverse: "Projects in this campaign") | Part of campaign | owner |
| B14 | Contract | `kind` options | `MOU`, `SPONSORSHIP` | MoU, Sponsorship agreement | n/a |
| B16 | Target (new object) | `name` (TEXT, "{company}: {list}"), `company` (relation), `person` (relation), `opportunity` (relation), `project` (relation), `status` (SELECT: `SHORTLISTED`, `TO_CONTACT`, `CONTACTED`, `IN_DISCUSSION`, `DECLINED`, `CLOSED`, `TO_INVITE`, `INVITED`, `REGISTERED`, `ATTENDED`, `NO_SHOW`, `INTERESTED`, `OPPORTUNITY_CREATED`, `NO_FIT`), `rank` (NUMBER), `fitRationale` (TEXT), `owner` (relation to workspace member), `lastContactAt`, `followUpDueAt` (DATE_TIME, app), `followUpCount` (NUMBER, app) | | Target | BD roles; stamps by app |
| B16 | Project | `expectedAttendees` | NUMBER | Expected attendees | owner (card) |

Every new field that a role may not write follows `13-roles.md` section 2. The Leadership viewer gets no read on Target (it carries people).

## 7. Logic functions added

All follow `kuec/CLAUDE.md` section 7 and 8: pure rules tested on a fixed clock, event fast path plus sweep where a lost event matters, nothing on `*.created`, Asia/Dubai working days, idempotent.

| Item | Function | Trigger | Writes as |
| --- | --- | --- | --- |
| B1 | `work-package-help` | HTTP route, `isAuthRequired: true` | person (Task, Note) |
| B1 | `w13-declined-and-sent-back` | `workPackage.updated`, `status` | person (tasks) |
| B1 | `w14-apply-outcome` | `workPackage.updated`, `status`, gated on Done with `outcome` | app (stage), person (tasks) |
| B1 | `w15-closed-case-stops-work` | `opportunity.updated`, `stage`; hourly sweep | app |
| B2 | `work-package-nudge` | HTTP route | app (email) |
| B4 | `intake-preview`, `intake-confirm` | HTTP routes | read-only; app |
| B4 | `w12-stage-follows-step` | `workPackage.updated`, `status`, gated on Offered; hourly sweep | app |
| B5 | `notification-task-close` | updates on work package, opportunity, project; `15 * * * *` | app |
| B7 | `w16-work-package-reassigned` | `workPackage.updated`, `ownerId` | person (task, email) |
| B9 | `debrief-confirm` | HTTP route | app |
| B11 | `w17-milestone-follows-work` | `workPackage.updated`, `status`; `50 3 * * *` (07:50 Asia/Dubai) | app |
| B11 | `project-recovery` | HTTP route, the ED only | app |
| B15 | `w18-delivery-project-on-signed` | `opportunity.updated`, `stage` | app |
| B16 | `target-follow-up` | `engagement.updated` on `date`; `0 4 * * *` (08:00 Asia/Dubai) | app |
| B18 | `work-package-more-time` | HTTP route, the owner only | person (Task, Note) |
| B19 | `lead-convert` | HTTP route, a role that writes opportunities | person (opportunity); app (links) |

## 8. Decisions for the ED

| # | Decision | Recommended | Gates |
| --- | --- | --- | --- |
| D1 | Who reassigns declined work first | The ops coordinator; the ED sees it only after 1 working day without a new owner. The brief (3.3) gives it to the ED; `10-cadence-en.md` already tells the team the ops coordinator does it | B1, B2 |
| D2 | Who answers Request help | The reviewer, then the case owner, then the ED (the brief). Today it goes to the ops coordinator | B1 |
| D3 | Sign off the Delivery and Proposal project templates, still marked "draft for ED review" | Sign off, with B12's execution-length question | B15, Journey 8 |
| D4 | Sign off Industry challenge and Startup partnering (brief 9.1) | Sign off | B8 |
| D5 | Sign off the Strategic partnership playbook and the Partnership, Portfolio support and Campaign templates (`journeys.md` sections 7 to 9) | Sign off after one dry run each on staging | B14 |
| D6 | Which role step owners hold (P4) | Give the Engineer and department roles the BD officer's work package grant, rather than moving people to the BD officer role and its wider writes | Everything |
| D7 | BD officers write `outcome` and `outputLink` on work packages | Yes, like `13-roles.md` decision 4 | B1 |
| D8 | Sponsored chairs and offset deals as separate objects (`13-roles.md` decision 1) | Decide before the first sponsored chair is recorded; until then Journey 5 runs on Opportunity, visible to all its readers | B14 |
| D9 | Emails longer than the 20-word line | Yes: the line stays first; up to three fact lines follow | B10 |
| D10 | How Red is cleared | The ED agrees a recovery, which sets At risk; a new miss turns it Red again | B11 |
| D11 | W04 runs on Saturdays and Sundays (`tests/report.md`, T4) | Skip non-working days; with B5 the weekend tasks would close themselves anyway | B5 |

## 9. Phone acceptance checks

| # | Check |
| --- | --- |
| M1 | Every notification link, opened from Outlook mobile on iOS and Android at 390 x 844, shows the card's badge, due label and buttons without scrolling |
| M2 | Home and the Team board at 360, 390 and 430 px: no horizontal scroll, every button at least 44 px high, Accept and Reassign complete with the keyboard open |
| M3 | With an expired session, the link signs the person in and returns to the linked record, not to Home. If it does not, the email names the record so it can be searched, and the gap is reported upstream (no core change) |
