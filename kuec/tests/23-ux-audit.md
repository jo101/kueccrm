**NOT READY to invite users.** The app still cannot be installed as committed and its playbooks never tell the first step's owner (gate 22, B1 to B5, all open); a new member is stopped on Twenty's "Invite your team" screen until the ED clears it; a Commercialization member sees Accept on their work but can never accept; and the fresh-eyes test has not been run, because the Help page it relies on does not exist at the address in the sidebar.

# 23: UX audit, kuec-bd-ops 0.11.0 on Twenty 2.48.0

Run on 2026-10-17 (Saturday) against `main` at `aa3ce98c`. The app is the one gate 22 audited at `91aaf4fc`: nothing under `kuec/app` has changed since. Run by engineering on a rehearsal of the pinned image; the two fresh-eyes participants have not taken part yet (section 2). Inputs: `kuec/CLAUDE.md`, `design/wireframes.md`, `design/journeys.md`, `runbooks/20-guidance.md`, `runbooks/10-onboarding.md`, `runbooks/05-views.md` and `tests/22-release-gate.md`.

Evidence: `kuec/tests/ux-audit/evidence/`. `checks.csv` holds one row per screen per check (925 rows); the JSON files hold what the scripts measured; `shots/` holds 20 screenshots, cited below as ux-01 to ux-20. The scripts are in `kuec/tests/ux-audit/` (section 6).

Contents

0. Go or no-go, for the ED
1. Consistency checklist
2. Fresh-eyes test
3. Gap sweep
4. Findings
5. Fix list by owner and date
6. How it was run, and how to run it again

---

## 0. Go or no-go, for the ED

**Not ready to invite users.** Four things stop it, each on its own:

1. **The release gate is still failing.** All 13 Blockers and 9 Majors of gate 22 are open; no fix has shipped since it opened. The committed app does not install on 2.48.0 (B1 to B3), and when a playbook starts, its first owner is never told (B5, reproduced again here on both playbook types).
2. **A new member's first screen stops them.** Until an admin finishes Twenty's own "Invite your team" step in the browser, every member who signs in lands on it, and "Skip anyway" answers "User does not have permission." (U1, ux-01). Two clicks by the ED (Skip, then Skip anyway) clear it for everyone, but no runbook says so.
3. **Department staff cannot do the work they are given.** A member on the Commercialization role (or any department role) sees Accept and Decline on their own work package, and Accept answers "That didn't save. Nothing was changed. Try again." (U2, ux-07); Decline and Submit change the same record and cannot work either. After 5 working days the work is taken from them. The ED's decision on who may hold a step (backlog P4, decision D6) is still open.
4. **Nobody new has tried it.** The fresh-eyes test needs the Help page, and the sidebar's Help link points at `kuac.sharepoint.com`, which does not exist (gate M6). A desk walkthrough predicts all three targets would be missed (section 2.4).

### Scorecard: the five layers of gate 22

Counts from `22-release-gate.md`, re-checked against this run. Each gate finding is counted once, in the first layer its gate line names. Nothing ran on staging or production: neither exists.

| Layer | Rehearsal pass | Fail | Not run | Staging, production | Open Blockers | Open Majors | Open Minors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Wiring inventory | 18 of 27 | 7 | 2 | not run | 4 (B1, B2, B3, B4) | 3 (M4, M5, M6) | 2 (m1, m2) |
| 2 End-to-end journeys | 2 of 8 | 5 | 1 | not run | 3 (B5, B6, B7) | 2 (M3, M8) | 2 (m7, m8) |
| 3 Permissions and security | 7 of 16 | 6 | 3 | not run | 5 (B9 to B13) | 1 (M2) | 2 (m5, m6) |
| 4 Data integrity | 4 of 9 | 1 | 4 | not run | 0 | 0 | 1 (m3) |
| 5 Reliability and operations | 3 of 10 | 5 | 2 | not run | 1 (B8) | 3 (M1, M7, M9) | 2 (m4, m9) |
| **Gate 22 total** | **34 of 70** | **24** | **12** | **not run** | **13** | **9** | **9** |

What this run saw of the gate's findings: B5 reproduced (both opportunity playbooks create their work packages and stop: `playbookApplied` false, no Confirm plan, no offer task); M4 partly reproduced (on Opportunity, Company and Person the guidance widget now renders, but below Twenty's Fields list, and the app's fields still sit under "System", ux-08); M5 not reproduced (the guidance and the Thursday update rendered; the count "Signed licences this year" reads "0 / 2", ux-10); M6, m1 and m2 confirmed; m7 is worse than the gate recorded (U1). None of these closes a gate item: each still has to pass on staging.

### Scorecard: this audit

| Layer | Screens | Checks | Pass | Fail | n/a |
| --- | --- | --- | --- | --- | --- |
| 1.1 Record pages | 16 | 144 | 76 | 54 | 14 |
| 1.2 Dashboard tabs | 12 | 84 | 38 | 24 | 22 |
| 1.3 Views | 140 | 510 | 397 | 102 | 11 |
| 1.4 Default view per object | 16 | 16 | 11 | 5 | 0 |
| 1.5 Lists and options | 49 | 147 | 122 | 6 | 19 |
| 1.6 Front components | 4 | 17 | 8 | 9 | 0 |
| 1.7 Sidebar, first sign-in, workspace | 3 | 7 | 0 | 7 | 0 |
| **Consistency checklist** | **240** | **925** | **652** | **207** | **66** |
| 2 Fresh-eyes test | 2 people | 3 targets | not run | predicted 3 of 3 missed | |
| 3.1 Gap sweep: taxonomy | 4 lists | 85 values, 110 records | 110 saved | 0 refused | 12 structural gaps |
| 3.2 Gap sweep: eight journeys | 8 | 48 steps | 5 supported | 4 missing | 39 with a workaround |

New findings of this audit (section 4): **0 Blockers, 10 Majors, 15 Minors.** Severity as in gate 22: Blocker (data loss, wrong routing, security, silent failure), Major (a journey cannot complete without a workaround), Minor (cosmetic or wording).

### Fresh-eyes results

**Not run.** Two people who have never opened the CRM (a business development officer and a member of the Commercialization department) are not available to engineering, and the test as briefed cannot be run while its preconditions fail: the Help page does not exist at its link (M6), a new member is stopped at "Invite your team" unless the ED clears it (U1), and the Commercialization participant's task cannot be done on their role (U2). Section 2 holds the protocol and the record sheet, ready for the ops coordinator, and a desk walkthrough that predicts where each person will hesitate:

| Target | Predicted | Why |
| --- | --- | --- |
| Day-one checklist under 20 minutes | Missed by both | The checklist itself says "about 30 minutes"; the Commercialization participant cannot pass question 3 (U2); both hesitate at the card's position and its "In progress" badge (U5, U10) |
| First lead logged under 90 seconds | Missed | About 20 interactions: a 38-field panel with Company and Person near the bottom, and the person's email and phone on a second record (U16) |
| Work package accepted and submitted without a question | Missed | Impossible on the Commercialization role (U2); on any role, "the card below" sits under 31 fields and its badge contradicts the checklist (U5, U10) |

Each predicted hesitation is already a label or guidance-text fix in section 5; the real sessions will add or remove rows.

### Accepted risks

**None.** Nothing in the repository records the ED accepting a risk (gate B12: the two files that need the ED's initials are unsigned). Proposed for the ED's initials, each with what stands in for it:

| # | Risk | What stands in for it |
| --- | --- | --- |
| R1 | Option descriptions never show on hover in 2.48 | The Help page's taxonomy section (20-guidance.md section 5) and the card's status tooltip |
| R2 | Option labels stay English for an Arabic-language member | Arabic texts quote option labels as they appear (20-guidance.md section 1) |
| R3 | Seven deprecated options stay selectable next to their replacements, because deleting an option deletes its data | Labels end in "(deprecated)"; the Data quality page and the quarterly review catch new uses |
| R4 | The 12 "Everything (expert)" views show 7 to 31 columns (gate m1) | Not in the sidebar, last in every picker, for checks and exports only |
| R5 | Field descriptions show on the record page only, not on table headers or kanban cards | Hover the field on the record, or Help section 4 |
| R6 | Record pages keep Twenty's tabs (Home, Timeline, Tasks, Notes, Files and, on standard objects, Emails, Conversations, Calendar) instead of Overview, Work, Communication, Details | Only if the ED decides not to build the four-tab model (U14) |
| R7 | Twenty's tag palette puts the green, turquoise and yellow status tags at 4.17 to 4.46:1, just under 4.5:1 | Each tag also carries its word |

### Fixes shipped since the gate opened

**None.** `main` moved from `91aaf4fc` to `aa3ce98c` with the gate 22 report and its evidence only (`git diff --stat 91aaf4fc aa3ce98c`: 59 files, all under `kuec/tests/`), and no pull request is open.

### Remaining fix list, before the first invitation

The full list, 55 rows with owner and date, is section 5. These must be done first; dates are proposed and each owner confirms or moves theirs at the Monday standup on 19 October.

| What | Owner | Due |
| --- | --- | --- |
| Gate B1 to B3 (install), M1 and M2 (install order, lockfile), U6 (Hijri dates) | Engineering lead | Tue 20 Oct |
| ED decisions: who may hold a step (D6, U2), one set of status words (U10), admin rights (B10), the risks above and gate B12 and B13 | ED | Tue 20 to Thu 22 Oct |
| Gate B5 and M3 (playbooks finish and tell the owner), U3 (one offer task, not four) | Engineering lead | Thu 22 Oct |
| Help page at the address IT confirms, with its eight sections; `HELP_PAGE_URL` corrected (M6) | Ops coordinator, engineering lead, KUEC IT | Thu 22 Oct |
| Gate B4, B6 to B8, B11, M4, M7, M8; U2, U4, U5, U7 (Files tab), U8 | Engineering lead, deploy engineer | Tue 27 to Thu 29 Oct |
| Staging built per `01-deploy.md` sections 3 to 11, with the ED skipping "Invite your team" (U1), the sample records deleted (U21) and the sidebar runbook applied (U20) | Deploy engineer, ED, ops coordinator | Mon 2 Nov |
| Fresh-eyes sessions on staging, two people, section 2.2 | Ops coordinator | Wed 4 Nov |
| Gate 22 rerun on staging, then production | Engineering lead, ops coordinator | Thu 5 Nov, Mon 9 Nov |
| Go or no-go review with this page updated | ED | Tue 10 Nov |

### In one line

**Not ready: invite nobody until gate 22's Blockers and Majors are closed on staging, the ED has cleared Twenty's onboarding step and decided who may hold a work package, and two new people have finished the day-one checklist and one real task each using only a Help page that exists.**

---

## 1. Consistency checklist

Every object's record page, every dashboard tab, every view, every select list and the one front component, checked against the brief's list. Each row is one screen and one check. "Pass" and "Fail" are against the rule as written in `wireframes.md`, `05-views.md` and `20-guidance.md`; where those documents agree an exception (no date column on People views, for example), the exception passes and the row says so. The same rows are in `evidence/checks.csv`.

How each kind of row was decided:

- **Computed** from the live workspace metadata (`dump-model.mjs` into `evidence/model.json`): tabs and widget order, the six-column and column-order rules, sorts, descriptions, orphan fields, options, Arabic catalog coverage.
- **Observed** in Chromium against the rehearsal, signed in as Bader (business development officer), Bushra (business development officer, Arabic interface), Imran (IP office, a department role with the same permissions as Commercialization) and the ED: hover, focus order, keyboard, toasts, the pending state on a slow network, contrast, phone width (390 x 844), right to left.
- Twenty's own entities are checked too, because a first-week employee meets them in the same sidebar.

### 1.1 Record pages

Agreed widget order for the Home tab, from `20-guidance.md` section 3 and `wireframes.md` section 1.1: "How this record works", then the object's own front component (the work package card), then Twenty's Fields list, then related lists, then Documents.

<!-- generated:recordPages -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| Company | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files, Emails, Conversations, Calendar. |
| Company | RP2 Guidance widget first | **Fail** | Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08). |
| Company | RP3 Widget order matches the agreed order | **Fail** | Home tab: Fields, How this record works, People, Opportunities, Documents. |
| Company | RP4 Every field shows a KUEC description on hover | **Fail** | App fields show their description on hover (ux-20); 5 of Twenty's own fields keep Twenty's one-liners, e.g. Name: "The company name". |
| Company | RP5 Every option shows its description on hover | **Fail** | 4 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Company | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| Company | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| Company | RP8 No orphan fields | Pass | 0 orphan field(s); 9 field(s) appear only on the record page and in Everything (expert). |
| Company | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Person | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files, Emails, Conversations, Calendar. |
| Person | RP2 Guidance widget first | **Fail** | Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08). |
| Person | RP3 Widget order matches the agreed order | **Fail** | Home tab: Fields, How this record works, Company, Opportunities, Lists, Documents. |
| Person | RP4 Every field shows a KUEC description on hover | **Fail** | App fields show their description on hover (ux-20); 5 of Twenty's own fields keep Twenty's one-liners, e.g. Name: "Contact's name". |
| Person | RP5 Every option shows its description on hover | **Fail** | 1 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Person | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| Person | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| Person | RP8 No orphan fields | Pass | 0 orphan field(s); 4 field(s) appear only on the record page and in Everything (expert). |
| Person | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Opportunity | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files, Emails, Conversations, Calendar. |
| Opportunity | RP2 Guidance widget first | **Fail** | Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08). |
| Opportunity | RP3 Widget order matches the agreed order | **Fail** | Home tab: Fields, How this record works, Point of Contact, SharePoint folder, Company, Owner, Documents. |
| Opportunity | RP4 Every field shows a KUEC description on hover | **Fail** | App fields show their description on hover (ux-20); 4 of Twenty's own fields keep Twenty's one-liners, e.g. Stage: "Opportunity stage". |
| Opportunity | RP5 Every option shows its description on hover | **Fail** | 8 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Opportunity | RP6 Same status words everywhere | **Fail** | Stage shows New, Screening, Meeting, Proposal and Customer; the views, Data quality and the guidance say Qualify ("Hygiene: in Qualify over 30 days"), and Customer is still an active column (P3 click-runbook not written). |
| Opportunity | RP7 Status and health colours identical everywhere | **Fail** | Stage New is red, the same red as Lost and as Blocked on work packages; it shows red on the Pipeline kanban and the BD charts. |
| Opportunity | RP8 No orphan fields | Pass | 0 orphan field(s); 18 field(s) appear only on the record page and in Everything (expert). |
| Opportunity | RP9 Arabic present and right to left | **Fail** | Widget title "SharePoint folder" has no Arabic. Labels, descriptions and the guidance are in Arabic and the page mirrors. |
| Note | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Note. |
| Note | RP2 Guidance widget first | **Fail** | Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08). |
| Note | RP3 Widget order matches the agreed order | **Fail** | Home tab: Fields, How this record works, Note. |
| Note | RP4 Every field shows a KUEC description on hover | **Fail** | App fields show their description on hover (ux-20); 2 of Twenty's own fields keep Twenty's one-liners, e.g. Title: "Note title". |
| Note | RP5 Every option shows its description on hover | n/a | No select field. |
| Note | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| Note | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| Note | RP8 No orphan fields | Pass | 0 orphan field(s); 0 field(s) appear only on the record page and in Everything (expert). |
| Note | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Task | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Note. |
| Task | RP2 Guidance widget first | **Fail** | Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08). |
| Task | RP3 Widget order matches the agreed order | **Fail** | Home tab: Fields, How this record works, Task. |
| Task | RP4 Every field shows a KUEC description on hover | **Fail** | App fields show their description on hover (ux-20); 4 of Twenty's own fields keep Twenty's one-liners, e.g. Title: "Task title". |
| Task | RP5 Every option shows its description on hover | **Fail** | 2 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Task | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Task | RP7 Status and health colours identical everywhere | Pass | Twenty task status colours, the same everywhere. |
| Task | RP8 No orphan fields | Pass | 0 orphan field(s); 0 field(s) appear only on the record page and in Everything (expert). |
| Task | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Lead | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Lead | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Lead | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields, Documents. |
| Lead | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Lead | RP5 Every option shows its description on hover | **Fail** | 6 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Lead | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Lead | RP7 Status and health colours identical everywhere | Pass | Status colours match on Lead inbox, My leads and the BD charts. |
| Lead | RP8 No orphan fields | Pass | 0 orphan field(s); 20 field(s) appear only on the record page and in Everything (expert). |
| Lead | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Engagement | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Engagement | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Engagement | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Engagement | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Engagement | RP5 Every option shows its description on hover | **Fail** | 3 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Engagement | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| Engagement | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| Engagement | RP8 No orphan fields | Pass | 0 orphan field(s); 4 field(s) appear only on the record page and in Everything (expert). |
| Engagement | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Project | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Project | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Project | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields, Documents. |
| Project | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Project | RP5 Every option shows its description on hover | **Fail** | 8 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Project | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Project | RP7 Status and health colours identical everywhere | Pass | Health Green, Amber, Red and Status colours match on Portfolio, By health and the BD charts. |
| Project | RP8 No orphan fields | Pass | 0 orphan field(s); 11 field(s) appear only on the record page and in Everything (expert). |
| Project | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Milestone | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Milestone | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Milestone | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Milestone | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Milestone | RP5 Every option shows its description on hover | **Fail** | 2 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Milestone | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Milestone | RP7 Status and health colours identical everywhere | Pass | Open blue, Done green, Missed red, the same on every view. |
| Milestone | RP8 No orphan fields | Pass | 0 orphan field(s); 2 field(s) appear only on the record page and in Everything (expert). |
| Milestone | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Work package | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Work package | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Work package | RP3 Widget order matches the agreed order | **Fail** | Home tab: How this record works, Fields, Work package. The card comes after the 31-field list; wireframes 1.1 puts it first. |
| Work package | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Work package | RP5 Every option shows its description on hover | **Fail** | 2 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Work package | RP6 Same status words everywhere | **Fail** | The card badge says Not started, Waiting to be accepted, In progress, Waiting for review and Stopped; the Status field, the views and the timeline on the same page say Planned, Offered, Accepted, Submitted and Cancelled (ux-04). |
| Work package | RP7 Status and health colours identical everywhere | Pass | Card badge colours equal the Status option colours (gray, sky, blue, purple, red, green, orange, gray) on views, kanban and the BD Team chart (ux-09). |
| Work package | RP8 No orphan fields | Pass | 0 orphan field(s); 14 field(s) appear only on the record page and in Everything (expert). |
| Work package | RP9 Arabic present and right to left | **Fail** | Widget title "Work package" has no Arabic; the card shows due dates in the Hijri calendar for ar-SA (ux-16). Labels, descriptions and the guidance are in Arabic and the page mirrors. |
| Contract | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Contract | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Contract | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields, SharePoint folder, Documents. |
| Contract | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Contract | RP5 Every option shows its description on hover | **Fail** | 4 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Contract | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Contract | RP7 Status and health colours identical everywhere | **Fail** | Status Expired is gray on contracts and red on documents. |
| Contract | RP8 No orphan fields | Pass | 0 orphan field(s); 6 field(s) appear only on the record page and in Everything (expert). |
| Contract | RP9 Arabic present and right to left | **Fail** | Widget title "SharePoint folder" has no Arabic. Labels, descriptions and the guidance are in Arabic and the page mirrors. |
| Document | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Document | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Document | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Document | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Document | RP5 Every option shows its description on hover | **Fail** | 4 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Document | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Document | RP7 Status and health colours identical everywhere | **Fail** | Status Expired is red on documents and gray on contracts. |
| Document | RP8 No orphan fields | Pass | 0 orphan field(s); 8 field(s) appear only on the record page and in Everything (expert). |
| Document | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Playbook role assignment | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Playbook role assignment | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Playbook role assignment | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Playbook role assignment | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Playbook role assignment | RP5 Every option shows its description on hover | **Fail** | 1 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Playbook role assignment | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| Playbook role assignment | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| Playbook role assignment | RP8 No orphan fields | Pass | 0 orphan field(s); 3 field(s) appear only on the record page and in Everything (expert). |
| Playbook role assignment | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| UAE public holiday | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| UAE public holiday | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| UAE public holiday | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| UAE public holiday | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| UAE public holiday | RP5 Every option shows its description on hover | n/a | No select field. |
| UAE public holiday | RP6 Same status words everywhere | n/a | Status options read the same on the page, the views and the guidance. |
| UAE public holiday | RP7 Status and health colours identical everywhere | n/a | No status or health field. |
| UAE public holiday | RP8 No orphan fields | Pass | 0 orphan field(s); 1 field(s) appear only on the record page and in Everything (expert). |
| UAE public holiday | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Capability | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Capability | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Capability | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Capability | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Capability | RP5 Every option shows its description on hover | **Fail** | 3 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Capability | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Capability | RP7 Status and health colours identical everywhere | Pass | Status colours match on every capability view. |
| Capability | RP8 No orphan fields | Pass | 0 orphan field(s); 6 field(s) appear only on the record page and in Everything (expert). |
| Capability | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
| Campaign target | RP1 Tabs are Overview, Work, Communication, Details | **Fail** | Tabs: Home, Timeline, Tasks, Notes, Files. |
| Campaign target | RP2 Guidance widget first | Pass | How this record works opens the Home tab. |
| Campaign target | RP3 Widget order matches the agreed order | Pass | Home tab: How this record works, Fields. |
| Campaign target | RP4 Every field shows a KUEC description on hover | Pass | Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20). |
| Campaign target | RP5 Every option shows its description on hover | **Fail** | 1 select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1). |
| Campaign target | RP6 Same status words everywhere | Pass | Status options read the same on the page, the views and the guidance. |
| Campaign target | RP7 Status and health colours identical everywhere | Pass | Status colours match on To work and the Campaign pack. |
| Campaign target | RP8 No orphan fields | Pass | 0 orphan field(s); 0 field(s) appear only on the record page and in Everything (expert). |
| Campaign target | RP9 Arabic present and right to left | Pass | Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit). |
<!-- /generated:recordPages -->

### 1.2 Dashboard tabs

<!-- generated:dashboardTabs -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| BD dashboard > Executive | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Executive | DT2 Tables: at most 6 columns, agreed order, agreed sort | **Fail** | 15 of 16 tables follow the rule; BD: Contracts in negotiation: order Name, Owner, Counterparty, no sort. |
| BD dashboard > Executive | DT3 Status and health colours identical to the records | **Fail** | Opportunity Stage appears (chart or column): New shows red like Lost. |
| BD dashboard > Executive | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 38 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Executive | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| BD dashboard > Executive | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| BD dashboard > Executive | DT7 Every widget resolves | **Fail** | Guidance and Thursday update render (gate M5 not reproduced in this run), but the count "Signed licences this year" reads "0 / 2" (ux-10). |
| BD dashboard > Team | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Team | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 12 tables follow the rule of 05-views.md (documented no-date lists included). |
| BD dashboard > Team | DT3 Status and health colours identical to the records | **Fail** | Opportunity Stage appears (chart or column): New shows red like Lost. |
| BD dashboard > Team | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 24 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Team | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| BD dashboard > Team | DT6 Usable at phone width | **Fail** | At 390 px the guidance clips its Arabic lines; the tab bar scrolls sideways; charts and tables stack and stay usable (ux-15). |
| BD dashboard > Team | DT7 Every widget resolves | Pass | Every widget rendered. |
| BD dashboard > Mine | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Mine | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 6 tables follow the rule of 05-views.md (documented no-date lists included). |
| BD dashboard > Mine | DT3 Status and health colours identical to the records | **Fail** | Opportunity Stage appears (chart or column): New shows red like Lost. |
| BD dashboard > Mine | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 14 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Mine | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| BD dashboard > Mine | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| BD dashboard > Mine | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
| BD dashboard > Pipeline pack | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Pipeline pack | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 6 tables follow the rule of 05-views.md (documented no-date lists included). |
| BD dashboard > Pipeline pack | DT3 Status and health colours identical to the records | **Fail** | Opportunity Stage appears (chart or column): New shows red like Lost. |
| BD dashboard > Pipeline pack | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 10 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Pipeline pack | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| BD dashboard > Pipeline pack | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| BD dashboard > Pipeline pack | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
| BD dashboard > Project pack | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Project pack | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 3 tables follow the rule of 05-views.md (documented no-date lists included). |
| BD dashboard > Project pack | DT3 Status and health colours identical to the records | Pass | Status and health tags and stacked bars use the option colours (ux-09). |
| BD dashboard > Project pack | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 5 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Project pack | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| BD dashboard > Project pack | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| BD dashboard > Project pack | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
| BD dashboard > Campaign pack | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| BD dashboard > Campaign pack | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 3 tables follow the rule of 05-views.md (documented no-date lists included). |
| BD dashboard > Campaign pack | DT3 Status and health colours identical to the records | Pass | Status and health tags and stacked bars use the option colours (ux-09). |
| BD dashboard > Campaign pack | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 7 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| BD dashboard > Campaign pack | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| BD dashboard > Campaign pack | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| BD dashboard > Campaign pack | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
| Exceptions | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| Exceptions | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 3 tables follow the rule of 05-views.md (documented no-date lists included). |
| Exceptions | DT3 Status and health colours identical to the records | **Fail** | Opportunity Stage appears (chart or column): New shows red like Lost. |
| Exceptions | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 4 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| Exceptions | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| Exceptions | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| Exceptions | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
| Home | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| Home | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 3 tables follow the rule of 05-views.md (documented no-date lists included). |
| Home | DT3 Status and health colours identical to the records | Pass | Status and health tags and stacked bars use the option colours (ux-09). |
| Home | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 4 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| Home | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| Home | DT6 Usable at phone width | **Fail** | At 390 px the guidance fills the first screen and clips its Arabic lines; each table shows Title and Owner only (ux-13). |
| Home | DT7 Every widget resolves | Pass | Every widget rendered. |
| uVENTURE > Technologies | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| uVENTURE > Technologies | DT2 Tables: at most 6 columns, agreed order, agreed sort | n/a | No table. |
| uVENTURE > Technologies | DT3 Status and health colours identical to the records | n/a | No status shown. |
| uVENTURE > Technologies | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 2 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| uVENTURE > Technologies | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| uVENTURE > Technologies | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| uVENTURE > Technologies | DT7 Every widget resolves | **Fail** | The iframe points at uventure.kuec.example, which does not resolve (gate M6). |
| uVENTURE > Equipment and labs | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| uVENTURE > Equipment and labs | DT2 Tables: at most 6 columns, agreed order, agreed sort | n/a | No table. |
| uVENTURE > Equipment and labs | DT3 Status and health colours identical to the records | n/a | No status shown. |
| uVENTURE > Equipment and labs | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 2 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| uVENTURE > Equipment and labs | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| uVENTURE > Equipment and labs | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| uVENTURE > Equipment and labs | DT7 Every widget resolves | **Fail** | The iframe points at uventure.kuec.example, which does not resolve (gate M6). |
| uVENTURE > Challenges | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| uVENTURE > Challenges | DT2 Tables: at most 6 columns, agreed order, agreed sort | n/a | No table. |
| uVENTURE > Challenges | DT3 Status and health colours identical to the records | n/a | No status shown. |
| uVENTURE > Challenges | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 1 of 2 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| uVENTURE > Challenges | DT5 Request help named where work packages are shown | n/a | Shows no work package. |
| uVENTURE > Challenges | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| uVENTURE > Challenges | DT7 Every widget resolves | **Fail** | The iframe points at uventure.kuec.example, which does not resolve (gate M6). |
| Data quality | DT1 Guidance widget first | Pass | How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json). |
| Data quality | DT2 Tables: at most 6 columns, agreed order, agreed sort | Pass | All 18 tables follow the rule of 05-views.md (documented no-date lists included). |
| Data quality | DT3 Status and health colours identical to the records | Pass | Status and health tags and stacked bars use the option colours (ux-09). |
| Data quality | DT4 Arabic present and right to left | **Fail** | Tab title has no Arabic; 21 of 37 widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned. |
| Data quality | DT5 Request help named where work packages are shown | Pass | Line 5 names Request help. |
| Data quality | DT6 Usable at phone width | n/a | Not required on a phone (journeys.md 12.4). |
| Data quality | DT7 Every widget resolves | Pass | Every widget rendered, none empty or erroring (tabs-desktop-bd1.json). |
<!-- /generated:dashboardTabs -->

### 1.3 Views

One row per view a person can open: every picker view on the 16 business objects (Twenty's "All ..." view counts only where it is the object's only view) and every table or kanban behind a dashboard widget. The rule (`05-views.md` section 3): name, owner (Company on People, Kind on Capability, Campaign on Campaign target), the date that matters, at most three more, sorted on that date. "Hygiene: Other without details", "Documents by type" and the People views without a date have no date and no sort by agreement. Dashboard widget views have no name of their own on screen, so V4 does not apply to them. In `checks.csv` each row below is four rows.

<!-- generated:views -->
| Object | View | Type | Columns | V1 ≤ 6 | V2 Order | V3 Sort | V4 Arabic | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| campaignTarget | Everything (expert) | table | 7 | Fail | Pass | Fail | Fail | expert view: documented exception, needs the ED (gate m1) |
| campaignTarget | To work | table | 5 | Pass | Pass | Pass | Fail |  |
| campaignTarget | Campaign pack: campaign targets | table widget | 5 | Pass | Pass | Pass | n/a |  |
| capability | All capabilities | table | 6 | Pass | Pass | Pass | Fail |  |
| capability | Everything (expert) | table | 10 | Fail | Pass | Fail | Fail | expert view: documented exception, needs the ED (gate m1) |
| capability | Not available to offer | table | 6 | Pass | Pass | Pass | Fail |  |
| capability | Not seen in uVENTURE for 7 days | table | 6 | Pass | Pass | Pass | Fail |  |
| company | Added in the last 7 days | table | 6 | Pass | Pass | Pass | Fail |  |
| company | All Companies | table | 7 | Fail | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| company | By sector | table | 6 | Pass | Pass | Pass | Fail |  |
| company | By tier | table | 6 | Pass | Pass | Pass | Fail |  |
| company | Everything (expert) | table | 20 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| company | Hygiene: missing key fields | table | 6 | Pass | Pass | Pass | Fail |  |
| company | Hygiene: Other without details | table | 5 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| company | Least recently engaged | table | 5 | Pass | Pass | Pass | Fail |  |
| company | Offset obligors | table | 5 | Pass | Pass | Pass | Fail |  |
| company | BD: Key accounts not engaged in 60 days | table widget | 5 | Pass | Pass | Pass | n/a |  |
| company | Pipeline pack: tiered accounts | table widget | 6 | Pass | Pass | Pass | n/a |  |
| contract | By status | table | 6 | Pass | Pass | Pass | Fail |  |
| contract | Everything (expert) | table | 12 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| contract | Expiring | table | 6 | Pass | Pass | Pass | Fail |  |
| contract | Hygiene: Other without details | table | 5 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| contract | Hygiene: past expiry, still Signed | table | 6 | Pass | Pass | Pass | Fail |  |
| contract | BD: Contracts expiring in 90 days | table widget | 6 | Pass | Pass | Pass | n/a |  |
| contract | BD: Contracts in negotiation | table widget | 6 | Pass | Fail | Fail | n/a |  |
| contract | BD: Contracts signed this year | table widget | 6 | Pass | Pass | Pass | n/a |  |
| document | Documents by type | table | 6 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| document | Documents expiring in 60 days | table | 6 | Pass | Pass | Pass | Pass |  |
| document | Everything (expert) | table | 17 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| document | Hygiene: Other without details | table | 6 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| engagement | Calendar | calendar | 5 | Pass | Pass | n/a | Fail |  |
| engagement | Everything (expert) | table | 11 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| engagement | Hygiene: Other without details | table | 6 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| engagement | Hygiene: outcome overdue | table | 6 | Pass | Pass | Pass | Fail |  |
| engagement | This month | table | 6 | Pass | Pass | Pass | Fail |  |
| engagement | Without outcome | table | 6 | Pass | Pass | Pass | Fail |  |
| engagement | BD: My engagements this week | table widget | 6 | Pass | Pass | Pass | n/a |  |
| engagement | BD: Team engagements this month | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | By campaign | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | By source | table | 6 | Pass | Pass | Pass | Fail |  |
| lead | Dead this month by reason | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | Everything (expert) | table | 31 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| lead | Hygiene: Other without details | table | 6 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| lead | Lead inbox | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | My leads | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | Nurture review due | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | Qualified not converted | table | 6 | Pass | Pass | Pass | Pass |  |
| lead | BD Team: Open leads | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | BD Team: Referral credits | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | BD: All leads | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | BD: Leads created, past 12 months | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | Campaign pack: campaign leads | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | Pipeline pack: leads past their contact time | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | Pipeline pack: open leads | table widget | 6 | Pass | Pass | Pass | n/a |  |
| lead | Pipeline pack: referral credits | table widget | 6 | Pass | Pass | Pass | n/a |  |
| milestone | Calendar | calendar | 5 | Pass | Pass | n/a | Fail |  |
| milestone | Everything (expert) | table | 9 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| milestone | Hygiene: Other without details | table | 4 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| milestone | Missed | table | 5 | Pass | Pass | Pass | Fail |  |
| milestone | Open | table | 4 | Pass | Pass | Pass | Fail |  |
| milestone | BD: Milestones due in 30 days | table widget | 5 | Pass | Pass | Pass | n/a |  |
| milestone | Project pack: open milestones | table widget | 5 | Pass | Pass | Pass | n/a |  |
| note | All Notes | table | 5 | Pass | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| opportunity | By probability | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | By source | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | By Stage | kanban | 6 | Pass | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| opportunity | By type | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Closing this quarter | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Everything (expert) | table | 26 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| opportunity | Hygiene: in Qualify over 30 days | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Hygiene: missing key fields | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Hygiene: Other without details | table | 6 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| opportunity | Hygiene: Parked over 90 days | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Licence pipeline | kanban | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Lost with reasons | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | No next action | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Parked | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Pipeline | kanban | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | Proposals out | table | 6 | Pass | Pass | Pass | Fail |  |
| opportunity | BD: Closing this quarter | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Lost this quarter | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: My closing this quarter | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: My opportunities without next action | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Open pipeline by stage | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Open pipeline by type and sector | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Opportunities created, past 12 months | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Signed licences this year | table widget | 5 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Stale opportunities | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Team open opportunities | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Team opportunities without next action | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | BD: Won and lost this quarter | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | Pipeline pack: exit criteria missing | table widget | 6 | Pass | Pass | Pass | n/a |  |
| opportunity | Pipeline pack: open opportunities | table widget | 6 | Pass | Pass | Pass | n/a |  |
| person | Added in the last 7 days | table | 6 | Pass | Pass | Pass | Fail |  |
| person | All People | table | 8 | Fail | Fail | Pass | n/a | Twenty's own view, outside the agreed set |
| person | Champions | table | 6 | Pass | Pass | Pass | Fail | no date column and no sort, as agreed in 05-views.md |
| person | Decision makers | table | 6 | Pass | Pass | Pass | Fail | no date column and no sort, as agreed in 05-views.md |
| person | Everything (expert) | table | 10 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1); no date column and no sort, as agreed in 05-views.md |
| person | Hygiene: missing email or decision role | table | 6 | Pass | Pass | Pass | Fail | no date column and no sort, as agreed in 05-views.md |
| person | Missing email | table | 6 | Pass | Pass | Pass | Fail | no date column and no sort, as agreed in 05-views.md |
| person | List Members Table | table widget | 3 | Pass | Fail | Pass | n/a | Twenty's own view, outside the agreed set |
| playbookRoleAssignment | All Playbook role assignments | table | 8 | Fail | Fail | Fail | n/a | Twenty's All view, the only view of this object |
| project | At risk | table | 6 | Pass | Pass | Pass | Fail |  |
| project | By health | table | 6 | Pass | Pass | Pass | Fail |  |
| project | Everything (expert) | table | 16 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| project | Hygiene: Other without details | table | 5 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| project | Portfolio | table | 5 | Pass | Pass | Pass | Fail |  |
| project | BD: Active projects | table widget | 6 | Pass | Pass | Pass | n/a |  |
| project | BD: Team active projects | table widget | 6 | Pass | Pass | Pass | n/a |  |
| project | Campaign pack: active campaigns | table widget | 6 | Pass | Pass | Pass | n/a |  |
| project | Project pack: active projects | table widget | 6 | Pass | Pass | Pass | n/a |  |
| publicHoliday | All UAE public holidays | table | 6 | Pass | Fail | Fail | n/a | Twenty's All view, the only view of this object |
| task | All Tasks | table | 8 | Fail | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| task | Assigned to Me | table | 7 | Fail | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| task | By Status | kanban | 5 | Pass | Fail | Fail | n/a | Twenty's own view, outside the agreed set |
| task | Hygiene: Other without details | table | 4 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| workPackage | Blocked | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | By status | kanban | 5 | Pass | Pass | Pass | Fail |  |
| workPackage | Due this week | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Everything (expert) | table | 27 | Fail | Pass | Pass | Fail | expert view: documented exception, needs the ED (gate m1) |
| workPackage | Hygiene: no done criteria | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Hygiene: Other without details | table | 4 | Pass | Pass | Pass | Pass | no date column and no sort, as agreed in 05-views.md |
| workPackage | My work | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Offered to me | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Overdue | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Planned | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | Submitted for my review | table | 6 | Pass | Pass | Pass | Fail |  |
| workPackage | BD: My open work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: My overdue work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: My submitted work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team blocked work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team offered, not accepted | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team open work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team overdue work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team submitted, awaiting review | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | BD: Team work package board | kanban widget | 5 | Pass | Pass | Pass | n/a |  |
| workPackage | Home: My work due within 7 days | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | Home: Needs your decision | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | Home: Other work by status | table widget | 6 | Pass | Pass | Pass | n/a |  |
| workPackage | Project pack: blocked work packages | table widget | 6 | Pass | Pass | Pass | n/a |  |
<!-- /generated:views -->

### 1.4 Default view per object

What a person sees the first time they open each object, from the sidebar where it has an entry. Twenty reopens the last view a person used after that (`05-views.md` section 1).

<!-- generated:defaultViews -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| Lead | D1 The default view is the one a new employee needs | Pass | Sidebar Leads opens Lead inbox: New leads I own, oldest first. A new lead given to me appears here; the ones I log myself are ownerless until triage, so they do not (U16). |
| Opportunity | D1 The default view is the one a new employee needs | **Fail** | Sidebar Pipeline; Twenty's Opportunities entry opens Pipeline: every open opportunity of the team, kanban by stage, sample deals included. No "My opportunities" view exists in the picker; a BD officer needs their own cases with next action and date. |
| Work package | D1 The default view is the one a new employee needs | Pass | Sidebar My work opens My work: my open work packages, earliest due first. |
| Project | D1 The default view is the one a new employee needs | Pass | Sidebar Projects opens Portfolio: active projects, nearest end date first. |
| Milestone | D1 The default view is the one a new employee needs | Pass | Sidebar Milestones opens Open milestones, earliest due first. |
| Engagement | D1 The default view is the one a new employee needs | Pass | Sidebar Engagements opens This month: the team's engagements this month. Team-wide, but it is where a logged contact appears. |
| Company | D1 The default view is the one a new employee needs | Pass | Sidebar Companies (twice) opens By tier, grouped by account tier. Searching (Ctrl+K) before creating works from any view. |
| Person | D1 The default view is the one a new employee needs | **Fail** | Sidebar People (twice) opens Decision makers: people with a decision role, 0 rows for a new workspace (ux-18). A new employee looking for the person they just met sees an empty list. |
| Task | D1 The default view is the one a new employee needs | **Fail** | Twenty's Tasks entry opens By Status: every task of the team on a kanban (ux-19). Tasks are where every reminder lands; the person needs their own open tasks, due first (Twenty's "Assigned to Me" has 7 columns and no sort). |
| Note | D1 The default view is the one a new employee needs | Pass | Twenty's Notes entry opens All Notes. Notes are read on their record; the list is rarely opened. |
| Contract | D1 The default view is the one a new employee needs | Pass | Sidebar Contracts opens Expiring: signed contracts by expiry. BD officers read contracts only. |
| Document | D1 The default view is the one a new employee needs | Pass | Sidebar Documents opens Documents by type. |
| Capability | D1 The default view is the one a new employee needs | Pass | Sidebar Capabilities opens All capabilities, latest status change first. |
| Campaign target | D1 The default view is the one a new employee needs | Pass | The Campaign pack tab (no sidebar entry) opens its campaign targets table; the object itself opens To work. Reached from the Campaign pack tab and the campaign project. |
| Playbook role assignment | D1 The default view is the one a new employee needs | **Fail** | Search or the object page (no sidebar entry) opens Twenty's All view, 8 columns with Created by and Last update. Configuration for the ED and the ops coordinator; no curated view. |
| UAE public holiday | D1 The default view is the one a new employee needs | **Fail** | Search or the object page (no sidebar entry) opens Twenty's All view, no sort on Date. The ops coordinator enters each year here; the list is not in date order. |
<!-- /generated:defaultViews -->

### 1.5 Lists and options

Every select list on the 16 business objects, 49 lists and 407 options as installed. Near-duplicates were searched by word overlap within each list; the only ones are deprecated options still selectable next to the options that replaced them. The only abbreviation left in an option label is "Intro". No list puts Other anywhere but last.

<!-- generated:options -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| company.accountTier (Account tier, 3 options) | O1 No duplicate or near-duplicate options | Pass |  |
| company.accountTier (Account tier, 3 options) | O2 No abbreviations | Pass |  |
| company.accountTier (Account tier, 3 options) | O3 Other last | n/a | No Other option. |
| company.sector (Sector, 10 options) | O1 No duplicate or near-duplicate options | Pass |  |
| company.sector (Sector, 10 options) | O2 No abbreviations | Pass |  |
| company.sector (Sector, 10 options) | O3 Other last | Pass |  |
| company.relationshipType (Relationship type, 10 options) | O1 No duplicate or near-duplicate options | Pass |  |
| company.relationshipType (Relationship type, 10 options) | O2 No abbreviations | Pass |  |
| company.relationshipType (Relationship type, 10 options) | O3 Other last | Pass |  |
| company.sizeClass (Size class, 4 options) | O1 No duplicate or near-duplicate options | Pass |  |
| company.sizeClass (Size class, 4 options) | O2 No abbreviations | Pass |  |
| company.sizeClass (Size class, 4 options) | O3 Other last | n/a | No Other option. |
| person.decisionRole (Decision role, 6 options) | O1 No duplicate or near-duplicate options | Pass |  |
| person.decisionRole (Decision role, 6 options) | O2 No abbreviations | Pass |  |
| person.decisionRole (Decision role, 6 options) | O3 Other last | n/a | No Other option. |
| opportunity.stage (Stage, 8 options) | O1 No duplicate or near-duplicate options | **Fail** | Customer is a stage column next to Signed (the design deprecates it; P3 not done) |
| opportunity.stage (Stage, 8 options) | O2 No abbreviations | Pass |  |
| opportunity.stage (Stage, 8 options) | O3 Other last | n/a | No Other option. |
| opportunity.probability (Probability, 5 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.probability (Probability, 5 options) | O2 No abbreviations | Pass |  |
| opportunity.probability (Probability, 5 options) | O3 Other last | n/a | No Other option. |
| opportunity.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| opportunity.department (Department, 7 options) | O3 Other last | Pass |  |
| opportunity.fundingPath (Funding path, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.fundingPath (Funding path, 8 options) | O2 No abbreviations | Pass |  |
| opportunity.fundingPath (Funding path, 8 options) | O3 Other last | Pass |  |
| opportunity.offering (Offering, 12 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.offering (Offering, 12 options) | O2 No abbreviations | Pass |  |
| opportunity.offering (Offering, 12 options) | O3 Other last | Pass |  |
| opportunity.lostReasonCategory (Lost reason category, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.lostReasonCategory (Lost reason category, 8 options) | O2 No abbreviations | Pass |  |
| opportunity.lostReasonCategory (Lost reason category, 8 options) | O3 Other last | Pass |  |
| opportunity.playbookType (Type, 18 options) | O1 No duplicate or near-duplicate options | Pass |  |
| opportunity.playbookType (Type, 18 options) | O2 No abbreviations | Pass |  |
| opportunity.playbookType (Type, 18 options) | O3 Other last | Pass |  |
| opportunity.source (Source, 25 options) | O1 No duplicate or near-duplicate options | **Fail** | Referral (deprecated), Outreach (deprecated) and Event or workshop (deprecated) are selectable next to the Referral: options, Registry outreach and Workshop |
| opportunity.source (Source, 25 options) | O2 No abbreviations | Pass |  |
| opportunity.source (Source, 25 options) | O3 Other last | Pass |  |
| task.status (Status, 3 options) | O1 No duplicate or near-duplicate options | Pass |  |
| task.status (Status, 3 options) | O2 No abbreviations | Pass |  |
| task.status (Status, 3 options) | O3 Other last | n/a | No Other option. |
| task.taskType (Type, 9 options) | O1 No duplicate or near-duplicate options | Pass |  |
| task.taskType (Type, 9 options) | O2 No abbreviations | Pass |  |
| task.taskType (Type, 9 options) | O3 Other last | Pass |  |
| lead.status (Status, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| lead.status (Status, 7 options) | O2 No abbreviations | Pass |  |
| lead.status (Status, 7 options) | O3 Other last | n/a | No Other option. |
| lead.source (Source, 25 options) | O1 No duplicate or near-duplicate options | **Fail** | Referral (deprecated), Outreach (deprecated) and Event or workshop (deprecated) are selectable next to the Referral: options, Registry outreach and Workshop |
| lead.source (Source, 25 options) | O2 No abbreviations | Pass |  |
| lead.source (Source, 25 options) | O3 Other last | Pass |  |
| lead.offeringInterest (Offering interest, 12 options) | O1 No duplicate or near-duplicate options | Pass |  |
| lead.offeringInterest (Offering interest, 12 options) | O2 No abbreviations | Pass |  |
| lead.offeringInterest (Offering interest, 12 options) | O3 Other last | Pass |  |
| lead.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| lead.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| lead.department (Department, 7 options) | O3 Other last | Pass |  |
| lead.deadReason (Dead reason, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| lead.deadReason (Dead reason, 8 options) | O2 No abbreviations | Pass |  |
| lead.deadReason (Dead reason, 8 options) | O3 Other last | Pass |  |
| lead.sourceSystem (Source system, 6 options) | O1 No duplicate or near-duplicate options | Pass |  |
| lead.sourceSystem (Source system, 6 options) | O2 No abbreviations | Pass |  |
| lead.sourceSystem (Source system, 6 options) | O3 Other last | n/a | No Other option. |
| engagement.kind (Kind, 20 options) | O1 No duplicate or near-duplicate options | **Fail** | Meeting (deprecated) and Event (deprecated) are selectable next to Intro meeting, Discovery meeting and Gala or event |
| engagement.kind (Kind, 20 options) | O2 No abbreviations | **Fail** | "Intro meeting" (Intro) |
| engagement.kind (Kind, 20 options) | O3 Other last | Pass |  |
| engagement.outcomeType (Outcome type, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| engagement.outcomeType (Outcome type, 7 options) | O2 No abbreviations | Pass |  |
| engagement.outcomeType (Outcome type, 7 options) | O3 Other last | Pass |  |
| engagement.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| engagement.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| engagement.department (Department, 7 options) | O3 Other last | Pass |  |
| project.playbookType (Type, 9 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.playbookType (Type, 9 options) | O2 No abbreviations | Pass |  |
| project.playbookType (Type, 9 options) | O3 Other last | Pass |  |
| project.status (Status, 4 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.status (Status, 4 options) | O2 No abbreviations | Pass |  |
| project.status (Status, 4 options) | O3 Other last | n/a | No Other option. |
| project.health (Health, 3 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.health (Health, 3 options) | O2 No abbreviations | Pass |  |
| project.health (Health, 3 options) | O3 Other last | n/a | No Other option. |
| project.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| project.department (Department, 7 options) | O3 Other last | Pass |  |
| project.targetSector (Target sector, 10 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.targetSector (Target sector, 10 options) | O2 No abbreviations | Pass |  |
| project.targetSector (Target sector, 10 options) | O3 Other last | Pass |  |
| project.targetSizeClass (Target size class, 4 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.targetSizeClass (Target size class, 4 options) | O2 No abbreviations | Pass |  |
| project.targetSizeClass (Target size class, 4 options) | O3 Other last | n/a | No Other option. |
| project.targetOffering (Offering promoted, 12 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.targetOffering (Offering promoted, 12 options) | O2 No abbreviations | Pass |  |
| project.targetOffering (Offering promoted, 12 options) | O3 Other last | Pass |  |
| project.channelPlan (Channel plan, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| project.channelPlan (Channel plan, 8 options) | O2 No abbreviations | Pass |  |
| project.channelPlan (Channel plan, 8 options) | O3 Other last | Pass |  |
| milestone.status (Status, 3 options) | O1 No duplicate or near-duplicate options | Pass |  |
| milestone.status (Status, 3 options) | O2 No abbreviations | Pass |  |
| milestone.status (Status, 3 options) | O3 Other last | n/a | No Other option. |
| milestone.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| milestone.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| milestone.department (Department, 7 options) | O3 Other last | Pass |  |
| workPackage.status (Status, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| workPackage.status (Status, 8 options) | O2 No abbreviations | Pass |  |
| workPackage.status (Status, 8 options) | O3 Other last | n/a | No Other option. |
| workPackage.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| workPackage.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| workPackage.department (Department, 7 options) | O3 Other last | Pass |  |
| contract.kind (Kind, 12 options) | O1 No duplicate or near-duplicate options | **Fail** | Option (deprecated) and Service (deprecated) are selectable next to Licence and Technical services agreement |
| contract.kind (Kind, 12 options) | O2 No abbreviations | Pass |  |
| contract.kind (Kind, 12 options) | O3 Other last | Pass |  |
| contract.status (Status, 5 options) | O1 No duplicate or near-duplicate options | Pass |  |
| contract.status (Status, 5 options) | O2 No abbreviations | Pass |  |
| contract.status (Status, 5 options) | O3 Other last | n/a | No Other option. |
| contract.department (Department, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| contract.department (Department, 7 options) | O2 No abbreviations | Pass |  |
| contract.department (Department, 7 options) | O3 Other last | Pass |  |
| contract.sourceSystem (Source system, 1 options) | O1 No duplicate or near-duplicate options | Pass |  |
| contract.sourceSystem (Source system, 1 options) | O2 No abbreviations | Pass |  |
| contract.sourceSystem (Source system, 1 options) | O3 Other last | n/a | No Other option. |
| document.kind (Type, 22 options) | O1 No duplicate or near-duplicate options | Pass |  |
| document.kind (Type, 22 options) | O2 No abbreviations | Pass |  |
| document.kind (Type, 22 options) | O3 Other last | Pass |  |
| document.status (Status, 7 options) | O1 No duplicate or near-duplicate options | Pass |  |
| document.status (Status, 7 options) | O2 No abbreviations | Pass |  |
| document.status (Status, 7 options) | O3 Other last | Pass |  |
| document.confidentiality (Confidentiality, 4 options) | O1 No duplicate or near-duplicate options | Pass |  |
| document.confidentiality (Confidentiality, 4 options) | O2 No abbreviations | Pass |  |
| document.confidentiality (Confidentiality, 4 options) | O3 Other last | Pass |  |
| document.sourceSystem (Source system, 2 options) | O1 No duplicate or near-duplicate options | Pass |  |
| document.sourceSystem (Source system, 2 options) | O2 No abbreviations | Pass |  |
| document.sourceSystem (Source system, 2 options) | O3 Other last | n/a | No Other option. |
| playbookRoleAssignment.playbookRole (Playbook role, 8 options) | O1 No duplicate or near-duplicate options | Pass |  |
| playbookRoleAssignment.playbookRole (Playbook role, 8 options) | O2 No abbreviations | Pass |  |
| playbookRoleAssignment.playbookRole (Playbook role, 8 options) | O3 Other last | n/a | No Other option. |
| capability.kind (Kind, 10 options) | O1 No duplicate or near-duplicate options | Pass |  |
| capability.kind (Kind, 10 options) | O2 No abbreviations | Pass |  |
| capability.kind (Kind, 10 options) | O3 Other last | Pass |  |
| capability.status (Status, 5 options) | O1 No duplicate or near-duplicate options | Pass |  |
| capability.status (Status, 5 options) | O2 No abbreviations | Pass |  |
| capability.status (Status, 5 options) | O3 Other last | Pass |  |
| capability.sourceSystem (Source system, 1 options) | O1 No duplicate or near-duplicate options | Pass |  |
| capability.sourceSystem (Source system, 1 options) | O2 No abbreviations | Pass |  |
| capability.sourceSystem (Source system, 1 options) | O3 Other last | n/a | No Other option. |
| campaignTarget.status (Status, 6 options) | O1 No duplicate or near-duplicate options | Pass |  |
| campaignTarget.status (Status, 6 options) | O2 No abbreviations | Pass |  |
| campaignTarget.status (Status, 6 options) | O3 Other last | n/a | No Other option. |
<!-- /generated:options -->

### 1.6 Front components

The brief specifies four front components (`wireframes.md` section 8.2). One is built.

<!-- generated:frontComponents -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| Work package card | F1 Skeleton while loading | Pass | Real headings with skeleton bars and "Wait a moment while the work package loads." (ux-05). |
| Work package card | F2 Empty and missing states | Pass | "This work package isn't available..." with Open full record; empty Done criteria shows "No done criteria yet. Ask {reviewer}..." |
| Work package card | F3 Error state | Pass | "We couldn't load this work package. Your data is safe." with Try again and Open full record (ux-06). |
| Work package card | F4 Toast on every action | Pass | "Accepted. It's on your list." on Accept; Decline, Request help and Submit toasts in code; a double click gave one toast. A refused write says "That didn't save... Try again" even when it can never save (ux-07). |
| Work package card | F5 Fallback link | Pass | Open full record, top end corner, also on the error state. On the record page itself it links to the page you are on (wireframes 1.7 asks for "Show all fields"). |
| Work package card | F6 Buttons disabled while a write is pending | Pass | On a 2.5 s network every action button reads disabled until the write returns (card-keys.json). |
| Work package card | F7 Focus order | **Fail** | Each info icon is followed by four extra Tab stops on its svg and path elements; reading order otherwise holds (card-keys.json). |
| Work package card | F8 Keyboard operation | **Fail** | Opening Decline or Request help leaves focus on the page body; Enter does not send and Escape does not close the form (wireframes 1.3). |
| Work package card | F9 Contrast of status colours | **Fail** | Badges: Planned 5.45, Offered 4.72, Accepted 5.34, Submitted 5.38, Blocked 4.55, Done 4.44 (under 4.5:1). Secondary text and info icons 2.78:1 (contrast.json). |
| Work package card | F10 Usable at phone width | **Fail** | At 390 x 844 the card starts below the 31-field list; Submit is 2,414 px down; buttons are 26 px high, not 44 (ux-14, phone.json). |
| Work package card | F11 Same verbs everywhere | Pass | Accept, Decline, Request help, Submit, as the cadence guide and the guidance widgets say. |
| Work package card | F12 Same status words everywhere | **Fail** | Badge words differ from the Status field and the day-one checklist ("The status reads Accepted"; the badge reads In progress). |
| Work package card | F13 Arabic and right to left | **Fail** | Mirrors and every card string is in Arabic, but the due date is in the Hijri calendar ("الخميس، 11 جمادى الأولى") because ar-SA defaults to it (ux-16). |
| Work package card | F14 Info icon tooltip and "What do I do now?" on every state | Pass | Tooltips open on hover and on focus; every state ends with its next step (card-desktop.json). |
| Home (wireframes section 3) | F0 Built | **Fail** | Not built (backlog B2); a native page of three tables stands in, audited as a dashboard tab. |
| Intake (wireframes section 4) | F0 Built | **Fail** | Not built (backlog B4); "+ Create" on Opportunities is the only way to open a case. |
| Manager exceptions (wireframes section 6) | F0 Built | **Fail** | Not built (backlog B3); a native page of three tables stands in, audited as a dashboard tab. |
<!-- /generated:frontComponents -->

### 1.7 Sidebar, first sign-in and the workspace

<!-- generated:global -->
| Screen | Check | Result | Evidence |
| --- | --- | --- | --- |
| First sign-in | G1 A new member reaches Home | **Fail** | Until an admin completes Twenty's "Invite your team" step, every member lands on it and "Skip anyway" fails with "User does not have permission." (ux-01). After the ED skipped it once, BD officers landed on Home after "Create profile". |
| Sidebar | G2 One entry per destination | **Fail** | Companies and People appear twice; Twenty's Opportunities, Tasks, Notes, Dashboards and Workflows stay under Help (config/dashboards/sidebar.md not applied). |
| Sidebar | G3 Entry names say what opens | **Fail** | "BD Executive" opens the whole BD dashboard; Team, Mine and the three packs sit behind it. The guidance calls it "BD dashboard". |
| Sidebar | G4 Help opens the Help page | **Fail** | https://kuac.sharepoint.com/... does not exist (gate M6). |
| Sidebar | G5 Names in Arabic | **Fail** | 3 of 18 entries have Arabic (Leads, Documents, Help). |
| Workspace | G6 No sample records | **Fail** | Twenty's sample companies (Airbnb, Anthropic, Figma, Notion, Stripe), 5 people, 6 opportunities and "My First Dashboard" exist from workspace creation; they show in Pipeline and Data quality (ux-11). |
| Workspace | G7 Links to a dashboard tab open that tab | **Fail** | /page/<BD>?tabId=<Team> opens Executive. |
<!-- /generated:global -->

---

## 2. Fresh-eyes test

### 2.1 Status

**Not run.** It needs two people who have never opened the system, and it needs the staging instance with the fixes of section 0 in place. Running it on the rehearsal today would measure the known blockers rather than the guidance: the Help page link is dead, the Commercialization task cannot be done, and the onboarding step can stop both people before they reach Home.

### 2.2 Protocol (ops coordinator)

| | |
| --- | --- |
| Participants | One business development officer on the BD officer role, one member of the Commercialization department on the Commercialization role. Neither has opened the CRM. The ED picks them by Thu 29 Oct. One of them uses the Arabic interface if either prefers it, so Arabic is tested by a reader of Arabic (`wireframes.md` section 3.6 asks for this). |
| Where | Staging, after the items marked "before the first invitation" in section 0 are done, on the person's own laptop and, for the work package task, their own phone. |
| Preparation, the day before | The ED invites both work addresses with their roles and has already skipped "Invite your team" once. The ops coordinator creates the two test records of `10-onboarding.md` for each person, one real business card from a recent event for the BD officer, and one real work package offered to the Commercialization participant (Offered, a reviewer, done criteria, due in 3 working days). |
| What they get | The CRM address and the Help page address. No runbook, no walkthrough, no colleague. If they ask a question, the observer answers it in as few words as possible, notes it, and the clock keeps running. |
| Script | (1) The day-one checklist of `10-onboarding.md`: questions 1 to 5 and the mailbox step. (2) The BD officer logs a lead from the business card. (3) The Commercialization participant accepts the work package and submits it with its done criteria met. |
| Measures | Time per question and per task (first click to the "Yes when" condition; for the lead, from clicking Leads to a saved lead with Name, Source, Company, Person and Need); every hesitation (a pause of 5 seconds or more, a back navigation, a wrong click, opening Help); every question asked, word for word; finished without help, yes or no. Screen recording with the person's consent, or a second observer with a stopwatch. |
| Targets | Day-one checklist under 20 minutes. First lead under 90 seconds. Work package accepted and submitted without a question. |
| Rule | Every hesitation and every question becomes a row in section 5, as a change to a label, a description, a guidance line or the Help page, with an owner and a date. None becomes a training note. |

### 2.3 Record sheet

To be filled at the session and copied into this file. One row per step per participant.

| Participant | Step | Start | End | Minutes | Hesitations (time, where, what happened) | Questions asked (verbatim) | Finished without help | Fix row |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BD officer | Q1 Log in | | | | | | | |
| BD officer | Q2 Find your own work | | | | | | | |
| BD officer | Q3 Accept a work package | | | | | | | |
| BD officer | Q4 Next action on an opportunity | | | | | | | |
| BD officer | Q5 Ask for help | | | | | | | |
| BD officer | Mailbox connected | | | | | | | |
| BD officer | Task: lead from a business card | | | | | | | |
| Commercialization | Q1 to Q5 and mailbox, as above | | | | | | | |
| Commercialization | Task: accept and submit a work package | | | | | | | |

### 2.4 Desk walkthrough: where a first-week employee is predicted to hesitate

Engineering walked the same script on the rehearsal using only what the screens and the planned Help page say. This is a prediction, not a measurement, and it does not replace the sessions. Each row names the fix that removes the hesitation.

| # | Step | Predicted hesitation | What the screen does | Fix |
| --- | --- | --- | --- | --- |
| H1 | Q1 | "Do I have to fill in a job title?" | Twenty asks for first name, last name and job title before the CRM; the checklist does not mention it | U1: one line in `10-onboarding.md` question 1 |
| H2 | Q1 | Stopped | If the ED has not skipped "Invite your team", the person lands on it and Skip fails with "User does not have permission." (ux-01) | U1 |
| H3 | Q1 | "Which Companies do I use?" | Companies and People appear twice, and Twenty's Opportunities, Tasks, Notes, Dashboards and Workflows sit under Help | U20 |
| H4 | Q3 | "Where are the buttons?" | The guidance says "the card below"; the card is under 31 fields, and on a phone Submit is 2,414 px down (ux-03, ux-14) | U5 |
| H5 | Q3 | "Did it work?" | The checklist says "The status reads Accepted"; the card says "In progress", while the Status field and the timeline on the same page say Accepted (ux-04) | U10 |
| H6 | Q3, Commercialization | Stopped | Accept answers "That didn't save. Nothing was changed. Try again." every time (ux-07) | U2 |
| H7 | Q4 | "Are these our clients?" | The Pipeline shows Twenty's sample deals (Airbnb, Stripe, Figma, Notion, Anthropic) and a "Customer" column (ux-11, ux-17) | U21, U11 |
| H8 | Q4 | "Where is Next action?" | On the opportunity, Next action and Next action date sit under a "System" heading, below Probability and Lost reason (ux-08) | Gate M4, U14 |
| H9 | Help | Dead end | The Help link opens `kuac.sharepoint.com`, which does not exist | Gate M6 |
| H10 | Mailbox step | "Where are the videos?" | `10-onboarding.md` promises "a short video for each screen"; none is recorded (`20-guidance.md` section 7) | U19 |
| H11 | Lead | Long scroll | "Create" opens a 38-field panel; Company and Person come after the five checks, the qualification score and nine app-written dates (ux-12) | U16 |
| H12 | Lead | "Which source is a business card from a conference?" | 25 sources with no description on hover, three of them "(deprecated)" | U18, R1 |
| H13 | Lead | "Where do the email and phone go?" | The Person picker creates a person with a name only; email, phone and title go on the person's own record | U16 |
| H14 | Lead | Leaves it empty | "Referred by (colleague)" says it is you when you type the lead yourself, but it stays empty and nobody is credited | U8 |
| H15 | Lead | "Where did my lead go?" | The new lead has no owner, so it is not in "Lead inbox", whose filter is Owner: me | U16 |
| H16 | Submit | "Where do I put the link to my work?" | Submit asks only to confirm; nothing on the card or in the guidance says where the SharePoint link goes | U25 |

---

## 3. Gap sweep

### 3.1 Every value of the taxonomy, recorded as a business development officer

`gap-sweep.mjs` created one record per value with Bader's own sign-in, so the BD officer role's permissions applied. Nothing was refused.

| List | Values | Recorded | On | Notes |
| --- | --- | --- | --- | --- |
| Engagement type (Kind) | 20 | 20 | Engagement, linked to a company and an opportunity | Includes Meeting (deprecated) and Event (deprecated), which are still selectable |
| Source | 25 | 25 on opportunities, 25 on leads | Opportunity, Lead | Includes three deprecated sources, still selectable |
| Document type | 22 | 22 | Document, with a SharePoint link, linked to a company and an opportunity | |
| Opportunity type | 18 | 18 | Opportunity | Only Licence and Technical service start a playbook (6 and 7 work packages, neither finishes: B5). The other 16 run on next action alone |

What the records cannot hold, found while recording them. Each is a gap; "workaround" means it can be written somewhere a person can find it, "missing" means only free text that no view or rule reads.

| # | Gap | Kind | Where it bites |
| --- | --- | --- | --- |
| G1 | An engagement has no person: who you met is not recorded | Missing | Every engagement type; journeys S3, 6.3, 7.2 |
| G2 | An engagement links one opportunity | Workaround: one engagement per case | Site visits and events that raise several needs (journey 4) |
| G3 | An engagement cannot link a project | Missing | Kick-off, steering meetings, workshop and campaign contacts (journeys 3, 5, 7, 8) |
| G4 | A document cannot link an engagement | Workaround: link the opportunity or company | Meeting minutes, Site-visit report |
| G5 | A source naming an event (Workshop, Exhibition, Gala QR code, Challenge Sprint) cannot point at the event's project | Workaround on leads (Campaign field); missing on opportunities | Event and workshop outcomes (journeys 3, 7) |
| G6 | An opportunity has no referring colleague; credit exists only on leads | Workaround: create the lead first | Referral: colleague, Referral: faculty |
| G7 | 16 of 18 opportunity types have no playbook | Workaround: next action and tasks by hand | Industry challenge, startup, partnership, sponsorship and the rest (backlog B8, B14) |
| G8 | Project types have no Partnership or Portfolio support | Workaround: Initiative with milestones by hand | Journeys 5 and 6 |
| G9 | No target or invitee list outside go-to-market campaigns | Workaround: SharePoint list linked from the work package | Partner shortlist (journey 1), workshop invitees and attendance (journey 3) |
| G10 | "Other details" is described as a required note but is not required | Workaround: Data quality lists it on Monday | Every list with Other |
| G11 | Deprecated options can still be picked | Workaround: Data quality and the quarterly review | Engagement type, Source, Contract type |
| G12 | Purchase order or invoice is metadata only | By design (finance is the system of record) | Delivery and close-out |

### 3.2 The eight journeys of `journeys.md`, step by step

Marked against what runs on the rehearsal today. **Supported**: done as designed, today. **Workaround**: done, but with native edits, a manual step, or outside the CRM. **Missing**: the step's record or rule does not exist; only free text could hold it. The work package loop that most steps reuse is marked once, at the end.

**Journey 1: Technology licensing.** 0 supported, 7 workaround, 0 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 3.1 Choose and open the case | Workaround | No Intake: "+ Create" on Opportunities, then Type Licence. W1 creates the six work packages but stops before telling the step-1 owner or creating the ED's Confirm plan (B5) |
| 3.2 Technical assessment (gate) | Workaround | The owner accepts and submits on the card; the ED approves by setting Status to Done on the full record; "Stop the case" is setting the stage to Lost by hand |
| 3.3 Commercial route scoping (gate) | Workaround | As 3.2; Amount and Close date are typed on the opportunity, not asked on Submit |
| 3.4 Partner shortlist | Workaround | Targets exist for campaigns only: the shortlist lives on SharePoint, linked from a note (G9) |
| 3.5 Outreach | Workaround | Engagements log each contact (G1); the 10-day follow-up and the 30-day "park it?" rules do not exist |
| 3.6 Term sheet (gate) | Workaround | Approvals recorded as notes; Legal must hold a role that writes work packages (U2) |
| 3.7 Licence signed and close | Workaround | No "Was it signed?" question: the owner sets Signed by hand; W7 then creates the licence contract (gate B6: not if Teams is down) |

**Journey 2: Inbound RFQ or technical service.** 0 supported, 8 workaround, 0 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 4.1 The request is logged | Workaround | "+ Create", Type Technical service, Client deadline typed; the original email goes in a note; W1 stops as in 3.1 |
| 4.2 Bid or no-bid | Workaround | No recommendation question and no tight-deadline card; Don't bid is the stage set to Lost with its category, by hand |
| 4.3 Scoping | Workaround | The card shows "Part of {case}" but not the client deadline or the original request; the developer opens the opportunity |
| 4.4 Quote or proposal | Workaround | Price and decision date typed on the opportunity; Finance must hold a role that writes work packages (U2) |
| 4.5 Internal approval | Workaround | The ED accepts, then submits; with no reviewer the step waits in Submitted until someone sets Done on the full record |
| 4.6 Submission | Workaround | The ops coordinator reviews by setting Done on the full record |
| 4.7 Follow-up and decision | Workaround | No "Chased, no answer"; the third-chase Parked rule does not run; the decision is the stage set by hand |
| 4.8 Delivery hand-off | Workaround | The Delivery project is created by hand with Type Delivery; W9 then builds its steps (backlog B15) |

**Journey 3: Industry workshop.** 2 supported, 5 workaround, 1 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 5.1 Open the workshop | Supported | "+ Create" a project with the event date, then Type Workshop: W9 creates 5 milestones and 6 work packages planned back from the event (gate journey c) |
| 5.2 Objective (gate) | Workaround | Review by Status on the full record; expected attendees not recorded; the milestone is closed by hand (B11) |
| 5.3 Audience and target roles | Workaround | Invitees are people in the CRM, but nothing ties them to the workshop: the list lives on SharePoint (G9) |
| 5.4 Invitations | Workaround | Invited and Registered are tracked outside the CRM |
| 5.5 Logistics and budget | Workaround | Work package loop; the ED's spend approval is a note |
| 5.6 Go/no-go and the event | Missing | No go/no-go prompt, no attendance, and the event cannot be logged against the project (G3) |
| 5.7 Outcomes into opportunities | Workaround | No Debrief: each lead is created by hand with Source Workshop and the workshop as its Campaign (G5) |
| 5.8 Close | Supported | W10's close task, then Status Done |

**Journey 4: Site visit with several needs.** 1 supported, 2 workaround, 2 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 6.1 Plan and prepare | Workaround | The planned visit is an engagement with a future date (W11 sets its outcome date); the company's context is spread over eight tabs (no Company 360) |
| 6.2 The visit | Supported | Nothing in the CRM by design |
| 6.3 Debrief: several cases | Missing | Each case can be created by hand, but none can say it came from the visit (G2, no origin link) |
| 6.4 Each case runs its journey | Workaround | As journeys 1 and 2 |
| 6.5 What the visit produced | Missing | Nothing groups cases by the visit |

**Journey 5: Strategic partnership or sponsored chair.** 0 supported, 4 workaround, 0 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 7.1 Approach and open | Workaround | Type "Partnership or memorandum of understanding" exists with no playbook: next action and tasks by hand (G7) |
| 7.2 Frame and map the stakeholders | Workaround | Decision role and Champion exist and "Decision makers" groups by role; influence is not recorded |
| 7.3 Proposal or MoU, approvals, signature | Workaround | Approvals as notes; the contract is entered by the ops coordinator or the ED (BD officers read contracts only) |
| 7.4 Run the partnership | Workaround | No Partnership project type: Initiative with milestones typed by hand (G8) |

**Journey 6: Support to a portfolio startup.** 0 supported, 3 workaround, 1 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 8.1 The request arrives | Workaround | Relationship type "Portfolio company" and Type "Spinout or startup" exist; no Intake question chooses the path |
| 8.2 Introduction path | Missing | No Startup partnering playbook, and the opportunity with the counterparty cannot name the startup (G7) |
| 8.3 Support path | Workaround | Initiative project on the startup's company with milestones by hand (G8) |
| 8.4 The portfolio view of one startup | Workaround | The company page lists its projects and opportunities; introductions made for it do not appear |

**Journey 7: Go-to-market campaign.** 2 supported, 4 workaround, 0 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 9.1 Objective | Workaround | Campaign pack: a project of Type Go-to-market campaign with target sector, size class, offering and channel plan; no work package for the ED's objective review |
| 9.2 Target list from the registry | Supported | G1 builds one Campaign target per matching company (up to 500) |
| 9.3 Assign and run outreach | Workaround | Targets have no owner; target status is set by hand; contacts cannot be logged against the campaign (G3) |
| 9.4 Workshop (optional) | Workaround | A separate Workshop project; nothing links it to the campaign |
| 9.5 Convert to opportunities | Supported | Leads carry the campaign; conversion creates the opportunity and links it to the lead |
| 9.6 Review and close | Workaround | Targets and leads per campaign are on the Campaign pack tab; pipeline value from the campaign is not derived; closed by hand |

**Journey 8: Project delivery.** 0 supported, 6 workaround, 0 missing.

| Step | Mark | Today |
| --- | --- | --- |
| 10.1 Hand-off creates the project | Workaround | Created by hand with Type Delivery; W9 builds 5 work packages and 5 milestones |
| 10.2 Kick-off | Workaround | The kick-off meeting cannot be logged against the project (G3); its milestone is closed by hand |
| 10.3 Delivery plan | Workaround | The plan's duration is not asked; End date and the Execution step's due date are typed (BD officers cannot change due dates) |
| 10.4 Execution | Workaround | W10 sets health daily; Missed is set by hand; nothing can clear Red once set (Agree recovery, backlog B11, is missing) |
| 10.5 Client acceptance | Workaround | "They asked for changes" is a Status edit back to Accepted on the full record |
| 10.6 Close-out | Workaround | Work package loop with the ED's review on the full record; the project is closed by hand |

**The shared loop (`journeys.md` section 2), not counted above.** Offer: supported for later steps (W6), not for step 1 (B5), and duplicated four times when a person sets Offered and a notification fails (U3). Accept or decline: supported on the card, except on department roles (U2). Do the work: Request help supported; Blocked needs the full record. Submit: supported. Review: workaround (U9). Release: supported (W6). Escalation ladder: supported (W2 to W5 and the sweeps; gate journey d). Logging a contact: workaround (G1, G3). Keeping a next step: workaround (two inline fields; W4 asks at 08:00).

---

## 4. Findings

New in this audit, most severe first. Gate 22's findings are not repeated; where this run saw one again, section 0 says so.

| # | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| U1 | Major | **A new member is stopped by Twenty's onboarding.** Twenty sets "Invite your team" pending for the whole workspace when it is created. Until a member allowed to invite finishes that step in the browser, everyone who signs in lands on it, and "Skip anyway" fails with "User does not have permission." twice. After the ED skipped it once, BD officers went from "Create profile" straight to Home. The rehearsal's workspace was created through the API, as `bootstrap.sh` does; an ED who creates the workspace in the browser meets the step first and clears it by skipping, but no runbook says to, and none mentions either screen (gate m7) | ux-01; `onboard.mjs`; Twenty `sign-in-up.service.ts` and `onboarding.service.ts` |
| U2 | Major | **Department roles see buttons that can never work.** Imran (IP office, the same permission set as Commercialization, Leasing, Lab access and Startups and investment) presses Accept on his own offered work package: "That didn't save. Nothing was changed. Try again." The role cannot update work packages (`build-department-role.ts`), so retrying never helps, and the 5-day rule then takes the work away. Backlog P4 and decision D6 are open | ux-07; `dept-accept.mjs` |
| U3 | Major | **One offer, four "Accept or decline" tasks.** When a person sets Offered (the ops coordinator reassigning, F15) no one can stamp `offeredAt`, so W2 stamps it; when the notification then fails and the job retries, W2 reads the stale event, stamps a new `offeredAt` and builds a new dedupe key, so each retry adds a task. Every one of the four offers set by hand in this run produced exactly four tasks (SMTP sink down). Breaks "never notifies twice" (`kuec/CLAUDE.md` section 7) | ux-04, ux-07 timelines; `w02-work-package-offered.ts` lines 45 to 53 and 95 |
| U4 | Major | **Home's "Needs your decision" shows other people's blocks.** Its filter is (Status Blocked) or (Reviewer is me and Submitted): every member sees every blocked work package in the team, while their own offers, which do need their yes or no, sit in "Your next actions". The guidance on the same page says "every table lists only your own records" | ux-02; `home-needs-your-decision.view.ts` |
| U5 | Major | **The card is below the fold.** On the work package page the card comes after the 31-field list; the guidance above it says "the card below". At 390 px Submit is 2,414 px down and the buttons are 26 px high (the design asks for the card first and 44 px buttons; `journeys.md` 12.4 makes it a phone "Must"). Every offer and reminder link lands on this page | ux-03, ux-14; `phone.json` |
| U6 | Major | **Arabic due dates are in the Hijri calendar.** For an `ar-SA` member the card reads "الخميس، 11 جمادى الأولى" for Thursday 22 October: `getDueLabel` formats with the locale's default calendar. The design asks for Gregorian with Western digits | ux-16; `work-package-card-labels.ts` |
| U7 | Major | **Every record page has a Files tab**, Document and Contract included, inviting people to upload the file the record exists to link to (`kuec/CLAUDE.md` section 4). Gate 22 lists hiding it on Opportunity and Contract as not run; Document, Lead, Engagement and the rest are not covered at all | `record-pages.txt` |
| U8 | Major | **Referral credit is lost silently.** "Referred by (colleague)" says it holds "you when you type the lead yourself", but nothing fills it: a lead typed by Bader had no referrer, so L6 credits nobody | `lead-create.json`; `credit-referral.ts` |
| U9 | Major | **Reviewers cannot approve on the card.** The card tells the reviewer to "open the full record and set Done, or set Accepted"; there is no Approve or Send back (backlog B1). On a step with no reviewer, such as Internal approval, Submit still sets Submitted, so the step waits until someone sets Done by hand | card text; `work-package-card-api.ts` |
| U10 | Major | **Two words for one status.** The card says Not started, Waiting to be accepted, In progress, Waiting for review, Stopped; the field, views, kanban, timeline and the day-one checklist say Planned, Offered, Accepted, Submitted, Cancelled. Question 3 of the checklist ("The status reads Accepted") fails on screen | ux-04 |
| U11 | Minor | Opportunity stages still read New, Screening, Meeting, Proposal, Customer; views and guidance say Qualify ("Hygiene: in Qualify over 30 days"); Customer is a live column; New is red like Lost (backlog P3, click-runbook not written) | ux-17; `options.txt` |
| U12 | Minor | Card keyboard: focus stays on the page when Decline or Request help opens, Enter does not send, Escape does not close, and each info icon adds four extra Tab stops (its svg and paths) | `card-keys.json` |
| U13 | Minor | Contrast: the card's secondary text and info icons 2.78:1; the Done badge 4.44:1; green, turquoise and yellow tags 4.17 to 4.46:1 | `contrast.json` |
| U14 | Minor | Record pages use Twenty's tabs, not Overview, Work, Communication, Details; on the five standard objects the guidance sits below Fields | `record-pages.txt`, ux-08 |
| U15 | Minor | Default views: People opens "Decision makers" (empty in a new workspace), Tasks opens Twenty's team-wide "By Status" kanban, and no "My opportunities" view exists | ux-18, ux-19 |
| U16 | Minor | Logging a lead: "Create" saves a record at the first click; Company and Person come after about 30 fields; the person's email and phone need a second record; the new lead has no owner and drops out of the creator's Lead inbox | ux-12; `lead-create.json` |
| U17 | Minor | At 390 px the guidance widget clips its Arabic lines (Home, Team) and Home's tables show only Title and Owner | ux-13, ux-15 |
| U18 | Minor | Seven deprecated options selectable next to their replacements (Engagement type 2, Source 3 on two objects, Contract type 2) | section 1.5 |
| U19 | Minor | Wording: "Intro meeting"; Call says the meeting types are "above" (they are below since 0.10.0); Other promises a "required note" that is not required; the card says the ED reassigns a decline, the cadence guide says the ops coordinator; `10-onboarding.md` promises videos that are not recorded and says "about 30 minutes" against a 20-minute target | `lookups.json`, `10-cadence-en.md`, `10-onboarding.md` |
| U20 | Minor | Sidebar: Companies and People twice; Twenty's own entries under Help; "BD Executive" opens the whole BD dashboard; a link to a dashboard tab (`?tabId=`) opens the first tab | ux-02 |
| U21 | Minor | Twenty's sample records (5 companies, 5 people, 6 opportunities, "My First Dashboard") come with every new workspace and show in Pipeline and Data quality; no runbook deletes them | ux-11 |
| U22 | Minor | Dashboards: "Signed licences this year" reads "0 / 2"; "Open pipeline by company sector" groups by company; "Contracts in negotiation" has no date or sort; Playbook role assignments and UAE public holidays have only Twenty's unsorted All view | ux-10; section 1.3 |
| U23 | Minor | Descriptions on hover reach record-page field labels only: not table headers, kanban cards or options (R1, R5) | `hover-desktop.json` |
| U24 | Minor | Twenty's own fields keep Twenty's one-line descriptions (Stage: "Opportunity stage"; Company Name: "The company name") | section 1.1, RP4 |
| U25 | Minor | Submit has nowhere for the link to the work, and nothing says where it goes (`outputLink`, backlog B1) | card |

---

## 5. Fix list by owner and date

Dates are proposed for the owners to confirm on Monday 19 October; each is a working day in Asia/Dubai. "Gate" rows carry gate 22's fix text; "U" rows are this audit's. A row is closed only when its check passes on staging.

| # | Fix | Severity | Owner | Due |
| --- | --- | --- | --- | --- |
| 1 | B1: exclude `scripts` in `kuec/app/tsconfig.json`; m9: bring the import test inside `tsconfig.spec.json` | Blocker | Engineering lead | Tue 20 Oct |
| 2 | B2: relabel the five options without commas (ED approves the words); add a no-comma rule to `i18n.test.ts` | Blocker | Engineering lead, ED | Tue 20 Oct |
| 3 | B3: guidance widget index 0, with an order that keeps it above Fields on every record page (RP2) | Blocker | Engineering lead | Tue 20 Oct |
| 4 | M1 install order and M2 lockfile in `kuec/app` | Major | Engineering lead | Tue 20 Oct |
| 5 | U6: format due dates with the Gregorian calendar and Western digits for Arabic; a test with `ar-SA` | Major | Engineering lead | Tue 20 Oct |
| 6 | U1 and U21 in `01-deploy.md` section 4: the ED signs in first, skips "Invite your team", and the ops coordinator deletes Twenty's sample records before anyone is invited; one line in `10-onboarding.md` question 1 about "Create profile" | Major | Deploy engineer, ops coordinator | Tue 20 Oct |
| 7 | Decision D6: which roles may hold a work package step (U2), recorded in `13-roles.md` | Major | ED | Tue 20 Oct |
| 8 | Decision: one set of status words on the card, the field and the checklist (U10); recommended: the badge shows the record's word, the plain words move into its tooltip | Major | ED | Tue 20 Oct |
| 9 | IT confirms the Help page address; `HELP_PAGE_URL` corrected; the uVENTURE origin required at build (M6) | Major | KUEC IT, engineering lead | Tue 20 Oct |
| 10 | Guidance and label texts: U8 (until the app fills it: "Pick yourself if you typed this lead"), U16 (your lead goes to the ops coordinator for triage), U19 (Intro meeting, Call, Other, decline handler, videos, 30 minutes), U25 (put the SharePoint link in a note before Submit), U10 wording in `10-onboarding.md` question 3; through `fields.json`, `lookups.json`, `options.json` and `guidance.json` with the ED's approval for any change of meaning | Minor | Ops coordinator | Wed 21 Oct |
| 11 | B5 and M3: W1 finishes, stamps and tells the step-1 owner and the ED | Blocker | Engineering lead | Thu 22 Oct |
| 12 | U3: W2 re-reads the work package before stamping and keys its task on the transition, with a test where the notification fails and the job retries | Major | Engineering lead | Thu 22 Oct |
| 13 | U10: ship the decided status words; re-render section 10 of `20-guidance.md` | Major | Engineering lead | Thu 22 Oct |
| 14 | U11: write and run `config/dashboards/opportunity-stage-labels.md` (Qualify, Scope, Propose, Negotiate; New no longer red; Customer hidden in the pipelines) | Minor | Ops coordinator, engineering lead | Thu 22 Oct |
| 15 | Help page created with its eight sections (`20-guidance.md` section 5), right to left for the Arabic parts | Major | Ops coordinator | Thu 22 Oct |
| 16 | B10 admin rights, B12 the ED's initials on the two risk files, B13 the icon service decision, M9 the CI exception; and R1 to R7 accepted or turned into fixes | Blocker | ED | Thu 22 Oct |
| 17 | m1 accepted by the ED (R4) or expert views cut to 6 columns | Minor | ED | Thu 22 Oct |
| 18 | m3: each member's time zone set to Asia/Dubai as a joiner step | Minor | Ops coordinator | Thu 22 Oct |
| 19 | m4 and m6: first-boot health check note and CORS note in `01-deploy.md` | Minor | Deploy engineer | Thu 22 Oct |
| 20 | m5: Leadership viewer row in `13-roles.md` section 1 | Minor | Engineering lead | Thu 22 Oct |
| 21 | U18: the ED accepts R3, or the deprecated options are relabelled "(deprecated, do not use)" | Minor | ED | Thu 22 Oct |
| 22 | U20: "BD Executive" relabelled "BD dashboard" | Minor | Engineering lead | Thu 22 Oct |
| 23 | U23: the ED accepts R1 and R5 | Minor | ED | Thu 22 Oct |
| 24 | B6: record writes before notifications in every handler; W7 and intake in a sweep | Blocker | Engineering lead | Tue 27 Oct |
| 25 | M4: the app's widgets above Fields on the standard objects' record pages, and app fields out of "System" | Major | Engineering lead | Tue 27 Oct |
| 26 | M5: re-check the rich-text bodies and the count widget on staging (not reproduced here; U22's "0 / 2" with it) | Major | Engineering lead | Tue 27 Oct |
| 27 | U4: "Needs your decision" for a member shows their offers and their reviews; blocked work only for the ED and the ops coordinator; guidance line 2 kept true | Major | Engineering lead | Tue 27 Oct |
| 28 | U7: Files tab hidden on Document, Contract, Opportunity, Lead, Engagement, Project, Work package and Company; extend `config/dashboards/record-page-files-tab.md` | Major | Ops coordinator, engineering lead | Tue 27 Oct |
| 29 | U14 decision: the four-tab record page (Overview, Work, Communication, Details) built, or R6 accepted | Minor | ED | Mon 26 Oct |
| 30 | B4: build under 500 MB unpacked, or an install path `01-deploy.md` documents | Blocker | Engineering lead | Thu 29 Oct |
| 31 | B7: npm registry (or mirror) and the CRM's own host in `it-request.md` section 5, proven on staging | Blocker | Deploy engineer, KUEC IT | Thu 29 Oct |
| 32 | B8: host cron for `verify-crons.sh` and disk, failures to Teams; uptime check on `/healthz` | Blocker | Deploy engineer | Thu 29 Oct |
| 33 | B11: encrypted backups (`rclone crypt` or IT's written guarantee) | Blocker | Deploy engineer | Thu 29 Oct |
| 34 | B9: public invite link off before the first invitation; in `members-and-roles.md` | Blocker | ED | Thu 29 Oct |
| 35 | M7: host of 12 GB or more, or staging elsewhere | Major | Deploy engineer | Thu 29 Oct |
| 36 | M8: refusals and failures written somewhere B8's alerting reads | Major | Engineering lead | Thu 29 Oct |
| 37 | U2: per D6, the roles that hold steps can write Status; the card hides buttons a person cannot use and says "You can't change this work package. Ask the ops coordinator." | Major | Engineering lead | Thu 29 Oct |
| 38 | U5: the card first on the work package page; at phone width buttons 44 px, full width, stacked | Major | Engineering lead | Thu 29 Oct |
| 39 | U8: when a person creates a lead and leaves "Referred by (colleague)" empty, the app fills it with them; test with a fixed clock | Major | Engineering lead | Thu 29 Oct |
| 40 | U12: focus into the opened form, Enter sends, Escape closes and returns focus, info icons one Tab stop each | Minor | Engineering lead | Thu 29 Oct |
| 41 | U13: card secondary text at 4.5:1 or more; status colours chosen to pass, or R7 accepted | Minor | Engineering lead | Thu 29 Oct |
| 42 | U15: "My opportunities" and "My tasks" views, each first in its picker; People opens a list with rows | Minor | Engineering lead | Thu 29 Oct |
| 43 | U16: lead record page fields in the order the guidance asks (Name, Source, Company, Person, Need, then the checks); app-written dates last | Minor | Engineering lead | Thu 29 Oct |
| 44 | U17: guidance widget tall enough for its Arabic lines at 390 px | Minor | Engineering lead | Thu 29 Oct |
| 45 | U22: sector chart grouped by sector or retitled; Contracts in negotiation sorted on a date; curated views for playbook role assignments and holidays | Minor | Engineering lead | Thu 29 Oct |
| 46 | m8: the two "Thank the referrer" tasks get different titles | Minor | Engineering lead | Thu 29 Oct |
| 47 | Screencasts 1 to 4 of `20-guidance.md` section 7 recorded and linked (the day-one ones) | Minor | Ops coordinator | Fri 30 Oct |
| 48 | Staging built per `01-deploy.md` sections 3 to 11; image digest written into section 2; rows 6, 28 and the sidebar runbook applied (U20) | Blocker | Deploy engineer, ops coordinator, ED | Mon 2 Nov |
| 49 | Fresh-eyes sessions (section 2.2); every hesitation becomes a row here | Major | Ops coordinator | Wed 4 Nov |
| 50 | m2 and U24: Arabic for view, tab, widget, sidebar and timeline names; KUEC descriptions on Twenty's own fields through a click-runbook | Minor | Engineering lead, ops coordinator | Thu 5 Nov |
| 51 | Gate 22 rerun on staging | Blocker | Engineering lead, ops coordinator | Thu 5 Nov |
| 52 | Gate 22 rerun on production, the ops coordinator's run following the runbooks only | Blocker | Ops coordinator | Mon 9 Nov |
| 53 | This report's section 0 updated with the reruns and the sessions; go or no-go | Blocker | ED | Tue 10 Nov |
| 54 | U9 and U25: Approve, Send back and the link to the work on the card (backlog B1) | Major | Engineering lead | Thu 12 Nov |
| 55 | U20: links to a dashboard tab, or the tabs that need one as their own pages | Minor | Engineering lead | Thu 12 Nov |

---

## 6. How it was run, and how to run it again

**The instance.** The rehearsal of gate 22, rebuilt from `kuec/tests/release-gate/rehearsal/` (`bootstrap.sh`, then `seed-members.mjs`, `seed-reference.mjs`, `set-variables.mjs`) on `twentycrm/twenty:v2.48.0@sha256:43fab4bf...`, Postgres 16, Redis 7.4, `LOGIC_FUNCTION_TYPE=LOCAL`. The SMTP and Teams sinks were not running, so notification steps failed and their jobs retried (that is how U3 surfaced). The app was synced from a separate checkout of `aa3ce98c` with gate 22's three local workarounds and nothing else: `scripts` excluded in `tsconfig.json` (B1), the five comma labels rewritten with "or" and "and" (B2: "Inbound (web or email or phone)" and the like, so those labels in screenshots are not the shipped ones), and the guidance widget at index 0 (B3). None of it is committed.

**Personas.** Bader (bd1, business development officer), Bushra (bd2, business development officer, Arabic interface), Imran (ipo, IP office, a department role), the ED, from `seed-members.mjs`. Test records from `seed-ux.mjs`: one company, person, opportunity and lead, and one work package in each status, owned by Bader and reviewed by the ED.

**Browser.** Chromium 1194 headless, 1440 x 1000 for desktop and 390 x 844 (mobile, touch) for the phone checks, time zone Asia/Dubai.

**Running it again,** from `kuec/tests/ux-audit/` against a rehearsal, never production:

1. `npm init -y && npm install playwright-core@1.56.1` (both ignored by git); `server` must resolve to the rehearsal (`127.0.0.1 server` in `/etc/hosts`).
2. `node dump-model.mjs`, then `node record-pages.mjs > evidence/record-pages.txt`, `node views.mjs > evidence/views.txt`, `node fields.mjs > evidence/fields.txt`, `node options.mjs > evidence/options.txt`.
3. `node seed-ux.mjs`, then `node onboard.mjs ed@kuec.test` (twice on a new workspace: the second run skips "Invite your team"), `node onboard.mjs bd1@kuec.test`, and for Arabic set bd2's locale to `ar-SA` and run `node onboard.mjs bd2@kuec.test`.
4. Browser checks, in this order because some change records: `screens.mjs bd1@kuec.test 1440 1000 desktop`, `tabs.mjs`, `hover.mjs`, `hover-header.mjs`, `contrast.mjs`, `phone.mjs`, `card-states.mjs`, `card.mjs` (accepts the Offered package), `card-keys.mjs <id>` and `card-toast.mjs <id>` on packages set back to Offered, `screens.mjs bd2@kuec.test 1440 1000 arabic ar-SA`, `arabic-card.mjs`, `lead-create.mjs`.
5. `dept-accept.mjs` after offering a package to a department-role member and writing its id to `evidence/ipo-wp.id`; `gap-sweep.mjs`.
6. `node build-tables.mjs` writes `evidence/checks.csv`, `evidence/summary.json` and the tables of section 1 into this file between their markers.
