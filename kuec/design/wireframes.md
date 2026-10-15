# KUEC BD work layer: wireframes and UX specification

Phase B of `kuec-bd-ops` (front components). Written against Twenty 2.48.0 and the app as it stands on `main`: objects, statuses, playbooks and logic functions W01 to W11 are referenced by their real names. Anything marked **[new]** does not exist yet and is listed in section 8, Build list.

Contents

0. Ground rules for this spec
1. Foundations (surfaces, vocabulary, layout, motion, loading, freshness, fallback link)
2. Workflow: Describe, Choose, Progress
3. Screen: Home
4. Screen: Intake
5. Screen: Work package card
6. Screen: Manager exceptions
7. Shared messages (toasts, modals, errors)
8. Build list
9. Appendix: playbook additions, stage map, keyword table

---

## 0. Ground rules for this spec

- **The system decides, the person confirms.** Every field that can be derived (owner, reviewer, due dates, stage, next action, company match, playbook) is derived. The person types a description, picks one tile, and presses Confirm. Nothing on these screens is a setting.
- **Decisions are never hidden.** Anything that needs a human judgement (approve, bid or not, reassign, a deadline that will not fit) is shown as a decision card with its evidence, never resolved silently.
- **One primary action per decision.** Each card, item or form has at most one filled button; everything else is a secondary (outlined) button or a text link. On Home and Intake the page-level primary action is the field-shaped "What would you like to get done?" and "Confirm and set up" respectively; nothing else on those screens is styled like them.
- **Progressive disclosure is literal.** Inputs for Decline, Request help, Submit and Send back are not rendered until their button is pressed. They expand in place under the card; they never open a new surface.
- **No AI.** Per `kuec/CLAUDE.md`, matching and suggestions in this spec are deterministic rules (keyword tables, exact and prefix matches, the existing workload counter). Never describe them to users as "smart" or "AI".
- **Every component has a way out.** Each front component carries a link to the native Twenty record or view it is built on (section 1.7). If our component fails, the person is one click from the same data in plain Twenty.

---

## 1. Foundations

### 1.1 Surfaces

| Screen | Twenty surface | Entry points | Manifest entities [new] |
| --- | --- | --- | --- |
| Home | Standalone page `Today`, one tab, one FRONT_COMPONENT widget filling the tab | First sidebar item "Today" (above "BD"); default landing page for BD staff and the ED | `today.page-layout.ts`, `today-home.page-layout-tab.ts`, `home.front-component.tsx`, `today.navigation-menu-item.ts` |
| Intake | Side panel, front component page (`SidePanelPages.ViewFrontComponent`) | Home primary action; command menu item "New request" (GLOBAL, pinned); shortcut: command menu then type "new" | `intake.front-component.tsx`, `new-request.command-menu-item.ts` |
| Work package card | FRONT_COMPONENT widget at the top of the work package record page, above FIELDS, TASKS, NOTES, TIMELINE | Any click on a work package from Home or Exceptions opens the record in the side panel (`AppPath.RecordShowPage`), which renders this card first; also the full record page | `work-package-card.front-component.tsx`, `work-package.page-layout.ts` (record page) |
| Manager exceptions | Standalone page `Exceptions`, one tab, one FRONT_COMPONENT widget | Sidebar item "Exceptions" (below "Today"); link on the ED's Home | `exceptions.page-layout.ts`, `exceptions.page-layout-tab.ts`, `exceptions.front-component.tsx`, `exceptions.navigation-menu-item.ts` |

Work package record page layout, top to bottom: `work-package-card` (front component), FIELDS (all fields, collapsed by Twenty by default), TASKS, NOTES, TIMELINE. Opportunity record page keeps Twenty's layout plus a RECORD_TABLE widget of its work packages (view `work-packages-everything` filtered by the opportunity) placed second, after FIELDS.

SDK calls used, so nothing here needs inventing:

| Need | Call |
| --- | --- |
| Open Intake in the side panel | `openSidePanelPage({ page: SidePanelPages.ViewFrontComponent, frontComponentId, pageTitle: 'New request' })`. Resolve `frontComponentId` from the Intake front component's universal identifier once per Home load through the metadata API and keep it in `sessionStorage`. |
| Open a record in the side panel | `openSidePanelPage({ to: AppPath.RecordShowPage, params: { objectNameSingular, objectRecordId } })` |
| Go to a native view | `navigate(AppPath.RecordIndexPage, { objectNamePlural }, { viewId })`. Resolve `viewId` from the view's universal identifier through the metadata API; if it cannot be resolved, navigate without `viewId`. |
| Confirm a consequential action | `openCommandConfirmationModal({ title, subtitle, confirmButtonText, confirmButtonAccent })` |
| Toast | `enqueueSnackbar({ message, variant, dedupeKey })` |
| Close the panel after Intake | `closeSidePanel()` |
| Current user, record, locale, theme | `useUserId`, `useRecordId`, `useLocale`, `useColorScheme` |
| Data | The app's typed client (`usesSdkClient`), running with the signed-in person's permissions. Intake preview and confirm, and Request help, go through HTTP-route logic functions with `isAuthRequired: true` (section 8.3), because they need data BD roles cannot read (role assignments, holidays, team workload). |

### 1.2 Vocabulary

Use these words, and only these, everywhere in the four components. A first-week employee should never meet an API value.

**Work package status**

| API value | Badge (EN) | Badge colour | Meaning shown on hover |
| --- | --- | --- | --- |
| `PLANNED` | Not started | gray | Starts when the step before it is done. |
| `OFFERED` | Waiting to be accepted | sky | Offered to {owner}. Needs a yes or no. |
| `ACCEPTED` | In progress | blue | {owner} accepted this and is working on it. |
| `SUBMITTED` | Waiting for review | purple | Sent to {reviewer} to check. |
| `BLOCKED` | Blocked | red | Can't move until something is sorted. The ED knows. |
| `DONE` | Done | green | Approved and finished. |
| `DECLINED` | Declined | orange | {owner} can't take this. The ED is choosing someone else. |
| `CANCELLED` | Stopped | gray | This work is no longer needed. |

"Accepted" and "In progress" are one state. Accepting is the moment work starts, so a separate "Start" click would be configuration the person does not need. The badge says "In progress"; the timeline entry says "Accepted by {owner}". No new status option is added.

**Opportunity stage** (labels relabelled in Settings, API values unchanged; runbook in section 8.5)

| Stage label | API value | Who moves it |
| --- | --- | --- |
| Qualify | `NEW` | System, on case creation |
| Scope | `SCREENING` | System, when the playbook reaches a Scope step (section 9.2) |
| Propose | `MEETING` | System, same rule |
| Negotiate | `PROPOSAL` | System, same rule |
| Signed | `SIGNED` | Person, through an outcome question (section 5.6) |
| Lost | `LOST` | Person, through "Don't bid" or an outcome question |
| Parked | `PARKED` | Person, through an outcome question; or W-rule after 3 unanswered follow-ups (exists in the RFQ playbook) |
| (deprecated) Customer | `CUSTOMER` | Nobody. Hidden from the pipeline views. |

**People and time**

- "the ED" in English copy, "المدير التنفيذي" in Arabic. Never "manager", "admin" or "escalation".
- Names: first name only on cards ("Sara"), full name in pickers.
- "working days", never "business days". Working days are Monday to Friday excluding the UAE holiday list (the app's holiday object), computed in Asia/Dubai.
- Due labels, computed in Asia/Dubai:

| Condition | EN | Example |
| --- | --- | --- |
| Due today | Due today | Due today |
| Due next calendar day | Due tomorrow | Due tomorrow |
| Due within the next 6 days | Due {weekday} | Due Thursday |
| Due later | Due {d MMM} | Due 30 Oct |
| Past due | Late since {weekday d MMM} | Late since Tue 14 Oct |
| Estimate (later playbook steps) | Around {d MMM} | Around 22 Oct |

  Late items show the date they became late, not a count, so nobody has to know whether "2 days" means working or calendar days.

### 1.3 Layout and tokens

All four components share one layout grammar.

- Base unit 8 px. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Home and Exceptions: one centred column, max width 720 px, 48 px top padding, 24 px side padding (16 px under 600 px). Nothing else on the page: no sidebar-within-page, no charts, no filters.
- Side panel components (Intake, card when opened in the panel): full panel width, 16 px padding.
- Blocks are separated by 48 px of whitespace, not by lines. Items inside a block are separated by 8 px and a 1 px divider at 6% foreground opacity.
- Type (system font stack; Arabic falls back to the platform's Arabic UI font):

| Role | Size / line height / weight |
| --- | --- |
| Greeting | 28 / 34 / 600 |
| Subtitle | 15 / 22 / 400, secondary colour |
| Block heading | 15 / 22 / 600 |
| Item title | 14 / 20 / 500 |
| Body and evidence | 14 / 20 / 400 |
| Meta (dates, names, case) | 13 / 18 / 400, secondary colour |

- Colour: read `useColorScheme()` and use Twenty's light and dark neutrals. Status colours only on badges and the 8 px status dot; never as fills behind text blocks. Red is reserved for Blocked and Late. The primary button uses Twenty's blue accent; destructive confirms use the `danger` accent of the confirmation modal.
- Buttons: 32 px high, 12 px horizontal padding, 8 px gap between buttons. Primary is filled; secondary is outlined; tertiary is a text link. Minimum hit area 32 x 32.
- Focus: visible 2 px focus ring on every interactive element. Tab order follows reading order. `Enter` submits an open inline form; `Escape` closes it and returns focus to the button that opened it.
- RTL: when `useLocale()` starts with `ar`, set `dir="rtl"` on the component root. Use logical CSS properties only (`margin-inline-start`, `padding-inline`, `inset-inline-end`) so the layout mirrors with no extra code. Icons that imply direction (chevrons, "back") are mirrored; status dots, checkmarks and the clock icon are not. Dates in Arabic use `Intl.DateTimeFormat('ar-AE', { numberingSystem: 'latn' })`: Gregorian calendar, Arabic month and weekday names, Western digits, which is the UAE business convention.

### 1.4 Motion

- Inline forms expand and collapse in 200 ms, ease-out, by height and opacity. Content below moves down; nothing overlaps.
- When an item is resolved (accepted, approved, reassigned), it collapses in place in 200 ms and the list closes the gap. The toast confirms what happened. Items never jump between blocks while the person is looking; a moved item appears in its new block on the next refresh.
- The side panel uses Twenty's own open and close motion. Our components do not animate on mount beyond the skeleton-to-content fade (150 ms).
- `prefers-reduced-motion: reduce` turns all of the above into instant changes.

### 1.5 Loading

- No spinners anywhere inside our components. Loading is a skeleton that has the exact shape of the content it replaces: same block headings (rendered as real text, not skeleton), same number of rows as last time (remembered in `sessionStorage`, default 3), each row a 14 px bar at 60% width and a 13 px bar at 35% width.
- Skeleton colour: foreground at 6% opacity, with a slow (1.6 s) left-to-right shimmer; mirrored in RTL; static under reduced motion.
- Skeletons appear only if loading takes longer than 300 ms, so fast loads never flash.
- Each block loads independently. A fast block renders while a slow one still shows its skeleton.
- Buttons that send a write show their label at 50% opacity and ignore further clicks until the write returns. No spinner in the button.

### 1.6 Data freshness and writes

Components do not receive realtime updates. The rules:

- Fetch on mount, on window focus (`visibilitychange` to visible), and after every write the component makes.
- Show "Updated {relative time}" at the bottom of Home and Exceptions with a "Refresh" text link. Relative time: "just now" under 1 minute, then "{n} min ago", then the time.
- Before every write, re-read the record and check the status the button was rendered for. If it changed, do not write: show the conflict message (section 7) and re-render with the fresh record.
- Writes are optimistic only for the item's own disappearance from a list; the toast is sent after the server confirms. On failure, the item reappears in place and the error toast is shown.

### 1.7 The fallback link

Every component has exactly one fallback link, always visible, in the same place: the top end corner of the component (top right in LTR, top left in RTL), 13 px text link, secondary colour.

| Component | Link text (EN) | Target |
| --- | --- | --- |
| Home, Needs your decision block | Open as list | Staff: view `Offered to me`; reviewer items are also in `Submitted for my review`. Link goes to `Offered to me` when the block has any offers, else `Submitted for my review`. ED: view `Blocked`. |
| Home, Your next actions block | Open as list | View `My work` |
| Home, Other work is progressing block | Open as list | Staff: view `Work packages by status` (a native view cannot filter on "cases I own", so this shows all; the block itself is the filtered version). ED: `BD` standalone page, tab `Team`. |
| Intake | Create it the usual way | `AppPath.RecordIndexPage` for `opportunities` (the native "+ New" lives there) |
| Work package card | Open full record | `AppPath.RecordShowPage` for this work package (when the card is already on the full page, the link reads "Show all fields" and scrolls to the FIELDS widget) |
| Exceptions, each section | Open as list | Blocked: view `Blocked`. Late: view `BD: Team overdue work packages`. No next step: view `No next action`. |

On any error state, the fallback link is repeated as a secondary button next to "Try again" so it is impossible to miss.

---

## 2. Workflow: Describe, Choose, Progress

The most complex task: an inbound industry request (an email to the BD mailbox, a call, a meeting note) becomes a scoped, assigned case with owners, dates and timers. The person needs about 40 seconds and three decisions: what was asked, what kind of request it is, and "yes, set it up".

Nothing is written to the database until Confirm. Closing the panel at any point before Confirm loses nothing: the draft text and tile are kept in `sessionStorage` for 24 hours and restored next time Intake opens, with the line "We kept your draft."

### Step 1. Describe

| What the person sees | What the system does underneath |
| --- | --- |
| Side panel titled "New request". One large text box, focused, placeholder "Paste the email or describe the request in your own words." Under it, one quiet line: "Describe the request. Don't paste contracts or confidential documents; link to them instead." Nothing else on screen except the fallback link. | Opens Intake via `openSidePanelPage`. Restores any draft from `sessionStorage`. |
| As they type or paste, a quiet line appears under the box after 300 ms of no typing: "From: **ADNOC** (in Twenty)". If no company is recognised: "Who is this from?" with a company search field. | Deterministic company match, in order: (1) an email domain in the text equals a company's `domainName`; (2) a company `name` appears in the text as a whole word, case-insensitive, longest match wins. Searches Company records with the person's permissions. Nothing is created. |
| If a date is found: "Client deadline: **Thu 30 Oct**. Not right? Change it." If none is found, nothing is shown in Step 1 (it is asked in Step 2 only for playbooks that use it). | Date detection: `d MMM`, `d MMMM`, `d/m/yyyy`, `yyyy-mm-dd`, and English weekday names after "by" or "before". The first future date wins. Interpreted in Asia/Dubai. Day-first for numeric dates (UAE convention). |
| The six type tiles appear below the box as soon as the text has 3 or more words. One tile may carry a small "Suggested" label. | Keyword table (section 9.3) scores each tile; the highest score above zero gets "Suggested". Ties: no suggestion. The suggestion never selects the tile; the person must click. |
| Primary button: none yet. The person's next move is choosing a tile. | Draft text saved to `sessionStorage` on every change. |

### Step 2. Choose

| What the person sees | What the system does underneath |
| --- | --- |
| They click a tile. It fills with the accent colour; the other tiles shrink to a single compact row so the preview has room. "Change type" link to restore the grid. | Calls `POST /kuec/intake/preview` with `{ tile, companyId, clientDeadline }`. The route maps the tile to a playbook (section 4.3), loads holidays, playbook role assignments and the open work package count per member, and runs the existing pure planner `planCaseWorkPackages` with `openedAt = now`, `caseOwnerMemberId = me` and the `CLIENT_DEADLINE` anchor. Read-only. |
| Below: "Here's the plan" and one row per step: step number, title, owner avatar and first name, due label. Step 1 shows a real due date ("Due Thursday"). Later steps show "Around 22 Oct" in secondary colour. The case owner row at the top: "You'll own this case." | Step 1's `dueAt` comes from the planner. Later steps have no `dueAt` until released (their offsets count from the previous step's completion), so the route also returns an estimate: each step's offset added to the previous step's estimate in working days. Estimates are labelled "Around" because they are. |
| Only for playbooks with a client-deadline anchor (RFQ / technical service, Industry challenge) and no date found in Step 1: one field, "When does the client need our answer?", date picker, with a "They didn't say" choice selected by default. | `CLIENT_DEADLINE` anchor drives the existing due cap ("no later than 2 working days before the client deadline"). "They didn't say" sends no anchor. |
| If the plan does not fit the deadline, one amber line above Confirm: "At the usual pace, this plan finishes after the client's deadline of Tue 28 Oct. You can still go ahead; the ED will be asked to decide." | The route compares the estimated date of the last capped step with the cap. If later, it returns `deadlineRisk: true`. This is the playbook's own rule ("the case owner escalates to the ED"), absorbed by the system. |
| One primary button: "Confirm and set up". Under it, 13 px: "People on this plan will be told what they need to do." | Nothing is written yet. |

Owners and dates in the preview are not editable here. Changing them is rare, and doing it on the case afterwards (native fields on the work package) keeps Intake to one decision. The preview says so in one line under the rows: "You can change people and dates on the case after it's set up."

### Step 3. Progress

| What the person sees | What the system does underneath |
| --- | --- |
| On Confirm, the button label dims; the preview rows stay in place and gain a status column showing skeleton bars. | `POST /kuec/intake/confirm` with `{ intakeRequestId, tile, text, companyId or newCompanyName, clientDeadline }`. `intakeRequestId` is a UUID generated when Intake opened; a second Confirm with the same id returns the existing opportunity instead of creating another. |
|  | The route, in order, each step idempotent: (1) creates the company if `newCompanyName` was given; (2) creates the opportunity: `name` = "{Company}: {first 8 words of the text}" trimmed to 60 characters, `stage` = `NEW` (Qualify), `ownerId` = me, `source` = `INBOUND`, `clientDeadline`, `intakeRequestId`; (3) creates a Note on the opportunity titled "Original request" with the full text; (4) if `deadlineRisk`, sets `deadlineRiskFlaggedAt` **[new]**; (5) sets `playbookType`. |
|  | Step 5 fires **W01** (`opportunity.updated` on `playbookType`), which runs `instantiateCase`: creates every work package with objective, expected output, done criteria and `playbookStep` from `templates.json`; picks each owner as the least-loaded active member of the step's role; sets reviewers; sets step 1 to `OFFERED` with `dueAt`, later steps to `PLANNED`; sets the opportunity's `nextAction` and `nextActionDate` from step 1; marks `playbookApplied`. |
|  | Setting step 1 to `OFFERED` fires **W02**: notifies the owner (Teams and email, "Offered to you, please accept or decline") and schedules the acceptance timers: 2 working days, notify owner and ED; 5 working days, reassign to the ops coordinator and notify previous owner, new owner and ED. **W03** schedules the due timers: overdue, notify owner on the day; +2 working days, notify the ED. The hourly sweep re-derives all of these from record state. |
| The component polls the opportunity's work packages every 1.5 s. Each row's skeleton is replaced by its real badge ("Waiting to be accepted" for step 1, "Not started" for the rest) and the real owner, as they appear. | Read-only polling by `opportunityId`, stopped at the first complete result or after 20 s. |
| When all rows are real: heading changes to "Your case is set up." Line under it: "{Owner of step 1} has been asked to start {step 1 title}, due {due label}." If step 1 is yours: "Your first step is {title}, due {due label}. It's on your Home now." | If `deadlineRisk`: a decision card is now on the ED's Home (section 3.3, "Tight deadline"). |
| Two buttons: primary "Open the case" (opens the opportunity in the side panel), secondary "Done" (closes the panel). Toast: "Case set up: {opportunity name}." | Draft cleared from `sessionStorage`. |
| If 20 s pass before all rows appear: "Your case is saved. The work list is still being prepared and will appear on the case in a minute." Buttons as above. | The opportunity exists and W01 will finish; the hourly sweep and the W04 next-action guard cover a lost event. |
| From now on the case moves without anyone touching the stage. When step 1 is done and step 2 is offered, the stage moves to Scope, and so on. | **[new] W12 stage follows step** (section 9.2). Only moves forward; never touches Signed, Lost or Parked. |

---

## 3. Screen: Home

### 3.1 Purpose

The first thing every person sees each morning. Answers one question: what do I have to do, and what am I waiting on? It replaces chasing. The ED's Home is the same screen with team-wide decisions.

### 3.2 Wireframe

```
+--------------------------------------------------------------------------+
|                                                                          |
|   Good morning, Sara.                                                    |
|   Here's what needs your attention.                                      |
|                                                                          |
|   +------------------------------------------------------------------+   |
|   |  What would you like to get done?                              > |   |
|   |  Paste an email or describe a request                            |   |
|   +------------------------------------------------------------------+   |
|                                                                          |
|                                                                          |
|   Needs your decision  2                                  Open as list   |
|   ------------------------------------------------------------------     |
|   * Scoping                                     Waiting to be accepted   |
|     ADNOC: corrosion testing for pipeline coatings                       |
|     Define the technical work the client needs.                          |
|     Due Thursday  .  Offered 1 working day ago                           |
|     [ Accept ]  ( Decline )                             Read the brief   |
|   ------------------------------------------------------------------     |
|   * Review: Quote or proposal                        Waiting for review  |
|     Masdar: battery thermal test, from Omar                              |
|     "Price uses 6 person-days at the standard lab rate."                 |
|     Link: SharePoint . Submitted 2 hours ago                             |
|     [ Approve ]  ( Send back )                          Read the brief   |
|                                                                          |
|                                                                          |
|   Your next actions  4                                    Open as list   |
|   ------------------------------------------------------------------     |
|   * Bid or no-bid                                Late since Tue 14 Oct   |
|     EGA: dust emission analysis                         In progress      |
|   ------------------------------------------------------------------     |
|   * Next step: call Dr. Hamad about sample size          Due today       |
|     Mubadala: lab access for composites                                  |
|     ( Done, what's next? )                                               |
|   ------------------------------------------------------------------     |
|   * Omar asked for help on Scoping                       Due tomorrow    |
|     "Which spectrometer can we book in November?"                        |
|     ( Mark done )                                                        |
|   ------------------------------------------------------------------     |
|   * Outreach                                             Due 30 Oct      |
|     Licence: low-cost desalination membrane            In progress       |
|                                                                          |
|                                                                          |
|   Other work is progressing                               Open as list   |
|   7 work packages in your cases are with teammates. All on time.     v   |
|                                                                          |
|                                                                          |
|   Updated just now . Refresh                                             |
+--------------------------------------------------------------------------+

[ ] = primary button, at most one per item   ( ) = secondary button
*   = 8 px status dot                          > = chevron, mirrors in RTL
v   = expand chevron
```

### 3.3 Content rules

**Greeting.** "Good morning" before 12:00, "Good afternoon" 12:00 to 16:59, "Good evening" from 17:00, Asia/Dubai. First name from the workspace member. Subtitle: "Here's what needs your attention." when either of the first two blocks has items; otherwise "Nothing needs you right now."

**Primary action, "What would you like to get done?".** A full-width, 64 px high field-shaped button (looks like an input, behaves like a button). Click or `Enter` opens Intake in the side panel with focus in its text box. Keyboard shortcut shown on hover: none (the command menu's "New request" covers power users). This is the only element on Home styled with the accent border.

**Block 1, Needs your decision.** Someone, or the system, is waiting on your yes or no. Ordered by how long they have waited, oldest first. Up to 5 shown; then "Show {n} more" text link that expands in place.

| Item type | Who sees it | Query | Evidence shown | Buttons |
| --- | --- | --- | --- | --- |
| Offer | The owner | Work package `status = OFFERED`, `ownerId = me` | Title, case name, objective (1 line, truncated), due label, "Offered {n} working days ago" | Primary "Accept". Secondary "Decline" (expands reason, section 5.5). Link "Read the brief" (opens the card in the side panel). |
| Review | The reviewer | `status = SUBMITTED`, `reviewerId = me` | "Review: {title}", case and submitter, the submitter's note in quotes (first 2 lines), "Link: SharePoint" if `outputLink` set, "Submitted {relative}" | Primary "Approve". Secondary "Send back" (expands reason). For step `BID_NO_BID`: primary "Approve: we'll bid" or "Approve: we won't bid" (matching the submitter's recommendation), secondary "Send back". Link "Read the brief". |
| Blocked | ED only | `status = BLOCKED` and (`blockAcknowledgedAt` empty or earlier than `blockedAt`) **[new field]** | "Blocked: {title}", case, owner, the reason in quotes, "Blocked since {date}", client deadline if any | Primary "Back to work" (the owner continues). Secondary "Give to someone else" (picker, suggested person preselected). Secondary "Keep waiting" (acknowledges, stays on Exceptions). |
| Declined | ED only | `status = DECLINED` | "Declined: {title}", case, owner, `declinedReason` **[new field]** in quotes, "Suggested: {name} ({n} open work packages)" | Primary "Give to {suggested first name}". Secondary "Choose someone else" (picker). |
| Tight deadline | ED only | Opportunity with `deadlineRiskFlaggedAt` set and `deadlineRiskAcknowledgedAt` empty **[new fields]** | "Tight deadline: {opportunity}", owner, "Client deadline {date}. At the usual pace the plan finishes around {date}." | Primary "Go ahead" (acknowledges). Secondary "Don't bid" (expands reason, sets stage Lost with `lostReason`). |

Suggested person for reassignment: the active member of the step's playbook role with the fewest open work packages, excluding the current owner. Same counter as `instantiateCase` (`countOpenWorkPackagesByMember`), exposed through the preview route's helper so both use one rule.

**Block 2, Your next actions.** Things only you can move forward. Ordered: late first (oldest late first), then by due date, then items with no date. Up to 7 shown; "Show {n} more".

| Item type | Query | Shown | Action |
| --- | --- | --- | --- |
| Work in progress | Work package `ownerId = me`, `status in (ACCEPTED, BLOCKED)` | Title, case, status badge, due label | Whole row opens the card in the side panel. No inline button: Submit lives on the card, because it needs the brief in view. Blocked rows show "Blocked. The ED knows." in place of the due label. |
| Next step on an opportunity | Opportunity `ownerId = me`, stage not Signed, Lost or Parked, and `nextActionDate <= today + 2 working days` or `nextAction` empty or `nextActionDate` empty | "Next step: {nextAction}" or "Set a next step" when empty; opportunity name; due label | Secondary "Done, what's next?" expands: text field "What's the next step?" and date field "By when?" (default: 3 working days from today), "Save". When empty: secondary "Set a next step", same form. Both fields required; this is the "every opportunity has a next action and a date" rule. |
| Task | Native Task `assigneeId = me`, status not Done, `dueAt <= today + 2 working days` or empty | Task title, linked record name, due label. Help requests read "{name} asked for help on {work package}" with the request in quotes. | Secondary "Mark done". |

**Block 3, Other work is progressing.** Reassurance, not a to-do list. Collapsed by default to one sentence; the chevron expands the list in place.

- Staff: work packages in opportunities you own (`opportunity.ownerId = me`) where `ownerId != me` and `status in (OFFERED, ACCEPTED, SUBMITTED, BLOCKED)`.
- ED: every open work package in the team, grouped by owner.

Sentence rules (first that matches):

| Condition | EN |
| --- | --- |
| None | Nothing else is moving right now. |
| All on time, none waiting over 2 working days for acceptance | {n} work packages in your cases are with teammates. All on time. |
| Some late or long-waiting | {n} work packages in your cases are with teammates. {m} need a nudge. |
| ED | {n} work packages are moving across the team. {m} need a nudge. |

Expanded row: status dot, title, owner first name, status badge, due label. Amber dot for "waiting to be accepted for 2 or more working days" and for "late"; gray otherwise. No buttons; the row opens the card. ED expanded view groups by person: "Sara: 4 in progress, 1 waiting for review".

ED only: a 13 px line under the subtitle when exceptions exist: "{n} exceptions across the team. See them" (link to Exceptions).

### 3.4 States

| State | What shows |
| --- | --- |
| Loading | Greeting and primary action render immediately (they need only the user's name, which loads first; until then the greeting reads "Good morning." with no name). Each block shows its real heading and a skeleton of its last-known row count. |
| Empty, block 1 | Heading stays. One line, secondary colour: "Nothing needs your decision right now." |
| Empty, block 2 | "No next actions. When you accept work or own a case, its next step shows up here." |
| Empty, block 3 | The sentence "Nothing else is moving right now." Chevron hidden. |
| Empty, everything (new employee, first day) | Subtitle "Nothing needs you right now." Under the primary action, one 13 px line: "When a request comes in, start here. We'll set up the steps and tell everyone what to do." Blocks 1 and 2 are hidden entirely instead of showing three empty messages. |
| Error, one block | That block only: "We couldn't load this part. Your data is safe." Secondary "Try again", secondary "Open as list". Other blocks are unaffected. |
| Error, whole component (no user, no network) | Greeting area: "We couldn't load your Home." Body: "This is a display problem; nothing is lost. You can carry on in Twenty while we sort it out." Buttons: primary "Try again", secondary "Open My work". |
| Offline | A 13 px line replaces "Updated...": "You're offline. This was last updated at {time}." Buttons stay visible but writes show the offline toast. |
| Write conflict | Toast (section 7) and the item re-renders with its fresh state. |

### 3.5 Copy, English

| Key | EN |
| --- | --- |
| home.greeting.morning | Good morning, {firstName}. |
| home.greeting.afternoon | Good afternoon, {firstName}. |
| home.greeting.evening | Good evening, {firstName}. |
| home.subtitle.attention | Here's what needs your attention. |
| home.subtitle.clear | Nothing needs you right now. |
| home.primary.label | What would you like to get done? |
| home.primary.hint | Paste an email or describe a request |
| home.firstDay.hint | When a request comes in, start here. We'll set up the steps and tell everyone what to do. |
| home.ed.exceptions | {count, plural, one {# exception across the team.} other {# exceptions across the team.}} See them |
| home.block.decisions | Needs your decision |
| home.block.next | Your next actions |
| home.block.other | Other work is progressing |
| home.block.openAsList | Open as list |
| home.block.showMore | Show {count} more |
| home.block.showLess | Show less |
| home.decisions.empty | Nothing needs your decision right now. |
| home.next.empty | No next actions. When you accept work or own a case, its next step shows up here. |
| home.other.none | Nothing else is moving right now. |
| home.other.onTime | {count, plural, one {# work package in your cases is with a teammate. All on time.} other {# work packages in your cases are with teammates. All on time.}} |
| home.other.nudge | {count, plural, one {# work package in your cases is with a teammate.} other {# work packages in your cases are with teammates.}} {late, plural, one {# needs a nudge.} other {# need a nudge.}} |
| home.other.ed | {count, plural, one {# work package is moving across the team.} other {# work packages are moving across the team.}} {late, plural, =0 {All on time.} one {# needs a nudge.} other {# need a nudge.}} |
| item.offered | Offered {days, plural, =0 {today} one {# working day ago} other {# working days ago}} |
| item.submitted | Submitted {relativeTime} |
| item.review.title | Review: {title} |
| item.review.from | {caseName}, from {firstName} |
| item.blocked.title | Blocked: {title} |
| item.blocked.since | Blocked since {date} |
| item.blocked.edKnows | Blocked. The ED knows. |
| item.declined.title | Declined: {title} |
| item.declined.suggested | Suggested: {firstName} ({count, plural, one {# open work package} other {# open work packages}}) |
| item.deadline.title | Tight deadline: {opportunityName} |
| item.deadline.body | Client deadline {deadline}. At the usual pace the plan finishes around {estimate}. |
| item.nextStep | Next step: {nextAction} |
| item.setNextStep | Set a next step |
| item.help | {firstName} asked for help on {title} |
| item.link | Link: SharePoint |
| item.readBrief | Read the brief |
| button.accept | Accept |
| button.decline | Decline |
| button.approve | Approve |
| button.approveBid | Approve: we'll bid |
| button.approveNoBid | Approve: we won't bid |
| button.sendBack | Send back |
| button.backToWork | Back to work |
| button.giveToSomeoneElse | Give to someone else |
| button.giveTo | Give to {firstName} |
| button.chooseSomeoneElse | Choose someone else |
| button.keepWaiting | Keep waiting |
| button.goAhead | Go ahead |
| button.dontBid | Don't bid |
| button.doneWhatsNext | Done, what's next? |
| button.markDone | Mark done |
| button.save | Save |
| button.cancel | Cancel |
| form.nextStep.label | What's the next step? |
| form.nextStep.placeholder | For example: Send the quote to Dr. Hamad |
| form.nextStep.date | By when? |
| form.sendBack.label | What needs to change? |
| form.sendBack.placeholder | Be specific, so they can fix it in one go. |
| form.dontBid.label | Why aren't we bidding? |
| form.dontBid.placeholder | For example: Lab is fully booked until January. |
| form.picker.label | Who should do this? |
| form.picker.load | {count, plural, =0 {Nothing open} one {# open} other {# open}} |
| footer.updated | Updated {relativeTime} |
| footer.refresh | Refresh |
| footer.offline | You're offline. This was last updated at {time}. |
| error.block | We couldn't load this part. Your data is safe. |
| error.home.title | We couldn't load your Home. |
| error.home.body | This is a display problem; nothing is lost. You can carry on in Twenty while we sort it out. |
| button.tryAgain | Try again |
| button.openMyWork | Open My work |

Toasts for Home actions are in section 7.

### 3.6 Copy, Arabic (Home)

Arabic copy uses gender-neutral phrasing (verbal nouns for buttons, noun phrases for headings) wherever Arabic allows; where a verb must address the person, it uses the masculine singular, which is the standard convention in Arabic software. Plurals use the full ICU Arabic plural categories. Have one native-speaking team member read this table in the running product before release.

| Key | AR |
| --- | --- |
| home.greeting.morning | صباح الخير يا {firstName}. |
| home.greeting.afternoon | مساء الخير يا {firstName}. |
| home.greeting.evening | مساء الخير يا {firstName}. |
| home.subtitle.attention | إليك ما يحتاج إلى اهتمامك. |
| home.subtitle.clear | لا شيء يحتاج إليك الآن. |
| home.primary.label | ما الذي تريد إنجازه؟ |
| home.primary.hint | الصق رسالة بريد إلكتروني أو صِف الطلب |
| home.firstDay.hint | عندما يصل طلب جديد، ابدأ من هنا. سنُعدّ الخطوات ونُبلغ كل شخص بما عليه. |
| home.ed.exceptions | {count, plural, zero {لا توجد استثناءات في الفريق.} one {استثناء واحد في الفريق.} two {استثناءان في الفريق.} few {# استثناءات في الفريق.} many {# استثناءً في الفريق.} other {# استثناء في الفريق.}} عرضها |
| home.block.decisions | بانتظار قرارك |
| home.block.next | خطواتك التالية |
| home.block.other | أعمال أخرى قيد التنفيذ |
| home.block.openAsList | فتح كقائمة |
| home.block.showMore | عرض {count} أخرى |
| home.block.showLess | عرض أقل |
| home.decisions.empty | لا شيء بانتظار قرارك الآن. |
| home.next.empty | لا توجد خطوات تالية. عندما تقبل عملاً أو تتولى حالة، ستظهر خطوتها التالية هنا. |
| home.other.none | لا توجد أعمال أخرى قيد التنفيذ الآن. |
| home.other.onTime | {count, plural, one {حزمة عمل واحدة في حالاتك لدى أحد الزملاء. كل شيء في موعده.} two {حزمتا عمل في حالاتك لدى الزملاء. كل شيء في موعده.} few {# حزم عمل في حالاتك لدى الزملاء. كل شيء في موعده.} many {# حزمة عمل في حالاتك لدى الزملاء. كل شيء في موعده.} other {# حزمة عمل في حالاتك لدى الزملاء. كل شيء في موعده.}} |
| home.other.nudge | {count, plural, one {حزمة عمل واحدة في حالاتك لدى أحد الزملاء.} two {حزمتا عمل في حالاتك لدى الزملاء.} few {# حزم عمل في حالاتك لدى الزملاء.} many {# حزمة عمل في حالاتك لدى الزملاء.} other {# حزمة عمل في حالاتك لدى الزملاء.}} {late, plural, one {واحدة منها تحتاج إلى متابعة.} two {اثنتان منها تحتاجان إلى متابعة.} few {# منها تحتاج إلى متابعة.} many {# منها تحتاج إلى متابعة.} other {# منها تحتاج إلى متابعة.}} |
| home.other.ed | {count, plural, one {حزمة عمل واحدة قيد التنفيذ في الفريق.} two {حزمتا عمل قيد التنفيذ في الفريق.} few {# حزم عمل قيد التنفيذ في الفريق.} many {# حزمة عمل قيد التنفيذ في الفريق.} other {# حزمة عمل قيد التنفيذ في الفريق.}} {late, plural, =0 {كل شيء في موعده.} one {واحدة منها تحتاج إلى متابعة.} two {اثنتان منها تحتاجان إلى متابعة.} few {# منها تحتاج إلى متابعة.} many {# منها تحتاج إلى متابعة.} other {# منها تحتاج إلى متابعة.}} |
| item.offered | {days, plural, =0 {عُرضت اليوم} one {عُرضت قبل يوم عمل واحد} two {عُرضت قبل يومَي عمل} few {عُرضت قبل # أيام عمل} many {عُرضت قبل # يوم عمل} other {عُرضت قبل # يوم عمل}} |
| item.submitted | سُلّمت {relativeTime} |
| item.review.title | مراجعة: {title} |
| item.review.from | {caseName}، من {firstName} |
| item.blocked.title | متوقفة: {title} |
| item.blocked.since | متوقفة منذ {date} |
| item.blocked.edKnows | متوقفة. المدير التنفيذي على علم. |
| item.declined.title | مرفوضة: {title} |
| item.declined.suggested | المقترح: {firstName} ({count, plural, zero {لا أعمال مفتوحة} one {عمل مفتوح واحد} two {عملان مفتوحان} few {# أعمال مفتوحة} many {# عملاً مفتوحاً} other {# عمل مفتوح}}) |
| item.deadline.title | موعد ضيّق: {opportunityName} |
| item.deadline.body | موعد العميل النهائي {deadline}. بالوتيرة المعتادة تنتهي الخطة نحو {estimate}. |
| item.nextStep | الخطوة التالية: {nextAction} |
| item.setNextStep | تحديد الخطوة التالية |
| item.help | طلب {firstName} المساعدة في {title} |
| item.link | الرابط: SharePoint |
| item.readBrief | قراءة التفاصيل |
| button.accept | قبول |
| button.decline | رفض |
| button.approve | اعتماد |
| button.approveBid | اعتماد: سنتقدّم بعرض |
| button.approveNoBid | اعتماد: لن نتقدّم بعرض |
| button.sendBack | إعادة للتعديل |
| button.backToWork | استئناف العمل |
| button.giveToSomeoneElse | إسناد إلى شخص آخر |
| button.giveTo | إسناد إلى {firstName} |
| button.chooseSomeoneElse | اختيار شخص آخر |
| button.keepWaiting | مواصلة الانتظار |
| button.goAhead | المضيّ قدماً |
| button.dontBid | عدم التقدّم بعرض |
| button.doneWhatsNext | تمّ، ما الخطوة التالية؟ |
| button.markDone | تمّ |
| button.save | حفظ |
| button.cancel | إلغاء |
| form.nextStep.label | ما الخطوة التالية؟ |
| form.nextStep.placeholder | مثال: إرسال عرض السعر إلى د. حمد |
| form.nextStep.date | بحلول متى؟ |
| form.sendBack.label | ما الذي يجب تغييره؟ |
| form.sendBack.placeholder | كن محدداً ليتمكّن من التعديل دفعة واحدة. |
| form.dontBid.label | لماذا لن نتقدّم بعرض؟ |
| form.dontBid.placeholder | مثال: المختبر محجوز بالكامل حتى يناير. |
| form.picker.label | من يتولّى هذا العمل؟ |
| form.picker.load | {count, plural, =0 {لا أعمال مفتوحة} one {عمل مفتوح واحد} two {عملان مفتوحان} few {# أعمال مفتوحة} many {# عملاً مفتوحاً} other {# عمل مفتوح}} |
| footer.updated | آخر تحديث {relativeTime} |
| footer.refresh | تحديث |
| footer.offline | أنت غير متصل. آخر تحديث كان في {time}. |
| error.block | تعذّر تحميل هذا الجزء. بياناتك سليمة. |
| error.home.title | تعذّر تحميل صفحتك الرئيسية. |
| error.home.body | هذه مشكلة في العرض فقط، ولم يُفقد أي شيء. يمكنك متابعة العمل في Twenty إلى أن نحلّها. |
| button.tryAgain | إعادة المحاولة |
| button.openMyWork | فتح «أعمالي» |

Due labels in Arabic: "مطلوب اليوم" (Due today), "مطلوب غداً" (Due tomorrow), "مطلوب يوم {weekday}" (Due {weekday}), "مطلوب بتاريخ {date}" (Due {date}), "متأخر منذ {date}" (Late since {date}), "نحو {date}" (Around {date}). Relative time uses `Intl.RelativeTimeFormat('ar-AE', { numeric: 'auto' })`, which yields "الآن", "قبل ٥ دقائق" style strings; pass `numberingSystem: 'latn'` through `Intl.NumberFormat` for the digits. The opportunity and work package names are data and are shown as typed, in either language.

---

## 4. Screen: Intake

### 4.1 Purpose

Turn any incoming request into a case in one pass. The person describes, chooses one tile, confirms. The workflow behind it is section 2; this section is the build spec for the panel.

### 4.2 Wireframe

State A, describing (before a tile is chosen):

```
+------------------------------------------------+
| New request                 Create it the usual way |
|                                                |
| +--------------------------------------------+ |
| | Dear KUEC team, ADNOC Onshore is looking   | |
| | for salt-spray and electrochemical testing | |
| | of three pipeline coatings. We need a      | |
| | quotation by 30 October...                 | |
| |                                            | |
| +--------------------------------------------+ |
| Describe the request. Don't paste contracts or |
| confidential documents; link to them instead.  |
| From: ADNOC (in Twenty)          Not right?    |
| Client deadline: Thu 30 Oct      Change it     |
|                                                |
| What kind of request is this?                  |
| +--------------------+ +--------------------+  |
| | A company needs a  | | A company has a    |  |
| | test or service    | | problem to solve   |  |
| |          Suggested | |                    |  |
| +--------------------+ +--------------------+  |
| +--------------------+ +--------------------+  |
| | A company wants to | | License one of our |  |
| | use our lab or     | | technologies       |  |
| | equipment          | |                    |  |
| +--------------------+ +--------------------+  |
| +--------------------+ +--------------------+  |
| | Work with a        | | Run a workshop     |  |
| | startup            | | or event           |  |
| +--------------------+ +--------------------+  |
+------------------------------------------------+
```

State B, plan preview (tile chosen):

```
+------------------------------------------------+
| New request                 Create it the usual way |
|                                                |
| +--------------------------------------------+ |
| | Dear KUEC team, ADNOC Onshore is looking...| |
| +--------------------------------------------+ |
| From: ADNOC . Client deadline: Thu 30 Oct      |
|                                                |
| [x] A company needs a test or service  Change type |
|                                                |
| Here's the plan                                |
| You'll own this case.                          |
|                                                |
|  1  Bid or no-bid        (S) Sara  Due Thursday |
|  2  Scoping              (A) Ahmed Around 22 Oct|
|  3  Quote or proposal    (S) Sara  Around 27 Oct|
|  4  Internal approval    (E) ED    Around 29 Oct|
|  5  Submission           (S) Sara  Around 30 Oct|
|  6  Follow-up            (S) Sara  Around 6 Nov |
|  7  Delivery hand-off    (S) Sara  Around 11 Nov|
|                                                |
| You can change people and dates on the case    |
| after it's set up.                             |
|                                                |
| ! At the usual pace, this plan finishes after  |
|   the client's deadline of Thu 30 Oct. You can |
|   still go ahead; the ED will be asked to      |
|   decide.                                      |
|                                                |
| [ Confirm and set up                         ] |
| People on this plan will be told what they     |
| need to do.                                    |
+------------------------------------------------+
```

State C, progress: same as B, the deadline line and hint removed, the button replaced by the result heading, each row gaining a status badge as it is created (section 2, Step 3). Final:

```
| Your case is set up.                           |
| Sara (you): your first step is Bid or no-bid,  |
| due Thursday. It's on your Home now.           |
|                                                |
|  1  Bid or no-bid    Sara   Waiting to be accepted |
|  2  Scoping          Ahmed  Not started        |
|  ...                                           |
|                                                |
| [ Open the case ]  ( Done )                    |
```

### 4.3 Tiles

Six tiles in a 2 x 3 grid (1 column under 360 px panel width). Each tile: 2-line label, 13 px one-line hint on hover and focus, "Suggested" chip at the bottom end. Order is fixed so people learn positions; Pull tiles first because inbound requests are the daily case.

| # | Tile label | Hover hint | Side | Creates | Playbook |
| --- | --- | --- | --- | --- | --- |
| 1 | A company needs a test or service | They want us to do technical work for them, often with a quote. | Pull | Opportunity | `RFQ_TECHNICAL_SERVICE` |
| 2 | A company has a problem to solve | They describe a challenge and want our researchers to help. | Pull | Opportunity | `INDUSTRY_CHALLENGE` **[new]** |
| 3 | A company wants to use our lab or equipment | They want access to a lab, an instrument or a facility. | Pull | Opportunity, `source = INBOUND` | `RFQ_TECHNICAL_SERVICE` (lab access is priced and delivered like a technical service) |
| 4 | License one of our technologies | We have a technology or patent and want a company to take it on. | Push | Opportunity | `TECHNOLOGY_LICENSING` |
| 5 | Work with a startup | A KUEC startup needs a partner, or a company wants to work with one. | Push | Opportunity | `STARTUP_PARTNERING` **[new]** |
| 6 | Run a workshop or event | An industry workshop, demo day or training. | Push | Project | `INDUSTRY_WORKSHOP` (project template, W09) |

Tile 4 asks one extra field in Step 2, because licensing needs it: "Which technology? Paste its uVENTURE link." (LINKS, optional; "I'll add it later" default). Tile 6 asks one extra field: "When is the event?" (date, required; the project template counts back from it).

Tile 1 and tile 3 share a playbook on purpose: the person thinks in terms of what was asked; the system knows they run the same way.

### 4.4 Behaviour

- Text box: auto-grows from 6 to 14 lines, then scrolls. Once a tile is chosen it shrinks to 3 lines; clicking it expands it again. Pasted email headers are kept as-is.
- Confidential content: the text is saved as the "Original request" note, and `kuec/CLAUDE.md` forbids contract text, proposals, IP disclosures or confidential documents in Twenty. So the box carries a permanent 13 px hint under it, "Describe the request. Don't paste contracts or confidential documents; link to them instead.", and over 4,000 characters the hint turns amber and reads "This looks like a whole document. Keep the key points and link the full document instead." Confirm stays enabled; the hard limit is 8,000 characters, past which Confirm is disabled with that same message.
- Never ask for an opportunity name. The system names it "{Company}: {first 8 words}" (60 characters max, cut at a word boundary). If there is no company: "{first 8 words}".
- Company line: "From: {Company} (in Twenty)" when matched. "Not right?" opens a company search field in place. If nothing matches, the search field is shown directly with the label "Who is this from?" and, when the typed name has no match, the option "Add {typed name} as a new company". A company is required only for tiles 1, 2 and 3; for 4, 5 and 6 the field is labelled "Company, if there is one".
- Deadline line: shown only when a date was found. "Change it" turns it into a date picker in place, with "They didn't say" as a choice.
- Confirm is enabled when: text has 3 or more words, a tile is chosen, required company is set, and the preview has loaded. When disabled, the reason is shown as the 13 px line under the button instead of the hint: "Choose the kind of request first.", "Tell us who this is from.", "Loading the plan...".
- Changing the tile after the preview re-runs the preview; the previous rows fade to 50% while the new ones load (skeleton only if over 300 ms).

### 4.5 States

| State | What shows |
| --- | --- |
| Loading (panel open) | Text box renders immediately; nothing loads before typing. |
| Loading (preview) | "Here's the plan" heading, then skeleton rows: the playbook's known step count (from the tile mapping, bundled with the component), each row a number, a 40% bar and a 20% bar. |
| Empty | The text box with its placeholder. Under it, one 13 px line: "We'll suggest the right steps and people. Nothing is saved until you confirm." |
| Draft restored | 13 px line above the box: "We kept your draft." and a text link "Start over". |
| Error, company search | Field shows "We couldn't search companies just now." with "Try again". The person can still type a new company name and choose "Add {name} as a new company". |
| Error, preview | In place of the rows: "We couldn't build the plan. Nothing has been saved." Secondary "Try again", secondary "Create it the usual way". Confirm stays disabled. |
| Error, confirm | The rows stay. Above the button: "We couldn't set this up. Nothing has been saved, so it's safe to try again." Button label returns to "Confirm and set up". If the route returned an opportunity id before failing (partial), show instead: "Your case is saved, but the work list didn't finish. We'll complete it automatically within the hour." with primary "Open the case". |
| No permission to create opportunities | "You don't have access to create cases. Ask the ED to give you access." Only the fallback link remains. |
| Timeout (20 s, section 2 Step 3) | "Your case is saved. The work list is still being prepared and will appear on the case in a minute." Primary "Open the case", secondary "Done". |

### 4.6 Copy, English

| Key | EN |
| --- | --- |
| intake.title | New request |
| intake.fallback | Create it the usual way |
| intake.text.placeholder | Paste the email or describe the request in your own words. |
| intake.text.hint | Describe the request. Don't paste contracts or confidential documents; link to them instead. |
| intake.text.tooLong | This looks like a whole document. Keep the key points and link the full document instead. |
| intake.empty.hint | We'll suggest the right steps and people. Nothing is saved until you confirm. |
| intake.draft.kept | We kept your draft. |
| intake.draft.startOver | Start over |
| intake.company.matched | From: {companyName} (in Twenty) |
| intake.company.notRight | Not right? |
| intake.company.ask | Who is this from? |
| intake.company.optional | Company, if there is one |
| intake.company.add | Add {name} as a new company |
| intake.company.error | We couldn't search companies just now. |
| intake.deadline.found | Client deadline: {date} |
| intake.deadline.change | Change it |
| intake.deadline.ask | When does the client need our answer? |
| intake.deadline.none | They didn't say |
| intake.tiles.heading | What kind of request is this? |
| intake.tiles.suggested | Suggested |
| intake.tiles.change | Change type |
| intake.tile.service | A company needs a test or service |
| intake.tile.service.hint | They want us to do technical work for them, often with a quote. |
| intake.tile.challenge | A company has a problem to solve |
| intake.tile.challenge.hint | They describe a challenge and want our researchers to help. |
| intake.tile.lab | A company wants to use our lab or equipment |
| intake.tile.lab.hint | They want access to a lab, an instrument or a facility. |
| intake.tile.licence | License one of our technologies |
| intake.tile.licence.hint | We have a technology or patent and want a company to take it on. |
| intake.tile.startup | Work with a startup |
| intake.tile.startup.hint | A KUEC startup needs a partner, or a company wants to work with one. |
| intake.tile.event | Run a workshop or event |
| intake.tile.event.hint | An industry workshop, demo day or training. |
| intake.licence.ask | Which technology? Paste its uVENTURE link. |
| intake.licence.later | I'll add it later |
| intake.event.ask | When is the event? |
| intake.plan.heading | Here's the plan |
| intake.plan.owner | You'll own this case. |
| intake.plan.changeLater | You can change people and dates on the case after it's set up. |
| intake.plan.deadlineRisk | At the usual pace, this plan finishes after the client's deadline of {date}. You can still go ahead; the ED will be asked to decide. |
| intake.confirm | Confirm and set up |
| intake.confirm.hint | People on this plan will be told what they need to do. |
| intake.confirm.needTile | Choose the kind of request first. |
| intake.confirm.needCompany | Tell us who this is from. |
| intake.confirm.needWords | Add a few more words about the request. |
| intake.confirm.loading | Loading the plan... |
| intake.done.heading | Your case is set up. |
| intake.done.someoneElse | {firstName} has been asked to start {stepTitle}, due {dueLabel}. |
| intake.done.you | Your first step is {stepTitle}, due {dueLabel}. It's on your Home now. |
| intake.done.slow | Your case is saved. The work list is still being prepared and will appear on the case in a minute. |
| intake.done.open | Open the case |
| intake.done.close | Done |
| intake.error.preview | We couldn't build the plan. Nothing has been saved. |
| intake.error.confirm | We couldn't set this up. Nothing has been saved, so it's safe to try again. |
| intake.error.partial | Your case is saved, but the work list didn't finish. We'll complete it automatically within the hour. |
| intake.error.permission | You don't have access to create cases. Ask the ED to give you access. |

---

## 5. Screen: Work package card

### 5.1 Purpose

Everything one person needs to do one piece of work, and the one or two buttons that move it on. It is the brief, not the database record; the record's fields, tasks, notes and timeline sit under it.

### 5.2 Wireframe (owner's view, status In progress)

```
+------------------------------------------------------------+
| WORK PACKAGE                                Open full record |
| Scoping                                                    |
| (In progress)  Due Thursday  .  Owner Ahmed . Reviewer Sara |
|                                                            |
| Objective                                                  |
| Define the technical work the client needs.                |
|                                                            |
| Context                                                    |
| Part of ADNOC: corrosion testing for pipeline coatings     |
| (Scope), for ADNOC. Step 2 of 7.                           |
| Client deadline: Thu 30 Oct.                               |
| Before this: Bid or no-bid, done by Sara on Tue 14 Oct.    |
| Original request  v                                        |
|                                                            |
| Expected output                                            |
| Scope: tasks, method, equipment, staff time, assumptions,  |
| exclusions.                                                |
|                                                            |
| Done criteria                                              |
| Scope covers every RFQ requirement or lists the            |
| exceptions, effort is estimated in person-days, and the    |
| reviewer has signed off.                                   |
|                                                            |
| [ Submit ]  ( Request help )                               |
+------------------------------------------------------------+
  FIELDS / TASKS / NOTES / TIMELINE widgets follow (native)
```

"WORK PACKAGE" is the 13 px eyebrow label (sentence case in the source string "Work package"; small caps styling only in LTR, plain in RTL). The four sections always appear in this order. Empty sections are hidden, except Done criteria, which shows "No done criteria yet. Ask {reviewer or case owner} what 'done' looks like." because the rule says every work package has done criteria.

### 5.3 Context section

Derived, never typed. Lines, each shown only when the data exists:

1. "Part of {case name} ({stage label}), for {company}." Case name is a link that opens the opportunity or project in the side panel.
2. "Step {n} of {total}." (from `playbookStep` order in the template)
3. "Client deadline: {date}." (opportunity `clientDeadline`)
4. "Before this: {previous title}, done by {first name} on {date}." Link opens that work package. Uses `dependsOnId`.
5. "Original request" disclosure: collapsed by default; expands to the first 12 lines of the opportunity's "Original request" note, with "Show all" opening the note in the side panel.

### 5.4 Buttons by status and viewer

The four actions, Accept, Decline, Request help and Submit, appear only where they make sense. At most two buttons are shown at once.

| Status | Owner sees | Reviewer sees | ED sees (not owner or reviewer) | Anyone else sees |
| --- | --- | --- | --- | --- |
| Not started | "This starts when {previous title} is done." No buttons. | Same | Same | Same |
| Waiting to be accepted | Primary "Accept", secondary "Decline" | "Waiting for {owner} to accept. Offered {n} working days ago." | Same as reviewer | Same as reviewer |
| In progress | Primary "Submit" (label "Mark as done" when there is no reviewer), secondary "Request help" | "In progress with {owner}. {due label}." | Same as reviewer | Same as reviewer |
| Waiting for review | "Sent to {reviewer} for review on {date}." No buttons. | Primary "Approve", secondary "Send back" (bid variant per 3.3) | Same as owner | Same as owner |
| Blocked | "Blocked. The ED has been told: "{reason}"". Secondary "I can continue now" | "Blocked: "{reason}"" | Primary "Back to work", secondary "Give to someone else", secondary "Keep waiting" (hidden after acknowledging) | "Blocked." |
| Done | "Done on {date}. Approved by {reviewer}." | Same | Same | Same |
| Declined | "You declined this on {date}. The ED will give it to someone else." | "Declined by {owner}: "{reason}"" | Primary "Give to {suggested}", secondary "Choose someone else" | "Declined." |
| Stopped | "This work was stopped on {date}." | Same | Same | Same |

"Stop this work" (sets `CANCELLED`) is deliberately not on the card; it is a rare, destructive decision and stays in the native FIELDS widget (Status), where the ED already has it.

### 5.5 Actions

Every action re-reads the record first (section 1.6).

**Accept.** One click, no form, no modal. Writes `status = ACCEPTED`. The app stamps `acceptedAt` (work package transition log), cancels the acceptance timers (W03 reschedules on status change), adds the timeline entry. Toast: "Accepted. It's on your list, due {due label}." The card re-renders as In progress.

**Decline.** Expands in place:

```
| Why can't you take this?                                   |
| +--------------------------------------------------------+ |
| | For example: I'm on leave from 20 Oct.                 | |
| +--------------------------------------------------------+ |
| The ED will see your reason and give it to someone else.   |
| ( Cancel )  [ Decline ]                                    |
```

Reason required (at least 3 words). On "Decline", a confirmation modal: title "Decline this work?", subtitle "The ED will see your reason and give it to someone else.", confirm "Decline", accent `danger`. Writes `status = DECLINED`, `declinedReason` **[new]**. **[new]** W13 notifies the ED with the reason (same pattern as W05). Toast: "Declined. The ED has your reason."

**Request help.** Expands in place:

```
| What do you need?                                          |
| +--------------------------------------------------------+ |
| | For example: Which spectrometer can we book in Nov?    | |
| +--------------------------------------------------------+ |
| Can you keep working while you wait?                       |
| (o) Yes, I can keep going                                  |
| ( ) No, I'm stuck                                          |
| We'll ask Sara.                                            |
| ( Cancel )  [ Ask for help ]                               |
```

- The helper is the reviewer; if there is none or it is you, the case owner; if that is also you, the ED. The line "We'll ask {first name}." names them so nothing is a mystery.
- "Yes, I can keep going" (default, the safer and more common case): button "Ask for help". Calls `POST /kuec/work-packages/{id}/help` **[new]**, which creates a Task "Help needed: {title}" assigned to the helper, due the next working day, linked to the work package, with the question as its body; adds a Note to the work package with the question; notifies the helper (Teams). Status stays In progress; the due date is unchanged. Toast: "Sent to {first name}. They'll see it on their Home."
- "No, I'm stuck": button changes to "Mark as blocked". Confirmation modal: title "Mark this as blocked?", subtitle "The ED will be told right away, with your reason. Your due date stays the same.", confirm "Mark as blocked", accent `danger`. Writes `status = BLOCKED`, `blockedReason` = the text. **W05** notifies the ED with the reason. Toast: "Marked as blocked. The ED has been told."

This turns "Blocked" from a status a new employee has to choose into a plain question they can answer.

**Submit.** Expands in place:

```
| Link to your work                                          |
| +--------------------------------------------------------+ |
| | https://kuec.sharepoint.com/...                        | |
| +--------------------------------------------------------+ |
| Paste the SharePoint link, if there is one.                |
|                                                            |
| Note for Sara (optional)                                   |
| +--------------------------------------------------------+ |
| |                                                        | |
| +--------------------------------------------------------+ |
|                                                            |
| [step-specific question, if any, see 5.6]                  |
|                                                            |
| [x] This meets the done criteria above.                    |
| ( Cancel )  [ Submit for review ]                          |
```

- Link: optional, validated as an `https://` URL. Below the field when the link is not on `sharepoint.com` or uVENTURE: "Only links, never files. Make sure this link doesn't expose a confidential document." (soft warning, does not block). Never offer file upload: `kuec/CLAUDE.md` forbids storing documents in Twenty.
- Checkbox required; the button stays disabled with the hint "Tick the box once the done criteria are met." until it is ticked.
- Writes `outputLink` **[new]**, the step outcome if any, `status = SUBMITTED`; the note becomes a Note on the work package titled "Submitted: note for {reviewer}". The app stamps `submittedAt`; the reviewer is notified ("Submitted for your review"). Toast: "Sent to {reviewer} for review."
- No reviewer (for example the ED's Internal approval step): the button reads "Mark as done" and writes `status = DONE` directly. **W06** releases the next step. Toast: "Done. {next owner} has been asked to start {next title}." or "Done. That was the last step." when there is none.

**Approve (reviewer).** One click. Writes `status = DONE`. The app stamps `completedAt`; **W06** offers the next step to its owner; **[new] W12** moves the stage if the next step starts a new stage; for outcome steps, the outcome is applied (5.6). Toast: "Approved. {next owner} has been asked to start {next title}."

**Send back (reviewer).** Expands: "What needs to change?" (required). Writes `status = ACCEPTED` and a Note "Sent back: {first line}". The owner is notified (**[new]** in W13: "Sent back to you with changes"). Toast: "Sent back to {owner} with your note."

**I can continue now (owner, blocked).** One click. Writes `status = ACCEPTED`; the block reason stays in history. Toast: "Back in progress. The ED can see it's moving again."

**Back to work, Give to someone else, Keep waiting (ED).** "Back to work" writes `status = ACCEPTED` and a Note "Unblocked by the ED". "Give to someone else" opens the person picker (suggested person preselected, each person shown with their open count) then writes `ownerId` and `status = OFFERED`, which restarts W02 for the new owner. "Keep waiting" writes `blockAcknowledgedAt = now` **[new]**; the item leaves the ED's Home but stays on Exceptions. Toasts in section 7.

### 5.6 Step-specific questions

Some steps decide the case's outcome. The Submit form adds one required question for them; nothing else differs. Values go to `outcome` **[new SELECT]**.

| Playbook step | Question | Choices | Applied on approval |
| --- | --- | --- | --- |
| `RFQ_TECHNICAL_SERVICE.BID_NO_BID`, `INDUSTRY_CHALLENGE.QUALIFY` | What do you recommend? | Bid / Don't bid | Bid: nothing extra. Don't bid: opportunity `stage = LOST`, `lostReason` = the submitter's note (required when "Don't bid" is chosen). |
| `RFQ_TECHNICAL_SERVICE.FOLLOW_UP`, `INDUSTRY_CHALLENGE.FOLLOW_UP` | What did the client decide? | They said yes / They said no / No answer yet | Yes: `stage = SIGNED` (W07 runs). No: `stage = LOST`, `lostReason` = note. No answer yet: `stage = PARKED`. |
| `TECHNOLOGY_LICENSING.LICENCE_SIGNED`, `STARTUP_PARTNERING.AGREE_TERMS` | Was it signed? | Yes, signed / No, it fell through | Yes: `stage = SIGNED`. No: `stage = LOST`, `lostReason` = note. |

### 5.7 States

| State | What shows |
| --- | --- |
| Loading | Eyebrow and fallback link render immediately. Skeleton: one 20 px bar (title), one badge-shaped bar, then four section headings as real text, each with two body bars. Buttons area: two button-shaped blocks at 6% opacity. |
| Empty sections | Objective, Expected output, Context hidden when empty. Done criteria shows its prompt (5.2). |
| Record not found (deleted or no access) | "This work package isn't available. It may have been removed, or you may not have access." Fallback link only. |
| Error, load | "We couldn't load this work package. Your data is safe." Secondary "Try again", secondary "Open full record". On the full record page the second button reads "Show all fields". |
| Error, write | Form stays open with the person's text intact. Toast error (section 7). |
| Conflict | Toast "Someone changed this a moment ago. We've loaded the latest version." Card re-renders; any open form closes, but its typed text is kept in memory and restored if the same form is reopened within the session. |

### 5.8 Copy, English (Work package card)

| Key | EN |
| --- | --- |
| card.eyebrow | Work package |
| card.fallback | Open full record |
| card.fallback.onPage | Show all fields |
| card.owner | Owner {firstName} |
| card.reviewer | Reviewer {firstName} |
| card.section.objective | Objective |
| card.section.context | Context |
| card.section.output | Expected output |
| card.section.done | Done criteria |
| card.done.missing | No done criteria yet. Ask {firstName} what "done" looks like. |
| card.context.partOf | Part of {caseName} ({stage}), for {company}. |
| card.context.partOfNoCompany | Part of {caseName} ({stage}). |
| card.context.step | Step {n} of {total}. |
| card.context.deadline | Client deadline: {date}. |
| card.context.before | Before this: {title}, done by {firstName} on {date}. |
| card.context.original | Original request |
| card.context.showAll | Show all |
| card.status.planned | Not started |
| card.status.offered | Waiting to be accepted |
| card.status.accepted | In progress |
| card.status.submitted | Waiting for review |
| card.status.blocked | Blocked |
| card.status.done | Done |
| card.status.declined | Declined |
| card.status.cancelled | Stopped |
| card.info.planned | This starts when {title} is done. |
| card.info.waitingAccept | Waiting for {firstName} to accept. Offered {days, plural, =0 {today} one {# working day ago} other {# working days ago}}. |
| card.info.inProgress | In progress with {firstName}. {dueLabel}. |
| card.info.sentForReview | Sent to {firstName} for review on {date}. |
| card.info.blockedOwner | Blocked. The ED has been told: "{reason}" |
| card.info.blockedOther | Blocked: "{reason}" |
| card.info.done | Done on {date}. Approved by {firstName}. |
| card.info.doneNoReviewer | Done on {date}. |
| card.info.declinedOwner | You declined this on {date}. The ED will give it to someone else. |
| card.info.declinedOther | Declined by {firstName}: "{reason}" |
| card.info.stopped | This work was stopped on {date}. |
| card.button.accept | Accept |
| card.button.decline | Decline |
| card.button.requestHelp | Request help |
| card.button.submit | Submit |
| card.button.markDone | Mark as done |
| card.button.approve | Approve |
| card.button.sendBack | Send back |
| card.button.continue | I can continue now |
| card.decline.label | Why can't you take this? |
| card.decline.placeholder | For example: I'm on leave from 20 Oct. |
| card.decline.hint | The ED will see your reason and give it to someone else. |
| card.decline.confirm | Decline |
| card.help.label | What do you need? |
| card.help.placeholder | For example: Which spectrometer can we book in November? |
| card.help.question | Can you keep working while you wait? |
| card.help.yes | Yes, I can keep going |
| card.help.no | No, I'm stuck |
| card.help.who | We'll ask {firstName}. |
| card.help.send | Ask for help |
| card.help.block | Mark as blocked |
| card.submit.link | Link to your work |
| card.submit.linkHint | Paste the SharePoint link, if there is one. |
| card.submit.linkWarning | Only links, never files. Make sure this link doesn't expose a confidential document. |
| card.submit.linkInvalid | This doesn't look like a web link. It should start with https:// |
| card.submit.note | Note for {firstName} (optional) |
| card.submit.criteria | This meets the done criteria above. |
| card.submit.criteriaHint | Tick the box once the done criteria are met. |
| card.submit.send | Submit for review |
| card.submit.recommend | What do you recommend? |
| card.submit.recommend.bid | Bid |
| card.submit.recommend.noBid | Don't bid |
| card.submit.noBidReason | Say why in the note. The ED will see it. |
| card.submit.clientDecision | What did the client decide? |
| card.submit.clientYes | They said yes |
| card.submit.clientNo | They said no |
| card.submit.clientNoAnswer | No answer yet |
| card.submit.signed | Was it signed? |
| card.submit.signedYes | Yes, signed |
| card.submit.signedNo | No, it fell through |
| card.sendBack.label | What needs to change? |
| card.sendBack.placeholder | Be specific, so they can fix it in one go. |
| card.error.load | We couldn't load this work package. Your data is safe. |
| card.error.missing | This work package isn't available. It may have been removed, or you may not have access. |
| button.cancel | Cancel |
| button.tryAgain | Try again |

### 5.9 Copy, Arabic (Work package card)

| Key | AR |
| --- | --- |
| card.eyebrow | حزمة عمل |
| card.fallback | فتح السجل كاملاً |
| card.fallback.onPage | عرض كل الحقول |
| card.owner | المسؤول {firstName} |
| card.reviewer | المراجِع {firstName} |
| card.section.objective | الهدف |
| card.section.context | السياق |
| card.section.output | المُخرَج المتوقَّع |
| card.section.done | معايير الإنجاز |
| card.done.missing | لا توجد معايير إنجاز بعد. اسأل {firstName} عمّا يُعدّ إنجازاً لهذا العمل. |
| card.context.partOf | ضمن {caseName} ({stage})، لصالح {company}. |
| card.context.partOfNoCompany | ضمن {caseName} ({stage}). |
| card.context.step | الخطوة {n} من {total}. |
| card.context.deadline | موعد العميل النهائي: {date}. |
| card.context.before | الخطوة السابقة: {title}، أنجزها {firstName} في {date}. |
| card.context.original | الطلب الأصلي |
| card.context.showAll | عرض الكل |
| card.status.planned | لم تبدأ بعد |
| card.status.offered | بانتظار القبول |
| card.status.accepted | قيد التنفيذ |
| card.status.submitted | بانتظار المراجعة |
| card.status.blocked | متوقفة |
| card.status.done | منجزة |
| card.status.declined | مرفوضة |
| card.status.cancelled | أُوقفت |
| card.info.planned | تبدأ عند إنجاز {title}. |
| card.info.waitingAccept | بانتظار قبول {firstName}. {days, plural, =0 {عُرضت اليوم} one {عُرضت قبل يوم عمل واحد} two {عُرضت قبل يومَي عمل} few {عُرضت قبل # أيام عمل} many {عُرضت قبل # يوم عمل} other {عُرضت قبل # يوم عمل}}. |
| card.info.inProgress | قيد التنفيذ لدى {firstName}. {dueLabel}. |
| card.info.sentForReview | أُرسلت إلى {firstName} للمراجعة في {date}. |
| card.info.blockedOwner | متوقفة. أُبلغ المدير التنفيذي بالسبب: «{reason}» |
| card.info.blockedOther | متوقفة: «{reason}» |
| card.info.done | أُنجزت في {date}. اعتمدها {firstName}. |
| card.info.doneNoReviewer | أُنجزت في {date}. |
| card.info.declinedOwner | رفضت هذا العمل في {date}. سيُسنده المدير التنفيذي إلى شخص آخر. |
| card.info.declinedOther | رفضها {firstName}: «{reason}» |
| card.info.stopped | أُوقف هذا العمل في {date}. |
| card.button.accept | قبول |
| card.button.decline | رفض |
| card.button.requestHelp | طلب مساعدة |
| card.button.submit | تسليم |
| card.button.markDone | تحديد كمنجزة |
| card.button.approve | اعتماد |
| card.button.sendBack | إعادة للتعديل |
| card.button.continue | يمكنني المتابعة الآن |
| card.decline.label | لماذا لا يمكنك تولّي هذا العمل؟ |
| card.decline.placeholder | مثال: سأكون في إجازة اعتباراً من 20 أكتوبر. |
| card.decline.hint | سيطّلع المدير التنفيذي على السبب ويُسند العمل إلى شخص آخر. |
| card.decline.confirm | رفض |
| card.help.label | ما الذي تحتاج إليه؟ |
| card.help.placeholder | مثال: أيّ جهاز مطياف يمكننا حجزه في نوفمبر؟ |
| card.help.question | هل يمكنك مواصلة العمل أثناء الانتظار؟ |
| card.help.yes | نعم، يمكنني المواصلة |
| card.help.no | لا، العمل متوقف |
| card.help.who | سنسأل {firstName}. |
| card.help.send | إرسال طلب المساعدة |
| card.help.block | تحديد كمتوقفة |
| card.submit.link | رابط العمل |
| card.submit.linkHint | الصق رابط SharePoint إن وُجد. |
| card.submit.linkWarning | روابط فقط، دون ملفات. تأكّد من أن الرابط لا يكشف وثيقة سرّية. |
| card.submit.linkInvalid | لا يبدو هذا رابطاً صحيحاً. يجب أن يبدأ بـ https:// |
| card.submit.note | ملاحظة إلى {firstName} (اختياري) |
| card.submit.criteria | هذا العمل يستوفي معايير الإنجاز أعلاه. |
| card.submit.criteriaHint | ضع علامة في المربع عند استيفاء معايير الإنجاز. |
| card.submit.send | تسليم للمراجعة |
| card.submit.recommend | ما توصيتك؟ |
| card.submit.recommend.bid | التقدّم بعرض |
| card.submit.recommend.noBid | عدم التقدّم بعرض |
| card.submit.noBidReason | اذكر السبب في الملاحظة. سيطّلع عليه المدير التنفيذي. |
| card.submit.clientDecision | ماذا قرّر العميل؟ |
| card.submit.clientYes | وافق |
| card.submit.clientNo | رفض |
| card.submit.clientNoAnswer | لم يردّ بعد |
| card.submit.signed | هل تمّ التوقيع؟ |
| card.submit.signedYes | نعم، تمّ التوقيع |
| card.submit.signedNo | لا، لم يتمّ |
| card.sendBack.label | ما الذي يجب تغييره؟ |
| card.sendBack.placeholder | كن محدداً ليتمكّن من التعديل دفعة واحدة. |
| card.error.load | تعذّر تحميل حزمة العمل هذه. بياناتك سليمة. |
| card.error.missing | حزمة العمل هذه غير متاحة. ربما حُذفت، أو ليست لديك صلاحية الوصول إليها. |
| button.cancel | إلغاء |
| button.tryAgain | إعادة المحاولة |

Arabic toasts for card actions:

| Key | AR |
| --- | --- |
| toast.accepted | تمّ القبول. أُضيفت إلى قائمتك، {dueLabel}. |
| toast.declined | تمّ الرفض. وصل السبب إلى المدير التنفيذي. |
| toast.helpSent | أُرسل الطلب إلى {firstName}. سيظهر في صفحته الرئيسية. |
| toast.blocked | حُدّدت كمتوقفة. أُبلغ المدير التنفيذي. |
| toast.submitted | أُرسلت إلى {firstName} للمراجعة. |
| toast.doneNext | أُنجزت. طُلب من {firstName} بدء {title}. |
| toast.doneLast | أُنجزت. كانت هذه الخطوة الأخيرة. |
| toast.approved | اعتُمدت. طُلب من {firstName} بدء {title}. |
| toast.sentBack | أُعيدت إلى {firstName} مع ملاحظتك. |
| toast.continue | عادت قيد التنفيذ. يرى المدير التنفيذي أن العمل استُؤنف. |
| toast.conflict | غيّر أحدهم هذا السجل قبل لحظات. حمّلنا أحدث نسخة. |
| toast.saveFailed | لم يُحفظ ذلك، ولم يتغيّر شيء. أعد المحاولة. |
| modal.decline.title | رفض هذا العمل؟ |
| modal.decline.subtitle | سيطّلع المدير التنفيذي على السبب ويُسند العمل إلى شخص آخر. |
| modal.block.title | تحديد هذا العمل كمتوقف؟ |
| modal.block.subtitle | سيُبلَّغ المدير التنفيذي فوراً مع السبب. يبقى موعد التسليم كما هو. |
| modal.block.confirm | تحديد كمتوقفة |

---

## 6. Screen: Manager exceptions

### 6.1 Purpose

The ED's only list. Three kinds of exception and nothing else: blocked work, late work, open cases without a next step. If the list is empty, the operating rules are holding and there is nothing to chase.

Scope: the ED and the ops coordinator (both identified from playbook role assignments, never by id) see the whole team. Everyone else sees the same page limited to their own items, with the subtitle "Your blocked and late work, and your cases without a next step."

### 6.2 Wireframe

```
+--------------------------------------------------------------------------+
|                                                                          |
|   Exceptions                                                             |
|   2 blocked, 3 late, 1 without a next step.                              |
|                                                                          |
|                                                                          |
|   Blocked  2                                              Open as list   |
|   ------------------------------------------------------------------     |
|   * Scoping . Ahmed                                  Blocked since Mon   |
|     ADNOC: corrosion testing for pipeline coatings                       |
|     "Waiting for the client to send the coating spec sheet."             |
|     Client deadline Thu 30 Oct                                           |
|     [ Back to work ]  ( Give to someone else )  ( Keep waiting )         |
|   ------------------------------------------------------------------     |
|   * Partner shortlist . Layla                Blocked since Thu 9 Oct     |
|     Licence: low-cost desalination membrane         Seen by you          |
|     "uVENTURE record for the patent family is not published yet."       |
|     [ Back to work ]  ( Give to someone else )                           |
|                                                                          |
|                                                                          |
|   Late  3                                                 Open as list   |
|   ------------------------------------------------------------------     |
|   * Bid or no-bid . Sara                          Late since Tue 14 Oct  |
|     EGA: dust emission analysis                        In progress       |
|     Last activity: accepted on Mon 13 Oct                                |
|     ( New due date )  ( Give to someone else )                           |
|   ------------------------------------------------------------------     |
|   ...                                                                    |
|                                                                          |
|                                                                          |
|   No next step  1                                         Open as list   |
|   ------------------------------------------------------------------     |
|   * Mubadala: lab access for composites . Omar        Negotiate          |
|     Next step was due Wed 8 Oct: "Send revised quote"                    |
|     ( Set the next step )  ( Ask Omar )                                  |
|                                                                          |
|                                                                          |
|   Updated just now . Refresh                                             |
+--------------------------------------------------------------------------+
```

### 6.3 Content rules

Each item appears in exactly one section, first match wins: Blocked, then Late, then No next step. Sections with no items are not rendered. Within a section, oldest first (longest blocked, longest late, longest without a next step). No cap; this list should be short, and if it is long that is the information.

| Section | Query | Evidence | Buttons |
| --- | --- | --- | --- |
| Blocked | Work package `status = BLOCKED` | Title, owner, case, reason in quotes, "Blocked since {date}", client deadline, "Seen by you" if `blockAcknowledgedAt >= blockedAt` | Primary "Back to work". Secondary "Give to someone else". Secondary "Keep waiting" (only if not yet seen). Same writes as 5.5. |
| Late | Work package `status in (OFFERED, ACCEPTED, SUBMITTED)` and `dueAt` before the start of today in Asia/Dubai (`BLOCKED` is already in the first section) | Title, owner, case, status badge, "Late since {date}", "Last activity: {latest timeline entry} on {date}" | Secondary "New due date" (expands a date picker, default 3 working days from today, and a required "Why is it moving?" field; writes `dueAt` and a Note "Due date moved: {reason}"; W03 reschedules the timers). Secondary "Give to someone else". For `SUBMITTED` items the owner is replaced by "with {reviewer} for review" and the buttons become secondary "Remind {reviewer}" (creates a Task for the reviewer due today) only. |
| No next step | Opportunity, stage not Signed, Lost or Parked, where `needsNextActionFlag` (existing rule in `next-action-guard.rule.ts`) is true, ignoring the `nextActionFlaggedOn` guard | Opportunity name, owner, stage label, either "No next step set" or "Next step was due {date}: "{nextAction}"" | Secondary "Set the next step" (same inline form as Home, writes `nextAction` and `nextActionDate`). Secondary "Ask {owner}" (creates a Task "Set a next step: {opportunity}" for the owner, due today; W04 may already have created one, in which case the button reads "Asked" and is disabled). Opportunities with no owner show "No owner" and the button "Choose an owner" (person picker) instead. |

The page uses the same pure rules as the automation (`needsNextActionFlag`, the due-timer status list `STATUSES_WITH_DUE_TIMER`, the business-day calendar), imported from the app, so the screen and the escalations can never disagree.

### 6.4 States

| State | What shows |
| --- | --- |
| Loading | Title renders. Subtitle as a 40% skeleton bar. Three section headings as real text with skeleton rows (last-known counts, default 2). |
| Empty | Title "Exceptions". Subtitle: "Nothing to chase." Body, centred, 15 px: "No exceptions. Every case has an owner, a next step and a date, and nothing is blocked or late." Under it, 13 px: "Updated {relativeTime}. Refresh". The fallback link stays: "Open the BD dashboard". |
| Error, one section | That section: "We couldn't load this part. Your data is safe." Secondary "Try again", secondary "Open as list". |
| Error, whole page | "We couldn't load the exceptions. You can see the same lists in Twenty." Primary "Try again", secondary "Open Blocked list". |
| Write conflict | Toast, item re-renders or leaves the list. |

### 6.5 Copy, English

| Key | EN |
| --- | --- |
| exceptions.title | Exceptions |
| exceptions.subtitle | {blocked} blocked, {late} late, {noNext} without a next step. (zero parts are omitted: "2 blocked, 1 without a next step.") |
| exceptions.subtitle.own | Your blocked and late work, and your cases without a next step. |
| exceptions.section.blocked | Blocked |
| exceptions.section.late | Late |
| exceptions.section.noNext | No next step |
| exceptions.seen | Seen by you |
| exceptions.lastActivity | Last activity: {activity} on {date} |
| exceptions.withReviewer | with {firstName} for review |
| exceptions.noNextSet | No next step set |
| exceptions.nextWasDue | Next step was due {date}: "{nextAction}" |
| exceptions.noOwner | No owner |
| exceptions.button.newDate | New due date |
| exceptions.button.remind | Remind {firstName} |
| exceptions.button.setNext | Set the next step |
| exceptions.button.ask | Ask {firstName} |
| exceptions.button.asked | Asked |
| exceptions.button.chooseOwner | Choose an owner |
| exceptions.form.newDate | New due date |
| exceptions.form.why | Why is it moving? |
| exceptions.form.whyPlaceholder | For example: Client sent the samples late. |
| exceptions.empty.subtitle | Nothing to chase. |
| exceptions.empty.body | No exceptions. Every case has an owner, a next step and a date, and nothing is blocked or late. |
| exceptions.empty.fallback | Open the BD dashboard |
| exceptions.error.page | We couldn't load the exceptions. You can see the same lists in Twenty. |
| exceptions.button.openBlocked | Open Blocked list |

---

## 7. Shared messages

### 7.1 Toasts

Success toasts: `variant: 'success'`, 4 s. Errors: `variant: 'error'`, 8 s. Every toast passes a `dedupeKey` of `{action}:{recordId}` so a double click never stacks two.

| Key | EN | When |
| --- | --- | --- |
| toast.accepted | Accepted. It's on your list, due {dueLabel}. | Accept |
| toast.declined | Declined. The ED has your reason. | Decline |
| toast.helpSent | Sent to {firstName}. They'll see it on their Home. | Request help, can keep going |
| toast.blocked | Marked as blocked. The ED has been told. | Request help, stuck |
| toast.submitted | Sent to {firstName} for review. | Submit |
| toast.doneNext | Done. {firstName} has been asked to start {title}. | Mark as done, next step exists |
| toast.doneLast | Done. That was the last step. | Mark as done, no next step |
| toast.approved | Approved. {firstName} has been asked to start {title}. | Approve |
| toast.approvedLast | Approved. That was the last step. | Approve, no next step |
| toast.sentBack | Sent back to {firstName} with your note. | Send back |
| toast.continue | Back in progress. The ED can see it's moving again. | I can continue now |
| toast.backToWork | {firstName} can carry on. We've let them know. | ED: Back to work |
| toast.reassigned | Given to {firstName}. They've been asked to accept it. | ED: Give to someone |
| toast.keepWaiting | Noted. It stays on Exceptions until it moves. | ED: Keep waiting |
| toast.goAhead | Noted. The plan stays as it is. | ED: Go ahead on tight deadline |
| toast.noBid | Marked as Lost: we're not bidding. {firstName} has been told. | Don't bid |
| toast.nextStepSaved | Next step saved for {date}. | Next step form |
| toast.taskDone | Marked done. | Task |
| toast.dueMoved | Due date moved to {date}. {firstName} has been told. | New due date |
| toast.asked | Asked {firstName} to set a next step. | Ask owner |
| toast.reminded | Reminded {firstName} to review it. | Remind reviewer |
| toast.caseCreated | Case set up: {opportunityName}. | Intake |
| toast.conflict | Someone changed this a moment ago. We've loaded the latest version. Check it and try again. | Precondition failed (`variant: 'warning'`) |
| toast.saveFailed | That didn't save. Nothing was changed. Try again. | Any write error |
| toast.noPermission | You don't have access to do that. Ask the ED if you need it. | 403 |
| toast.offline | You're offline. Try again when you're connected. | Network down on write |

### 7.2 Confirmation modals

Only for actions that tell other people something they cannot un-hear or that end someone's work.

| Action | Title | Subtitle | Confirm | Accent |
| --- | --- | --- | --- | --- |
| Decline | Decline this work? | The ED will see your reason and give it to someone else. | Decline | danger |
| Mark as blocked | Mark this as blocked? | The ED will be told right away, with your reason. Your due date stays the same. | Mark as blocked | danger |
| Don't bid | Close this case as Lost? | We'll record your reason and tell {owner}. You can reopen it from the case later. | Close as Lost | danger |
| Give to someone else | Give this to {firstName}? | {firstName} will be asked to accept it. {current owner} will no longer own it. | Give to {firstName} | blue |

The cancel button is the modal's default "Cancel". No other action uses a modal; Accept, Approve, Submit and Save are reversible through the card or the native record.

### 7.3 Notification copy

Teams and email messages already exist in `notification-messages.ts` and are reused unchanged, with three additions **[new]**:

| Key | Lead |
| --- | --- |
| declined | Declined, please reassign: {subject}. Reason: {reason}. |
| sentBack | Sent back to you with changes: {subject}. |
| helpRequested | {name} needs help on: {subject}. Question: {question}. |
| deadlineRisk | Tight deadline, decision needed: {subject}. The plan finishes around {estimate}; the client's deadline is {deadline}. |

---

## 8. Build list

Everything below is additive. New UUIDs are generated once with `uuidgen`; nothing existing is renamed or removed (`kuec/CLAUDE.md`, non-negotiable 2). Run `plan` before apply.

### 8.1 Fields [new]

| Object | Field `name` | Type | Label | Writability | Notes |
| --- | --- | --- | --- | --- | --- |
| workPackage | `declinedReason` | TEXT | Declined reason | user | Required by the card when declining |
| workPackage | `outputLink` | LINKS | SharePoint link | user | Label by destination, per data-class rule |
| workPackage | `outcome` | SELECT | Outcome | user | Options `BID`, `NO_BID`, `CLIENT_YES`, `CLIENT_NO`, `NO_ANSWER`, `SIGNED`, `NOT_SIGNED`; nullable |
| workPackage | `blockAcknowledgedAt` | DATE_TIME | Block seen by ED at | user; field permission lets only the ED role write it | `isAuditLogged: false` |
| opportunity | `intakeRequestId` | TEXT | Intake request id | application | Idempotency for Intake confirm |
| opportunity | `deadlineRiskFlaggedAt` | DATE_TIME | Deadline risk flagged at | application |  |
| opportunity | `deadlineRiskAcknowledgedAt` | DATE_TIME | Deadline risk accepted at | user; field permission lets only the ED role write it |  |
| opportunity | `playbookType` options | SELECT options | Industry challenge, Startup partnering | n/a | Values `INDUSTRY_CHALLENGE`, `STARTUP_PARTNERING` |

`blockAcknowledgedAt` and `deadlineRiskAcknowledgedAt` are written by the ED from a front component with the ED's own permissions, hence `user` writability guarded by field-level role permissions (row-level permissions are not available on this plan).

### 8.2 Front components, page layouts, navigation, command menu [new]

| File | Entity |
| --- | --- |
| `src/front-components/home.front-component.tsx` | Home |
| `src/front-components/intake.front-component.tsx` | Intake |
| `src/front-components/work-package-card.front-component.tsx` | Card; `widgetAvailability: { pageLayoutType: RECORD_PAGE, objectUniversalIdentifiers: [WORK_PACKAGE_UNIVERSAL_IDENTIFIER] }` |
| `src/front-components/exceptions.front-component.tsx` | Exceptions |
| `src/page-layouts/today.page-layout.ts` | `STANDALONE_PAGE`, name "Today" |
| `src/page-layouts/exceptions.page-layout.ts` | `STANDALONE_PAGE`, name "Exceptions" |
| `src/page-layouts/work-package.page-layout.ts` | `RECORD_PAGE` for work package: card, FIELDS, TASKS, NOTES, TIMELINE |
| `src/page-layout-tabs/today-home.page-layout-tab.ts`, `exceptions.page-layout-tab.ts` | One tab each, one FRONT_COMPONENT widget spanning the grid |
| `src/navigation-menu-items/today.navigation-menu-item.ts`, `exceptions.navigation-menu-item.ts` | Positions 0 and 1, above BD |
| `src/command-menu-items/new-request.command-menu-item.ts` | Label "New request", `availabilityType: GLOBAL`, `isPinned: true`, opens the Intake front component |

Shared front-component modules (not entities): `src/front-components/shared/` for the due-label formatter, status vocabulary, skeleton, fallback link, inline form, and the Lingui catalogs (`en`, `ar-SA`). Strings use `msg`/`t` from `twenty-sdk/front-component`.

### 8.3 Logic functions [new]

| Name | Trigger | Does |
| --- | --- | --- |
| `intake-preview` | HTTP route `POST /kuec/intake/preview`, `isAuthRequired: true` | Section 2 Step 2. Read-only. Returns rows `{ key, title, ownerFirstName, ownerAvatarUrl, dueAt or estimateAt }`, `caseOwner`, `deadlineRisk`, `estimatedEnd`. |
| `intake-confirm` | HTTP route `POST /kuec/intake/confirm`, `isAuthRequired: true` | Section 2 Step 3. Idempotent on `intakeRequestId`. Returns `{ opportunityId or projectId }`. Tile 6 creates a project and sets its `playbookType`, which fires W09. |
| `work-package-help` | HTTP route `POST /kuec/work-packages/:id/help`, `isAuthRequired: true` | Section 5.5 Request help, can keep going. Idempotent per work package per Asia/Dubai day (`createTaskOnce`). |
| `w12-stage-follows-step` | `workPackage.updated`, `updatedFields: ['status']`, gated on new status `OFFERED`; plus the hourly sweep | Moves the opportunity stage forward per section 9.2. Never backward, never from or to Signed, Lost, Parked. Shares one pure rule between handler and sweep. |
| `w13-work-package-declined-and-sent-back` | `workPackage.updated`, `updatedFields: ['status']` | On `DECLINED`: notify the ED with `declinedReason`. On `SUBMITTED` to `ACCEPTED`: notify the owner "Sent back". Idempotent per transition. |
| `w14-apply-outcome` | `workPackage.updated`, `updatedFields: ['status']`, gated on `DONE` with `outcome` set | Applies section 5.6 to the opportunity. Notifies the ED of Signed or Lost (W07 already handles Signed side effects). |
| deadline-risk notify | Inside `intake-confirm` | Sends `deadlineRisk` to the ED with `postToTeamsOnce`. |

All new automation follows the app rules: Asia/Dubai working days, pure rules tested with a fixed clock, event fast path plus sweep, and nothing reacts to `*.created`.

### 8.4 Playbook data [new]

Add `INDUSTRY_CHALLENGE` and `STARTUP_PARTNERING` to `kuec/playbooks/templates.json` (section 9.1), then run `sync-playbooks.mjs` and `render-playbooks.ts`. The ED signs off the step wording before go-live; it is business content, not code.

### 8.5 Settings UI (click-runbooks to write)

| Runbook | Change |
| --- | --- |
| `config/dashboards/opportunity-stage-labels.md` | Relabel stage options: New to "Qualify", Screening to "Scope", Meeting to "Propose", Proposal to "Negotiate", Customer to "Customer (deprecated)". API values unchanged. Then set `isVisible: false` on the `CUSTOMER` group in `pipeline.view.ts` and `licence-pipeline.view.ts` (manifest change, not a deletion). |
| `config/dashboards/default-home.md` | Set "Today" as the first sidebar item for every member, if per-member landing cannot be set from the manifest. |

### 8.6 Acceptance checks

1. A first-week BD officer, given a pasted RFQ email and no instructions, creates a case with the correct playbook in under 60 seconds and three clicks after pasting (tile, Confirm, Done).
2. After Confirm, every work package has an owner, the first has a due date and status Waiting to be accepted, the opportunity has a next step and date, and the step-1 owner has a Teams message.
3. With the network throttled to "Slow 3G", no screen shows a spinner, and every block shows a skeleton shaped like its content.
4. With the app's front components disabled (simulate by blocking the iframe), every link target in section 1.7 still opens the same data in native Twenty.
5. With locale `ar-SA`, Home and the card render right to left with no overlapping or clipped text, dates in Arabic month names with Western digits.
6. Blocked, late and no-next-step items on Exceptions match the escalations sent by W03, W04 and W05 for the same clock, item for item.
7. Clicking any button twice quickly produces one write and one toast.

---

## 9. Appendix

### 9.1 New playbooks (proposed content for ED sign-off)

Standard escalation applies to every step. Offsets are working days; later steps count from the previous step's completion, as in the existing playbooks. Steps with a client deadline use the same cap as RFQ ("no later than 2 working days before the client deadline").

**`INDUSTRY_CHALLENGE`: Industry challenge (Pull).** Case owner role: BD officer. Case type: opportunity. Anchor: `CLIENT_DEADLINE` (optional).

| # | Key | Title | Objective | Expected output | Done criteria | Owner | Reviewer | Days |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `QUALIFY` | Qualify the challenge | Decide whether we can and should respond. | Recommendation against fit with KUEC research strengths, a named likely researcher, the client's budget signal and timeline. | All four points covered and the ED's decision recorded; a no-bid closes the case as Lost with the reason. | BD officer | ED | 3 |
| 2 | `MATCH_EXPERTISE` | Match researchers and labs | Find the people and facilities who can solve it. | Named researcher who has agreed to a first call, and the labs or equipment needed. | Researcher confirmed in writing and recorded on the case. | BD officer, with Researcher | ED | 5 |
| 3 | `SCOPING` | Scoping | Define the work, with the researcher. | Scope: problem statement, approach, milestones, staff time, equipment, assumptions, exclusions. | Researcher and reviewer have both agreed the scope. | Developer | BD officer | 5 |
| 4 | `PROPOSAL` | Proposal | Price the work and write the response. | Proposal on SharePoint, linked from the work package. | Price built from the scope with finance input, and finance has reviewed it. | BD officer | Finance | 5 |
| 5 | `INTERNAL_APPROVAL` | Internal approval | Approve the proposal for sending. | ED approval recorded. | Approval recorded, or sent back with reasons. | ED | None | 2 |
| 6 | `SUBMISSION` | Submission | Send the proposal to the client. | Sent confirmation linked from the work package. | Sent before the client deadline and confirmation linked. | BD officer | Ops coordinator | 1 |
| 7 | `FOLLOW_UP` | Follow-up | Get the client's decision. | Client decision logged. | Decision logged, or three unanswered follow-ups and the case Parked. | BD officer | ED | 5 |

**`STARTUP_PARTNERING`: Startup partnering (Push).** Case owner role: BD officer. Case type: opportunity. No anchor.

| # | Key | Title | Objective | Expected output | Done criteria | Owner | Reviewer | Days |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `QUALIFY` | Qualify the fit | Check that the startup and the company want the same thing. | One-paragraph fit note: what each side gets, and the deal type (pilot, investment, supply, licence). | Both sides' goals stated and the ED agrees it is worth an introduction. | BD officer | ED | 3 |
| 2 | `INTRODUCTION` | Introduction | Bring the two sides together. | Introduction meeting held and logged as an engagement. | Meeting logged with attendees and agreed next step. | BD officer | ED | 10 |
| 3 | `AGREE_TERMS` | Agree terms | Get to a signed agreement. | Term sheet or agreement on SharePoint, linked. | Agreement signed, or the deal fell through with the reason. | BD officer | Legal | 15 |
| 4 | `HANDOFF` | Hand-off | Hand the relationship to whoever runs it. | Hand-off note and named owner on both sides. | Both owners confirmed and the case closed. | BD officer | Ops coordinator | 3 |

### 9.2 Stage follows step

When a step is offered (released), the opportunity moves to that step's stage if it is later than the current one.

| Playbook | Qualify | Scope | Propose | Negotiate |
| --- | --- | --- | --- | --- |
| RFQ / technical service | `BID_NO_BID` | `SCOPING` | `QUOTE_OR_PROPOSAL`, `INTERNAL_APPROVAL`, `SUBMISSION` | `FOLLOW_UP` |
| Industry challenge | `QUALIFY`, `MATCH_EXPERTISE` | `SCOPING` | `PROPOSAL`, `INTERNAL_APPROVAL`, `SUBMISSION` | `FOLLOW_UP` |
| Technology licensing | `TECHNICAL_ASSESSMENT` | `COMMERCIAL_ROUTE_SCOPING`, `PARTNER_SHORTLIST` | `OUTREACH` | `TERM_SHEET`, `LICENCE_SIGNED` |
| Startup partnering | `QUALIFY` | `INTRODUCTION` | `AGREE_TERMS` (on offer) | none |

Signed, Lost and Parked are set only by the outcome questions (5.6), "Don't bid", the RFQ Parked rule, or a person on the native record. `DELIVERY_HANDOFF` runs after Signed and does not move the stage.

### 9.3 Tile suggestion keywords

Case-insensitive whole-word matches on the description; each hit adds 1 to its tile. The highest score above zero is suggested; a tie suggests nothing. English and Arabic keywords both count because requests arrive in either language.

| Tile | Keywords |
| --- | --- |
| 1 Test or service | test, testing, analysis, analyse, analyze, characterisation, characterization, measurement, quotation, quote, RFQ, RFP, tender, service, consultancy, اختبار, تحليل, عرض سعر, مناقصة, خدمة |
| 2 Problem to solve | challenge, problem, issue, solution, improve, reduce, optimise, optimize, research, collaboration, تحدي, مشكلة, حل, بحث, تعاون |
| 3 Lab or equipment | lab, laboratory, equipment, instrument, facility, machine, access, booking, SEM, XRD, TEM, NMR, cleanroom, مختبر, جهاز, معدات, حجز |
| 4 Licence | license, licence, licensing, patent, IP, technology transfer, invention, ترخيص, براءة, ملكية فكرية |
| 5 Startup | startup, start-up, spin-off, spinout, founder, venture, incubator, شركة ناشئة, رائد أعمال |
| 6 Workshop or event | workshop, event, seminar, training, demo day, conference, exhibition, ورشة, فعالية, تدريب, مؤتمر |

The table lives in `src/front-components/shared/tile-keywords.ts` so it can be tuned without touching the component.
