# KUEC BD operation: service blueprint

The whole operation, journey by journey, on the surfaces the Phase B brief allows. Written against Twenty 2.48.0 and `kuec-bd-ops` 0.7.0, as a companion to `wireframes.md` (the brief: Home, Intake, Work package card, Manager exceptions). Build order and estimates: `backlog.md`.

Anything marked **[new: Bn]** does not exist yet and is built by item Bn of `backlog.md`. Everything else names what is on `main` today: objects, fields, views, logic functions W01 to W11, the work package card, the Home and Exceptions pages.

Contents

0. Ground rules and surfaces
1. Personas
2. Shared sub-journeys (the work package loop, the escalation ladder, logging a contact, keeping a next step)
3. Journey 1: Technology licensing (Push)
4. Journey 2: Inbound RFQ or technical-service request (Pull)
5. Journey 3: Industry workshop, from objective to opportunities
6. Journey 4: A site visit that produces several unrelated opportunities
7. Journey 5: Strategic partnership or sponsored chair
8. Journey 6: Support to a startup or subsidiary in the portfolio
9. Journey 7: Go-to-market campaign into one sector
10. Journey 8: Project delivery, kick-off to close
11. Screens: the brief's four by persona, and five new ones
12. Mobile
13. Friction log

---

## 0. Ground rules and surfaces

The brief's rules hold for every screen here: the system decides and the person confirms; decisions are never hidden; one primary action per decision; inputs appear only when their button is pressed; no AI, only deterministic rules; every component carries a link to the native Twenty record or view it is built on. Documents are never stored in Twenty, only links (`kuec/CLAUDE.md` section 4). "Working days" are Monday to Friday minus the UAE holiday list, in Asia/Dubai.

Only these surfaces are used, all listed in the brief (`wireframes.md` section 1.1):

| Surface | Used for |
| --- | --- |
| Standalone page with one FRONT_COMPONENT widget, opened from a sidebar item | Home, Exceptions, Team board **[new: B7]**, Portfolio **[new: B17]**, My week **[new: B18]** |
| Side panel front component page (`SidePanelPages.ViewFrontComponent`, optionally with `recordId` and `objectNameSingular`) | Intake, Debrief **[new: B9]**, Team member page for a colleague **[new: B18]** |
| FRONT_COMPONENT widget at the top of a record page | Work package card, Project room **[new: B13]**, Company 360 **[new: B6]** |
| Command menu item | New request (Intake), Open work package card (exists), Debrief this visit **[new: B9]** |
| Native views, record pages and RECORD_TABLE widgets | Every fallback link, every list a front component summarises |
| Notifications: Task in Twenty, email from the bd-ops mailbox, a post in the BD Teams channel | Every hand-over between people (section 12) |
| HTTP-route logic functions with `isAuthRequired: true` | Writes a person's role cannot make but the rule allows (Intake, Request help, Ask for more time, Agree recovery) |

Two platform facts shape the new screens:

- **Drag-and-drop payloads do not reach front components.** Nothing in our components is dragged. Moving work between people is a button (Team board, section 11.2). The native work package kanban also misleads people: a drag that a field lock refuses lands in the new column, shows an error toast, and snaps back only after a reload (`tests/report.md`, T6).
- **Workspace members have no record page in 2.48.** Twenty renders a member's chip as plain text ("temporary until we create a record show page for Workspaces members", `RecordChip.tsx`). The person page for a team member is therefore our own front component, opened in the side panel with the member's id (section 11.5).

## 1. Personas

| | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Job | Closes deals, decides at every gate, reports upward | Executes work packages; owns cases from intake to close; new to BD | Runs the board: load, reassignment, hygiene, the daily and weekly cadence | Reads the state of the business |
| Twenty role (`runbooks/13-roles.md`) | **ED**: read and write all, settings, workflows | **BD officer**: read all; write Opportunity, Company, Person, Engagement, Task, Note; on a work package only Status, Accepted at, Blocked reason, Declined reason | **Ops coordinator**: read and write all, delete and merge, import | **Leadership viewer**: read Opportunity, Project, Milestone, Contract, Company and dashboards; nothing else |
| Playbook role | ED | BD officer (case owner role of every playbook) | Ops coordinator (target of the 5-working-day reassignment) | none |
| Gets told about | Every block (with the reason), work not accepted after 2 working days, overdue at +2 working days, reassignments, tight deadlines, signatures | Offers, reviews they owe, overdue on the day, next steps missing at 08:00 | Reassignments to them, reviews they owe (Submission, Kick-off, Delivery hand-off), declines | Nothing; pulls, never pushed |
| Lands on after sign-in | Home, ED variant | Home | Home, ops variant | Home, leadership variant (section 11.1) |
| Must never have to | Chase anyone, open a record to find out why something is late | Know a status value, a field name, or which of the 70 views to open | Edit three fields to move one piece of work | See work package or people detail (their role cannot read it) |

Other people the journeys touch: **engineers** in the Developer and Data analyst playbook roles, **Legal** and **Finance**, who own and review steps; **researchers** (contributors, usually not Twenty members); department staff on the IP office, Leasing, Lab access and Startups and investment roles. Today the Engineer role writes no business data and the department roles cannot change work packages (`13-roles.md` decision 6), so anyone on those roles who is given a step cannot accept, submit or approve it, and the step is taken from them after 5 working days. Backlog P4 settles this before any journey goes live.

---

## 2. Shared sub-journeys

Every journey below runs the same four sub-journeys many times. They are written out once here; journey tables say "S1 loop" and give only what differs.

### S1. The work package loop

Applies to every step of every playbook and project template.

#### S1.1 Offer

| Lane | Detail |
| --- | --- |
| Who | The step's owner: the case owner for case-owner steps, otherwise the least-loaded active member of the step's role (W01, W09) |
| Sees | Email "Accept or decline: {title}" with the due label (section 12); a Task with the same title; on Home, an item in **Needs your decision** with the objective, due label and "Offered {n} working days ago" |
| Does | Nothing yet |
| System does | The previous step's Done (or case creation, for step 1) sets this one to Offered. W06 stamps `offeredAt` and recomputes `dueAt` from today plus the step's offset, capped by the client deadline or the event date where the template says so. W02 notifies and arms the 2- and 5-working-day acceptance timers; the hourly `timer-sweep` re-derives them from state |
| Record changes | Work package: `status` Planned to Offered, `offeredAt`, `dueAt`. Opportunity: stage moves forward if this step starts a later stage, and next action follows the step **[new: B4]** |
| Notified | Owner (Task, email) |
| Can stall | Owner does not answer. Caught by the escalation ladder S2.1 and S2.2 |

#### S1.2 Accept or decline

| Lane | Detail |
| --- | --- |
| Who | Owner |
| Sees | The Work package card: title, badge "Waiting to be accepted", Objective, Context ("Part of {case}, step 2 of 7, before this: {previous step} done by {name}"), Expected output, Done criteria |
| Does | **Accept** (one click). Or **Decline**, which expands "Why can't you take this?", one line, required, then a danger confirmation |
| System does | Accept: `status` Accepted, `acceptedAt`; the acceptance timers find the record moved on and stop; W03 arms the overdue timers. Decline: `status` Declined with `declinedReason`; the item leaves the owner's Home and lands in the Team board's **Needs someone** column **[new: B7]** and on the ops coordinator's Home **[new: B2]** |
| Record changes | Work package `status`, `acceptedAt` or `declinedReason`; timeline rows on the work package and the case |
| Notified | Decline: the ops coordinator (Task, email) **[new: B1, W13]**; the ED only if nobody has picked a new owner after 1 working day **[new: B2]** |
| Can stall | A declined step with no new owner. Caught by the ops coordinator's Home, then the ED's |

#### S1.3 Do the work

| Lane | Detail |
| --- | --- |
| Who | Owner, sometimes with contributors outside Twenty |
| Sees | The card on Home's **Your next actions** with its due label, "Late since {date}" once late |
| Does | The work, in SharePoint, Outlook, the lab. If unsure: **Request help** ("What do you need?" and "Can you keep working while you wait?"). If stuck: the same form, "No, I'm stuck" |
| System does | Help, can keep going: a Task "Help needed: {title}" for the reviewer (else the case owner, else the ED), due next working day, plus a Note on the work package **[new: B1, route `work-package-help`]**. Stuck: `status` Blocked with `blockedReason`; W05 tells the ED with the reason and creates "Decision needed" |
| Record changes | Task and Note, or work package `status` Blocked, `blockedReason`, `blockedAt` |
| Notified | Helper (Task, email), or the ED (Task, email, Teams) |
| Can stall | Silence: the owner neither asks nor blocks. Caught by S2.3 (overdue on the day, the ED at +2 working days) |

#### S1.4 Submit

| Lane | Detail |
| --- | --- |
| Who | Owner |
| Sees | Card button **Submit** (or **Mark as done** when the step has no reviewer) |
| Does | Pastes the SharePoint link, writes an optional note for the reviewer, answers the step's question if it has one (section 5.6 of the brief; more in **[new: B12]**), ticks "This meets the done criteria above" |
| System does | `status` Submitted, `outputLink` **[new: B1]**, the note as a Note "Submitted: note for {reviewer}"; the transition log stamps `submittedAt`; W06 notifies the reviewer. No reviewer: `status` Done directly, then S1.6 |
| Record changes | Work package `status`, `outputLink`, `outcome` **[new: B1]**, `submittedAt`; Note |
| Notified | Reviewer (Task, email) |
| Can stall | The reviewer sits on it. Today the overdue timer keeps running and tells the **owner**, who cannot act. **[new: B5]** sends overdue-in-review to the reviewer instead |

#### S1.5 Review

| Lane | Detail |
| --- | --- |
| Who | Reviewer (often the ED) |
| Sees | Home **Needs your decision**: "Review: {title}", case, submitter, the note, "Link: SharePoint", "Submitted 2 hours ago". Gate steps carry the gate's evidence from `templates.json` **[new: B1]** |
| Does | **Approve**, or **Send back** with "What needs to change?". On a gate whose "no" closes the case: a third choice, the text link "Stop the case", with a reason **[new: B1]** |
| System does | Approve: `status` Done, `completedAt`, the step outcome applied (W14) **[new: B1]**. Send back: `status` Accepted and a Note "Sent back: ..."; W13 tells the owner **[new: B1]**. Stop: opportunity Lost with `lostReason`, or project Cancelled. A case that goes Lost by any path (Stop, Don't bid, a person on the native record) stops its remaining steps, so nobody is chased for it; a Parked case keeps its steps but their timers pause until it moves again **[new: B1]** |
| Record changes | Work package `status`; opportunity `stage`, `lostReason`; Note |
| Notified | Owner on Send back; the next owner on Approve (S1.1) |
| Can stall | As S1.4 |

#### S1.6 Release

| Lane | Detail |
| --- | --- |
| Who | Nobody; the system |
| Sees | The approver's toast: "Approved. {next owner} has been asked to start {next title}." |
| Does | Nothing |
| System does | W06 offers every Planned step that depended on this one (S1.1 for the next owner). On a project, the milestone this step closes becomes Done **[new: B11]** and W10 recomputes percent complete |
| Record changes | Next work package, milestone, project `percentComplete` |
| Notified | Next owner |
| Can stall | The last step: nothing tells anyone to close the case. Opportunities close through the step's outcome question (Signed, Lost, Parked); projects get W10's "close the project" Task, and the Project room shows **Close the project** **[new: B13]** |

### S2. The escalation ladder

Already automated by W02 to W05 and the hourly sweeps. What changes is where it surfaces: on screens instead of only in Tasks.

#### S2.1 Not accepted after 2 working days

| Lane | Detail |
| --- | --- |
| Who | Owner, the ED |
| Sees | Owner: email "Not accepted after 2 business days: {title}". The ED: the same. Team board: amber "Waiting 2+ days" flag on the card **[new: B7]** |
| Does | Owner accepts or declines. Usually nobody else needs to |
| System does | W02 level 1: notifies, stamps `acceptReminderSentAt`, arms level 2 |
| Record changes | `acceptReminderSentAt` |
| Notified | Owner, the ED |
| Can stall | Still nothing. S2.2 |

#### S2.2 Not accepted after 5 working days

| Lane | Detail |
| --- | --- |
| Who | Ops coordinator |
| Sees | Email "Unaccepted for 5 business days, reassigned to the ops coordinator: {title}"; the card in their own Team board column, flagged |
| Does | Does it, or **Reassign** it on the Team board to someone with capacity **[new: B7]** |
| System does | W02 level 2: owner set to the ops coordinator, `reassignedAt`, Reassigned on the timeline, Teams post |
| Record changes | Work package `ownerId`, `reassignedAt` |
| Notified | Previous owner, new owner, the ED; Teams channel |
| Can stall | The ops coordinator is overloaded. Visible as the longest column on the Team board |

#### S2.3 Overdue

| Lane | Detail |
| --- | --- |
| Who | Owner on the day; the ED at +2 working days |
| Sees | Owner: "Overdue today: {title}" and "Late since {date}" on Home. The ED: "Overdue 2 business days", and the item under **Late** on Exceptions with its last activity |
| Does | Owner submits, or asks for more time **[new: B18]**. The ED (or the ops coordinator) moves the date with a reason ("New due date") or gives it to someone else, from Exceptions |
| System does | W03 levels 1 and 2 with their stamps. A moved `dueAt` re-arms both levels |
| Record changes | `overdueOwnerNotifiedAt`, `overdueEdNotifiedAt`; on a move, `dueAt` and a Note "Due date moved: {reason}" |
| Notified | Owner, then the ED. In review: the reviewer instead of the owner **[new: B5]** |
| Can stall | A due date moved over and over. Visible in the Note trail on the card's timeline; no rule stops it |

#### S2.4 Blocked

| Lane | Detail |
| --- | --- |
| Who | The ED |
| Sees | Email and Teams "Blocked, decision needed: {title}. Reason: ..."; Home **Needs your decision** item "Blocked: {title}" with the reason and the client deadline |
| Does | **Back to work** (the owner continues), **Give to someone else**, or **Keep waiting** (acknowledges; it stays on Exceptions) |
| System does | W05 on every transition to Blocked. Keep waiting stamps `blockAcknowledgedAt` **[new: B1]** |
| Record changes | Work package `status`, `ownerId`, `blockAcknowledgedAt`; Note "Unblocked by the ED" |
| Notified | Owner (Back to work), new owner (Give to) |
| Can stall | Blocked on something outside KUEC (the client). Stays on Exceptions, "Seen by you", until the owner presses "I can continue now" |

### S3. Logging a contact

Every call, meeting or email that matters becomes an Engagement. Today that means opening Engagements, "+ New", and linking company and opportunity by hand; W11 copies the next step only when the opportunity is linked. **[new: B6]** puts one form on Company 360 (and on the Project room, **[new: B13]**).

#### S3.1 Log

| Lane | Detail |
| --- | --- |
| Who | Whoever had the contact (BD officer, the ED) |
| Sees | Company 360 primary action **Log a contact** |
| Does | Picks Call, Meeting, Email or Event; date (default today); who they spoke to (the company's people, or "Add a person"); what happened (one or two lines); next step and its date. When the company has several open opportunities: "Which case is this about?" (none preselected; "None of them" allowed) |
| System does | Creates the engagement with company, opportunity, owner = me. W11 stamps the company's `lastEngagementAt` and `engagementLapsesAt`, the engagement's `outcomeDueAt`, and copies the next step into the opportunity's next action. When the outcome is typed now, the engagement never shows as "outcome overdue" |
| Record changes | Engagement (new), Company stamps, Opportunity `nextAction`, `nextActionDate` |
| Notified | Nobody |
| Can stall | Not logged at all. Caught indirectly: the company lapses after 60 days (BD dashboard "Key accounts not engaged in 60 days"); the opportunity's next action goes stale and W04 asks at 08:00 |

### S4. Keeping a next step

| Lane | Detail |
| --- | --- |
| Who | Opportunity owner |
| Sees | Home **Your next actions**: "Next step: {nextAction}", due label; or "Set a next step" when empty. The 08:00 Task "Set next action" from W04 when either field is empty or past |
| Does | **Done, what's next?**: "What's the next step?" and "By when?" (default 3 working days), both required, Save |
| System does | Writes both fields at once. While a playbook step is running, the next action follows the step on release, so the owner only types next steps between steps or outside a playbook **[new: B4]**. The W04 Task closes itself once both fields are valid **[new: B5]** |
| Record changes | Opportunity `nextAction`, `nextActionDate`, `nextActionFlaggedOn` |
| Notified | Nobody |
| Can stall | A date pushed every few days with no movement. Caught by "Stale opportunities" (30 days in one stage, W08 `staleFrom`) on the BD dashboard |

---

## 3. Journey 1: Technology licensing (Push)

**Trigger:** the ED picks a technology from the uVENTURE portfolio for active marketing. **Case:** opportunity, Type Licence (`TECHNOLOGY_LICENSING`), owned by a BD officer. **Steps:** Technical assessment (Developer, reviewed by the ED, 10 working days), Commercial route scoping (BD officer, ED, 5), Partner shortlist (Data analyst, BD officer, 5), Outreach (BD officer, ED, 15), Term sheet (BD officer, Legal, 10), Licence signed (Legal, ED, 20). **Gates:** technical go and route approval (ED; "no" closes as Lost), terms approval inside Term sheet (ED, Legal, Finance), signature inside Licence signed (ED). **Exits:** Signed (W07 creates the licence contract), Lost, Parked. **Screens:** Intake, Home, Work package card, Company 360, Team board, Exceptions.

### 3.1 Choose and open the case

| Lane | Detail |
| --- | --- |
| Who | The ED decides; a BD officer (or the ED) opens the case |
| Sees | Home's primary field "What would you like to get done?" |
| Does | Opens Intake, pastes the ED's note ("Market the low-cost desalination membrane"), picks tile 4 "License one of our technologies", pastes the uVENTURE link or keeps "I'll add it later", Confirm. When the ED opens it: "Who will own this case?" (people on the BD officer role with their open counts, the suggested person preselected) **[new: B4]** |
| System does | `intake-preview` shows six steps with owners and dates (step 1 due in 10 working days, the rest "Around"). `intake-confirm` creates the opportunity (stage Qualify, source "Referral: faculty" for tile 4 **[new: B4]**, `uventureRecord` **[new: B4]**), the "Original request" note, then sets Type. W01 creates the six work packages, offers step 1 to the least-loaded Developer, fills next action from step 1, and creates "Confirm plan" for the ED |
| Record changes | Opportunity, Note, 6 work packages, 2 Tasks |
| Notified | Developer (offer), the ED ("Confirm plan"), Teams channel ("Playbook started") |
| Can stall | (a) The decision never becomes a case: nothing in Twenty knows. Only the Thursday review's "Decisions needed" catches it; the ED opening it directly with an owner removes the hand-over. (b) No uVENTURE link: the card's Context on step 1 shows "uVENTURE record: not linked yet. Add it" to the case owner **[new: B12]**. (c) W01 stops before finishing (`tests/report.md`, blocker 2, backlog P2): Intake shows "Your case is saved. The work list is still being prepared" and the retry path completes it |

### 3.2 Technical assessment (gate: technical go)

| Lane | Detail |
| --- | --- |
| Who | Developer (owner), researcher (contributor, outside Twenty), the ED (reviewer) |
| Sees | Developer: S1.1 offer; the card's Context includes the uVENTURE link. The ED: the review with the gate's evidence "Assessment note: TRL, IP status, researcher commitment" |
| Does | Developer: S1 loop; the assessment note goes to SharePoint. The ED: **Approve: go ahead**, **Send back**, or "Stop the case" with a reason **[new: B1]** |
| System does | S1 loop. Stop: stage Lost, `lostReason`; W08 asks for a lost reason category if it is empty. Approve: W06 offers Route scoping to the case owner; stage Scope **[new: B4, W12]** |
| Record changes | Work package; opportunity stage, next action |
| Notified | The ED on submit; case owner on release |
| Can stall | Researcher unavailable: the developer uses Request help, "No, I'm stuck" (S1.3), and the ED sees the block with its reason. The ED reviews late: the reviewer, not the developer, gets the overdue reminder **[new: B5]** |

### 3.3 Commercial route scoping (gate: route approval)

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Card; Context "Before this: Technical assessment, done by Omar on Tue 4 Nov" with its link |
| Does | S1 loop. On Submit, two facts the case needs from now on: "Indicative value (AED)" and "When could it be signed?" **[new: B12]** |
| System does | The two facts go to the opportunity's Amount and Close date, so "Hygiene: missing key fields" never lists it. The ED's gate as in 3.2. Approve offers Partner shortlist to the least-loaded Data analyst |
| Record changes | Work package; opportunity `amount`, `closeDate` |
| Notified | The ED; the data analyst |
| Can stall | As 3.2. The ED's review queue is the usual bottleneck: Home lists reviews oldest first |

### 3.4 Partner shortlist

| Lane | Detail |
| --- | --- |
| Who | Data analyst (owner), BD officer (reviewer) |
| Sees | Card; the expected output "Ranked shortlist of companies in Twenty, each with a named contact and a fit rationale"; below the card, the opportunity's **Shortlist** table **[new: B16]** |
| Does | Finds companies (Companies, view "By sector", filtered to the target sectors from 3.3); for each, adds a Target row: company, contact, fit rationale, rank. New companies and people through Company 360's "Add a person" (search by email first) **[new: B6]** |
| System does | Target rows in status Shortlisted. On Submit, the card checks the done criteria it can check: "3 of 8 targets have no named contact" above the checkbox **[new: B16]** |
| Record changes | Companies, People, Targets **[new: B16]**, work package |
| Notified | BD officer (review) |
| Can stall | Duplicates: people are not created from mail (`config/dashboards/email-calendar-sync.md`), so they are typed by hand and sometimes twice. Caught by the ops coordinator's Monday sweep of "Added in the last 7 days" (`runbooks/14-hygiene.md`) |

### 3.5 Outreach

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Card with the shortlist summary "8 targets: 3 contacted, 1 in discussion, 4 to contact" **[new: B16]**; each target's Company 360 before a call |
| Does | Contacts each partner from Outlook or the phone. Logs each contact (S3), answering one extra question on the form: "Where does this leave {company}?" To contact, Contacted, In discussion, Declined **[new: B16]** |
| System does | W11 as in S3. Target `lastContactAt`; 10 working days without a reply creates a follow-up Task for the BD officer, another 10 marks the target Closed (the template's additional escalations, not implemented today) **[new: B16]**. Stage Propose when the step is offered **[new: B4]** |
| Record changes | Engagements, company stamps, opportunity next action, target status |
| Notified | BD officer (follow-ups); the ED on submit |
| Can stall | No live conversation for 30 working days: the playbook says Parked, nothing applies it today. **[new: B16]** puts "No live conversation for 30 working days: park it?" on the ED's Home with **Park it** and **Keep going** |

### 3.6 Term sheet (gate: terms approval)

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), Legal (reviewer), the ED and Finance (approve before issue) |
| Sees | Card; Context names the partner in discussion **[new: B16]**. The done-criteria checkbox reads "The ED, Legal and Finance have approved the draft before it went out", taken from the gate in `templates.json` **[new: B12]** |
| Does | Drafts on SharePoint; collects the three approvals (by email or meeting, each recorded as a Note); issues; logs the partner's answer (S3); S1 loop |
| System does | S1 loop; Legal reviews. Approve offers Licence signed to Legal. Stage Negotiate |
| Record changes | Work package, Notes, engagements |
| Notified | Legal (review, then the next step) |
| Can stall | (a) Legal has one person and many reviews: the Team board shows Legal's column length. (b) Legal and Finance members must hold a role that can change work package status, or they cannot accept or approve at all (backlog P4) |

### 3.7 Licence signed (gate: signature) and close

| Lane | Detail |
| --- | --- |
| Who | Legal (owner), the ED (reviewer), BD officer (uVENTURE hand-offs) |
| Sees | Card question "Was it signed?" Yes, signed / No, it fell through. Done criteria list the hand-offs from the template: technology set to licensed (BD officer), licence record created and recorded against the patent (Legal) |
| Does | Executes the agreement, stores it on SharePoint, Submit with "Yes, signed" and the link. The ED approves |
| System does | W14 sets the stage Signed **[new: B1]**; W07 notifies the ED, posts to Teams, creates the licence contract (status Signed) linked to the opportunity; W08 stamps the stage. A Task for the BD officer: "uVENTURE: set {technology} to licensed" **[new: B12]** |
| Record changes | Work package Done, opportunity Signed, Contract (new), Task |
| Notified | The ED, Teams channel, BD officer |
| Can stall | Contract metadata left empty (counterparty, expiry, value): Company 360's Contracts block flags "Expiry not set" **[new: B6]**; "Hygiene: past expiry, still Signed" catches the other end. "No, it fell through": Lost with the note as reason |

---

## 4. Journey 2: Inbound RFQ or technical-service request (Pull)

**Trigger:** an RFQ or service request reaches the BD mailbox or a BD officer; the playbook says log it the same working day. **Case:** opportunity, Type RFQ / technical service, owned by the BD officer who logs it. **Steps:** Bid or no-bid (BD officer, the ED, 2), Scoping (Developer, BD officer, 3), Quote or proposal (BD officer, Finance, 3), Internal approval (the ED, no reviewer, 2), Submission (BD officer, ops coordinator, 1), Follow-up (BD officer, the ED, 5), Delivery hand-off (BD officer, ops coordinator, 3). Every step up to Submission is capped at 2 working days before the client deadline. **Exits:** Signed, Lost, Parked. **Screens:** Intake, Home, Work package card, Exceptions, Team board.

### 4.1 The request is logged

| Lane | Detail |
| --- | --- |
| Who | BD officer |
| Sees | Outlook (the request); then Intake |
| Does | Pastes the email, picks tile 1 "A company needs a test or service" (or tile 3 for lab or equipment; same playbook), checks "From: ADNOC (in Twenty)" and "Client deadline: Thu 30 Oct", Confirm |
| System does | Company matched by email domain, else by name. Plan preview with step 1 capped by the deadline. If the plan does not fit: the amber line, and on Confirm `deadlineRiskFlaggedAt` **[new: B4]**. The opportunity is created (source Inbound (web, email, phone), `clientDeadline`), W01 instantiates; step 1 is the case owner's |
| Record changes | Company (if added), Opportunity, Note "Original request", 7 work packages |
| Notified | The ED, if the deadline is tight ("Tight deadline, decision needed") **[new: B4]**; Teams channel |
| Can stall | (a) The request stays in Outlook: Twenty cannot see it (the bd-ops mailbox syncs metadata only, and personal mailboxes subject and metadata). Not caught by the system; the standup's "yesterday I..." round is the net. (b) A new company typed in Intake has no sector or size class: "Hygiene: missing key fields" for companies, Monday |

### 4.2 Bid or no-bid

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Intake's last line "Your first step is Bid or no-bid, due Thursday. It's on your Home now." The ED: the review, and the Tight deadline card if raised |
| Does | S1 loop. Submit asks "What do you recommend? Bid / Don't bid"; Don't bid needs the reason in the note and a category (Capacity, Technical fit, Timing, Price, Other) **[new: B12]**. The ED: **Approve: we'll bid** or **Approve: we won't bid**, matching the recommendation; **Go ahead** or **Don't bid** on the deadline card |
| System does | W14: Don't bid sets Lost with `lostReason` and `lostReasonCategory` **[new: B1, B12]**, and the six later steps are stopped. Bid: W06 offers Scoping to the least-loaded Developer; stage Scope |
| Record changes | Work package; opportunity stage, lost reason; `deadlineRiskAcknowledgedAt` **[new: B4]** |
| Notified | Developer (offer), or the case owner ("Marked as Lost") |
| Can stall | Step 1 is due in 2 working days or sooner; overdue reaches the ED in 2 more. Tight deadlines make the ED's review the critical path: both items sit at the top of the ED's Home, oldest first |

### 4.3 Scoping

| Lane | Detail |
| --- | --- |
| Who | Developer (owner), BD officer (reviewer) |
| Sees | Card; Context with the client deadline and "Original request" disclosure, so the developer reads the RFQ without searching for it |
| Does | S1 loop; scope on SharePoint (tasks, method, equipment, staff time, assumptions, exclusions) |
| System does | S1 loop |
| Record changes | Work package |
| Notified | BD officer (review), then the BD officer again (Quote or proposal is theirs) |
| Can stall | The developer is already on three deliveries. The ops coordinator sees the column on the Team board and reassigns before the offer goes stale **[new: B7]** |

### 4.4 Quote or proposal

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), Finance (reviewer and contributor) |
| Sees | Card; "Before this: Scoping, done by Omar" with the scope link |
| Does | S1 loop. Submit asks for the quoted price and the expected decision date **[new: B12]** |
| System does | The price goes to Amount, the date to Close date. Finance reviews. Approve offers Internal approval to the ED. Stage Propose |
| Record changes | Work package; opportunity `amount`, `closeDate` |
| Notified | Finance; the ED |
| Can stall | Finance is outside the BD team and may not hold a role that can review (P4) |

### 4.5 Internal approval

| Lane | Detail |
| --- | --- |
| Who | The ED (owner, no reviewer) |
| Sees | Home **Needs your decision**: "Approve for submission: {case}", the quote link and Finance's approval, the client deadline |
| Does | **Approve**, or **Send back to {BD officer}** with what must change. One click for the common case: the ED does not accept the step first **[new: B1]** |
| System does | Approve: accepts and completes the step in one write; W06 offers Submission. Send back: Quote or proposal returns to In progress with a Note; this step returns to Not started and is offered again when the quote is resubmitted and approved |
| Record changes | Two work packages; Note |
| Notified | BD officer |
| Can stall | Cap: 2 working days before the deadline. Late reaches the ED as overdue on the day; it is the ED's own item, at the top of Home |

### 4.6 Submission

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), ops coordinator (reviewer) |
| Sees | Card due "Due tomorrow" at the latest, 2 working days before the deadline |
| Does | Sends from Outlook or the client portal; Submit with the confirmation link |
| System does | S1 loop; the ops coordinator checks the link and approves. Follow-up offered; stage Negotiate |
| Record changes | Work package |
| Notified | Ops coordinator, then the BD officer |
| Can stall | Portal down or a missing document: Request help, "No, I'm stuck"; the ED sees it with the client deadline in the item |

### 4.7 Follow-up and the client's decision

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Card with a secondary button **Chased, no answer** **[new: B12]** |
| Does | Chases; each chase without an answer is one click (it logs an engagement "No answer" and sets the next step 5 working days out). When the client answers, logs it (S3) and submits "What did the client decide?" They said yes / They said no / No answer yet |
| System does | The third unanswered chase sets the stage Parked and tells the BD officer and the ED, as the playbook says **[new: B12]**. On approval W14 applies the answer: Signed (W07), Lost with reason, or Parked |
| Record changes | Engagements, `unansweredFollowUps` **[new: B12]**, opportunity stage |
| Notified | The ED (submit, signed); BD officer and the ED (parked) |
| Can stall | The client decides by phone and nobody records it. The step's overdue timer and W04's next-action check both fire |

### 4.8 Delivery hand-off

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), ops coordinator (reviewer) |
| Sees | After Signed, the card for Delivery hand-off; the Delivery project already exists as a draft **[new: B15]** |
| Does | Opens the project (from the card's Context), checks owner, client contacts, PO link and end date; Submit |
| System does | On Signed, a Delivery project is created with company, opportunity, the least-loaded Developer as owner, and Type Delivery, which starts W09 **[new: B15]**. Today the BD officer creates it by hand. Continues in Journey 8 |
| Record changes | Project (new), its work packages and milestones; work package |
| Notified | Developer (Kick-off offer); ops coordinator (review) |
| Can stall | Kick-off more than 5 working days after the PO: Kick-off's own due date and overdue ladder |

---

## 5. Journey 3: Industry workshop, from objective to opportunities

**Trigger:** the ED approves a topic (annual plan or a partner's request). **Case:** project, Type Workshop, opened at least 40 working days before the event; W09 creates six work packages planned back from the event date and five milestones. **Steps:** Objective (BD officer, the ED, 3), Audience and target roles (Data analyst, BD officer, 5), Invitations (BD officer, the ED, 5; done 20 working days before the event), Logistics (ops coordinator, BD officer, 10; done 1 working day before), Run (BD officer, the ED; on the event day), Outcomes into opportunities (BD officer, the ED, 5). **Gates:** objective approval (no: Cancelled), budget approval inside Logistics, go/no-go 5 working days before the event (minimum 8 registrations; no: On hold or Cancelled). **Screens:** Intake, Project room, Debrief, Home, card, Portfolio.

### 5.1 Open the workshop

| Lane | Detail |
| --- | --- |
| Who | BD officer (case owner) |
| Sees | Intake, tile 6 "Run a workshop or event", one extra field "When is the event?" |
| Does | Describes the topic, picks the date, Confirm |
| System does | Fewer than 40 working days to the event: the amber line "That's 28 working days away; the plan needs 40. You can still go ahead; the ED will be asked to decide." **[new: B4]**. Creates the project with `eventDate`, Type Workshop; W09 plans the steps and milestones; Objective is offered to the case owner |
| Record changes | Project, 6 work packages, 5 milestones |
| Notified | Case owner (Objective offered); the ED if the date is tight |
| Can stall | Event date set but the venue not yet held: not a system concern; Logistics catches it |

### 5.2 Objective (gate: objective approval)

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Project room: the milestone rail with "Objective approved" first and its work package under it **[new: B13]**; the card |
| Does | S1 loop. Submit asks "How many people do you expect?" **[new: B16]** |
| System does | `expectedAttendees` on the project. The ED: **Approve: go ahead**, Send back, or "Stop: cancel the workshop" (project Cancelled) **[new: B1]**. Approve closes the milestone **[new: B11]** |
| Record changes | Work package, project, milestone |
| Notified | The ED; the data analyst |
| Can stall | As S1 |

### 5.3 Audience and target roles

| Lane | Detail |
| --- | --- |
| Who | Data analyst (owner), BD officer (reviewer) |
| Sees | The project's **Invitees** table under the Project room **[new: B16]**; the card's done-criteria line "24 invitees for 10 expected. The plan needs 30." |
| Does | Adds invitees (people, each linked to a company, in the roles CEO, CTO, R&D head, innovation manager); new people through "Add a person" |
| System does | Target rows in status To invite; the count against `expectedAttendees` is shown, not enforced |
| Record changes | People, Targets |
| Notified | BD officer |
| Can stall | Too few people of the right roles: Company 360 shows which target companies have no decision maker on record |

### 5.4 Invitations

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Invitees table with statuses |
| Does | Sends invitations from Outlook (Twenty sends no email for people, `13-roles.md` decision 10); marks Invited, then Registered as replies come in |
| System does | Due date capped at 20 working days before the event; registrations counted on the Project room |
| Record changes | Targets, work package |
| Notified | The ED |
| Can stall | Registrations not kept current: the go/no-go in 5.6 then reads a wrong number. The count on the Project room is the only prompt |

### 5.5 Logistics and budget

| Lane | Detail |
| --- | --- |
| Who | Ops coordinator (owner), BD officer (reviewer), Finance (contributor), the ED (budget gate) |
| Sees | Card; done criteria "Spend approved by the ED after finance review" as the checkbox text **[new: B12]** |
| Does | Books venue, catering, AV; confirms presenters; gets the ED's spend approval (Note); S1 loop |
| System does | S1 loop; milestone "Logistics confirmed" |
| Record changes | Work package, milestone, Notes |
| Notified | BD officer |
| Can stall | Due 1 working day before the event: overdue here means the event is at risk; the Project room turns Amber 7 days before the milestone (W10) |

### 5.6 Go/no-go and the event

| Lane | Detail |
| --- | --- |
| Who | The ED (go/no-go), BD officer (Run, owner), researchers (presenters) |
| Sees | The ED, 5 working days before: Home "Go/no-go: {workshop} on Tue 2 Dec. 11 registered (minimum 8)." **[new: B16]**. BD officer: the Run card on the event day; the invitee list on a phone at the door |
| Does | The ED: **Go ahead**, **Postpone** (On hold) or **Cancel**. BD officer: marks Attended or No-show at the door, and Interested with a one-line note for anyone who asks for a follow-up or names a problem |
| System does | The go/no-go card is raised by the daily sweep from the gate in `templates.json` (`when: 5 business days before the event`). The event is logged as an engagement (kind Event) linked to the project **[new: B13]** |
| Record changes | Project status (if not Go), Targets, Engagement, work package |
| Notified | Case owner (the ED's decision) |
| Can stall | Attendance never recorded: Outcomes cannot start from a list. The Run step's done criteria name it, and the Project room shows "Attendance not recorded yet" |

### 5.7 Outcomes into opportunities

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Project room primary action **Turn interest into opportunities** (Debrief, **[new: B9]**), listing every Interested attendee with their note |
| Does | For each row: picks a tile and confirms the line, or marks "No fit" with a reason. Industry challenges (tile 2) take the uVENTURE challenge link **[new: B8]** |
| System does | One opportunity per row, each with its playbook, `originProject` = the workshop, source "Workshop" (`runbooks/18-taxonomy.md`), the attendee's company **[new: B9]**. No fit: target status No fit with the note. Lead and opportunity counts are derived from these rows and shown on the Project room, zero included, so nobody types them |
| Record changes | Opportunities and their work packages; Targets; work package |
| Notified | Owners of each opportunity's step 1; the ED on submit |
| Can stall | The classic workshop failure: interest never converted. The step is due 5 working days after the event; the Project room shows "6 interested, 2 opportunities, 4 to go" until done |

### 5.8 Close

| Lane | Detail |
| --- | --- |
| Who | BD officer (project owner) |
| Sees | All milestones Done; W10's Task "All milestones done, please close the project"; the Project room's **Close the project** **[new: B13]** |
| Does | Closes it |
| System does | Project status Done; the close Task closes itself **[new: B5]** |
| Record changes | Project |
| Notified | Nobody |
| Can stall | Left open: it stays in Portfolio's "On track" with 100%, which looks harmless. Portfolio shows "Ready to close" instead **[new: B17]** |

---

## 6. Journey 4: A site visit that produces several unrelated opportunities

**Trigger:** a BD officer or the ED visits a company (a plant, an industrial park, a ministry). **Case:** none for the visit itself; the visit is an engagement. The point of the journey is that one visit yields several cases that share nothing but their origin: for example corrosion testing for the host (RFQ), lab access for the host's sister company (RFQ, another company), and interest in licensing a KUEC membrane (licence, Push). Today an engagement links to one opportunity, so the other needs are typed into the outcome text and usually lost. **Screens:** Company 360, Debrief, Intake's plan preview, Home.

### 6.1 Plan and prepare

| Lane | Detail |
| --- | --- |
| Who | BD officer (or the ED) |
| Sees | Company 360 for the host: people by role and influence, open opportunities with next steps, last contacts, contracts, projects **[new: B6]** |
| Does | Logs the planned visit (S3 with a future date; "what happened" empty). Reads Company 360 on the way, on a phone |
| System does | Engagement created; W11 sets `outcomeDueAt` to the date plus 2 days |
| Record changes | Engagement |
| Notified | Nobody |
| Can stall | Double entry: the Outlook meeting syncs into Twenty's calendar, not into Engagements. Accepted; the engagement is what the BD dashboard counts |

### 6.2 The visit

| Lane | Detail |
| --- | --- |
| Who | BD officer |
| Sees | Nothing in Twenty, or Company 360 on a phone |
| Does | Takes notes on paper or in Outlook |
| System does | Nothing |
| Record changes | None |
| Notified | Nobody |
| Can stall | Nothing to catch yet |

### 6.3 Debrief: several cases from one visit

| Lane | Detail |
| --- | --- |
| Who | BD officer, the same or next working day |
| Sees | Home **Your next actions**: "Debrief your visit to ADNOC" from the day after the visit until its outcome is set **[new: B9]**. It opens **Debrief** in the side panel (also from the engagement row on Company 360 and the command "Debrief this visit" on an engagement) |
| Does | Writes what happened (saved as the engagement's outcome). Under "What came out of it?", adds one line per need. Each line gets a tile, a company (default the host, changeable, "Add {name} as a new company"), and an owner (default me) |
| System does | Each line gets its own plan preview, collapsed to step 1's owner and due label, and its own deadline check. Confirm all: one `intake-confirm` per line, idempotent per line id, each opportunity with `originEngagement` = the visit and source Outreach **[new: B9]** |
| Record changes | Engagement outcome; N opportunities, notes and work packages; companies if added |
| Notified | Step-1 owners; the ED once: "Visit to ADNOC: 3 new cases" with the three names **[new: B9]**; the ED for any tight deadline |
| Can stall | (a) Debrief never done: Home keeps the item; "Hygiene: outcome overdue" lists it on Monday. (b) A need that is not a case ("send the brochure"): written as the engagement's next step, which becomes a next action only if one opportunity is linked; otherwise the Debrief offers "Remind me" (a Task for me, due in 2 working days) |

### 6.4 Each case runs its own journey

| Lane | Detail |
| --- | --- |
| Who | Each opportunity's owner |
| Sees | Their own journey (2, 1, 5 or 6); the card's Context reads "From the visit to ADNOC on Mon 13 Oct" |
| Does | As in that journey |
| System does | As in that journey |
| Record changes | As in that journey |
| Notified | As in that journey |
| Can stall | As in that journey |

### 6.5 What the visit produced

| Lane | Detail |
| --- | --- |
| Who | The ED, the visitor |
| Sees | Company 360 groups opportunities under "From the visit on Mon 13 Oct" (and from other visits); each with stage and owner **[new: B6, B9]** |
| Does | Reads |
| System does | Nothing |
| Record changes | None |
| Notified | Nobody |
| Can stall | None |

---

## 7. Journey 5: Strategic partnership or sponsored chair

**Trigger:** the ED and a counterpart's leadership agree to explore a multi-year partnership (a sponsored chair, a joint lab, a framework programme). **Case:** opportunity, Type Strategic partnership **[new: B14]**, owned by the ED; the BD officer supports. **Steps** (proposed, for the ED's sign-off): Frame the partnership (the ED, no reviewer, 10), Stakeholder map (BD officer, the ED, 5), Proposal or MoU draft (BD officer, Legal, 15), Internal approvals (the ED, no reviewer, 10), Negotiate and sign (the ED, Legal, 20), Set up governance (ops coordinator, the ED, 5). **Exits:** Signed (contract kind MoU or Sponsorship agreement **[new: B14]**), Lost, Parked. After signature, a Partnership project carries the governance cadence. **Confidentiality:** until the ED decides on a separate object (`runbooks/13-roles.md` section 5, decision 1), every Opportunity reader sees these cases, the Leadership viewer included. Record only what all of them may see; the terms live in SharePoint behind the link.

### 7.1 Approach and open

| Lane | Detail |
| --- | --- |
| Who | The ED |
| Sees | Intake: the ED's tile set has a seventh tile, "A strategic partnership or sponsored chair" **[new: B14]**, with the permanent line "Everyone with access to opportunities can see this case. Keep the terms in SharePoint and link them." |
| Does | Describes the intent in two lines, picks the tile, keeps ownership, Confirm |
| System does | Opportunity, Type Strategic partnership; W01 instantiates; step 1 is the ED's |
| Record changes | Opportunity, work packages |
| Notified | Teams channel |
| Can stall | Opened late, after months of informal talks: nothing catches that; the playbook only starts when the case exists |

### 7.2 Frame and map the stakeholders

| Lane | Detail |
| --- | --- |
| Who | The ED (frame), BD officer (stakeholder map) |
| Sees | BD officer: the card, and Company 360's people grouped by decision role with influence and the champion star **[new: B6]** |
| Does | The ED: framing note on SharePoint (both sides' goals, scope, value range, internal sponsor), Mark as done. BD officer: adds and classifies people until each role the deal needs (decision maker, budget holder, technical evaluator) has a name; S1 loop |
| System does | The card checks what it can: "No budget holder recorded at Aldar yet" above Submit **[new: B12]** |
| Record changes | People (`decisionRole`, `isChampion`, `influence` **[new: B6]**), work packages |
| Notified | The ED (review) |
| Can stall | Months between meetings is normal here. W04 still asks for a dated next step every morning it is missing, and a Tier 1 company lapses after 60 days without an engagement |

### 7.3 Proposal or MoU, approvals, signature

| Lane | Detail |
| --- | --- |
| Who | BD officer (draft), Legal (review), the ED (approvals and signature) |
| Sees | Cards in turn; the ED's own approval step as a one-click decision on Home **[new: B1]** |
| Does | S1 loop for each; approvals outside KUEC BD (university leadership, board) are recorded as Notes on the Internal approvals step. Signature: "Was it signed?" |
| System does | W14 Signed; W07 tells the ED and Teams. The contract is entered with kind MoU or Sponsorship agreement, value, start and expiry |
| Record changes | Work packages, opportunity, Contract |
| Notified | Legal, the ED, Teams channel |
| Can stall | Internal approvals take longer than any offset. The step's due date is moved with a reason on Exceptions ("New due date"), which keeps the trail |

### 7.4 Run the partnership

| Lane | Detail |
| --- | --- |
| Who | Ops coordinator (set-up), the ED and BD officer (relationship) |
| Sees | Project room for the Partnership project **[new: B14, B13]**: milestones for each steering committee, the annual report and the renewal decision |
| Does | Ops coordinator creates the project from the governance step (Type Partnership, linked to the company and opportunity; milestones from the contract's dates). Each steering meeting is logged against the project (S3 from the Project room) |
| System does | W09 instantiates the template. W10 turns the project Amber 7 days before each milestone. The renewal milestone is due 6 months before the contract expires |
| Record changes | Project, milestones, engagements |
| Notified | Milestone owners via their work packages |
| Can stall | The renewal decision: "Expiring" (contracts, 90 days) and the renewal milestone both surface it, on Company 360 and Portfolio |

---

## 8. Journey 6: Support to a startup or subsidiary in the portfolio

**Trigger:** a portfolio startup or a subsidiary asks for help: an introduction to a customer or investor, use of a lab or a test, or other support (mentoring, a grant application, a pitch). **Records:** the startup is a Company with `portfolioRelation` Portfolio startup or Subsidiary **[new: B8]**. The request becomes one of three cases, decided by one question in Intake. **Screens:** Intake, Company 360, Home, card.

### 8.1 The request arrives

| Lane | Detail |
| --- | --- |
| Who | BD officer, or Startups and investment staff (their department role writes Opportunity, Engagement, Task, Note) |
| Sees | Intake, tile 5 "Work with a startup", and one question: "What does {startup} need?" with three choices **[new: B8]** |
| Does | Pastes the founder's email, picks the tile and the choice, Confirm |
| System does | "An introduction to a company": opportunity, Type Startup partnering, company = the counterparty, `portfolioCompany` = the startup. "Our lab, equipment or a test": opportunity, Type RFQ / technical service, company = the startup. "Other support": project, Type Portfolio support **[new: B14]**, company = the startup |
| Record changes | Opportunity or project, work packages |
| Notified | Step-1 owner; Teams channel for the two opportunity paths (W01 posts, W09 does not) |
| Can stall | The startup is not flagged as portfolio: it then looks like any client. The company field in Intake shows "Portfolio startup" next to matched names, and the "Portfolio companies" view lists unflagged startups (Size class Startup) for the ops coordinator **[new: B8]** |

### 8.2 Introduction path (Startup partnering)

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (Qualify, Introduction reviews), Legal (Agree terms review), ops coordinator (Hand-off review) |
| Sees | Cards for Qualify the fit, Introduction, Agree terms, Hand-off (brief section 9.1) |
| Does | S1 loop; the introduction meeting is logged (S3) against the counterparty, and the startup appears on it through the opportunity |
| System does | Stage follows step: Qualify, Scope (Introduction), Propose (Agree terms) **[new: B4]**. Agree terms asks "Was it signed?" |
| Record changes | Work packages, engagements, opportunity, contract when signed |
| Notified | As S1 |
| Can stall | The counterparty goes quiet after the introduction: Agree terms is 15 working days, then the overdue ladder; W04 for the next step |

### 8.3 Support path (Portfolio support project)

| Lane | Detail |
| --- | --- |
| Who | BD officer or department staff (project owner) |
| Sees | Project room with three milestones: Need agreed, Support delivered, Outcome recorded **[new: B14, B13]** |
| Does | S1 loop on each step; lab hours or mentoring sessions are logged as engagements against the project |
| System does | W09, W10 as for any project |
| Record changes | Project, work packages, milestones, engagements |
| Notified | As S1 |
| Can stall | Support that never ends: the Outcome recorded milestone has a due date, and Portfolio shows the project Amber then Red if it is missed **[new: B11]** |

### 8.4 The portfolio view of one startup

| Lane | Detail |
| --- | --- |
| Who | The ED, Startups and investment staff, the account owner |
| Sees | Company 360 of the startup: "Support given" (support projects with health), "Introductions" (opportunities where it is the portfolio company, with stage), last contact, account owner **[new: B6, B8]** |
| Does | Reads; logs a check-in (S3) |
| System does | The company lapses after 60 days without an engagement, like a key account; listed in "Portfolio companies not engaged in 60 days" **[new: B8]** |
| Record changes | Engagement |
| Notified | Nobody |
| Can stall | No account owner on the startup: "Hygiene: missing key fields" (companies) lists it on Monday |

---

## 9. Journey 7: Go-to-market campaign into one sector

**Trigger:** the ED decides to take a set of KUEC capabilities or technologies into one sector (for example advanced manufacturing). **Case:** project, Type Campaign **[new: B14]**, with a target sector, owned by a BD officer. **Steps** (proposed, for the ED's sign-off): Campaign objective (BD officer, the ED, 5), Target list (Data analyst, BD officer, 5), Outreach (BD officers, the ED, 20), Workshop (optional child project), Convert to opportunities (BD officer, the ED, 5), Review and close (BD officer, the ED, 3). **Registry:** the companies imported on day one (`runbooks/09-import.md`) and added since, with Sector, Size class, Account tier, Offset obligor. **Screens:** Intake, Project room, Company 360, Team board, Debrief, Portfolio.

### 9.1 Objective

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Intake; the campaign is opened from Home like any request (tile 6's sibling for the ED and BD officers, "Run a campaign into a sector", with a sector picker) **[new: B14]** |
| Does | Describes the offer, picks the sector, Confirm; then S1 loop on the objective (offer, uVENTURE links, targets: companies to reach, meetings, opportunities) |
| System does | Project with `targetSector`; W09 template |
| Record changes | Project, work packages, milestones |
| Notified | The ED |
| Can stall | As S1 |

### 9.2 Target list from the registry

| Lane | Detail |
| --- | --- |
| Who | Data analyst (owner), BD officer (reviewer) |
| Sees | Project room **Targets** block with **Add from the registry** **[new: B16]**: the companies in the sector, sorted by tier then last engagement, with size class and offset obligor, and how many people of decision roles each has |
| Does | Ticks companies to add; ranks; adds a fit line for the top ones |
| System does | One Target per company, status To contact. Companies with no sector never appear, which is why the hygiene view for companies matters before a campaign |
| Record changes | Targets |
| Notified | BD officer |
| Can stall | Registry gaps (no sector, no contact): "Hygiene: missing key fields" (companies) and "Hygiene: missing email or decision role" (people) are the fix lists |

### 9.3 Assign and run outreach

| Lane | Detail |
| --- | --- |
| Who | BD officers, ops coordinator (assigns), the ED (reviews progress) |
| Sees | Targets block with an owner per target; each BD officer's Home lists "Contact {company} for {campaign}" when their targets are To contact **[new: B16]** |
| Does | Ops coordinator splits targets between BD officers (account owners keep their accounts). Each BD officer contacts and logs (S3), answering "Where does this leave {company}?" |
| System does | Target status and `lastContactAt` from the engagement; 10 working days without a reply creates a follow-up Task; the engagement is linked to the campaign project **[new: B13, B16]** |
| Record changes | Targets, engagements, company stamps |
| Notified | BD officers (follow-ups) |
| Can stall | Targets left at To contact: the Project room funnel ("40 targets: 12 contacted, 5 in discussion") makes it visible; the Outreach step's due date carries the overdue ladder |

### 9.4 Workshop (optional)

| Lane | Detail |
| --- | --- |
| Who | BD officer |
| Sees | Project room action "Add a workshop to this campaign" |
| Does | Opens Intake for a workshop, prefilled with the campaign as parent |
| System does | A Workshop project with `parentProject` = the campaign **[new: B14]**; its invitees default to the campaign's targets in discussion. Journey 3 from there |
| Record changes | Project |
| Notified | As Journey 3 |
| Can stall | As Journey 3 |

### 9.5 Convert to opportunities

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Project room primary action **Turn interest into opportunities**, listing targets In discussion and workshop attendees marked Interested |
| Does | Debrief as in 5.7 |
| System does | Opportunities with `originProject` = the campaign (or the workshop), source Outreach or Event **[new: B9]** |
| Record changes | Opportunities, targets |
| Notified | Step-1 owners |
| Can stall | As 5.7 |

### 9.6 Review and close

| Lane | Detail |
| --- | --- |
| Who | The ED, BD officer |
| Sees | Project room funnel: targets, contacted, in discussion, opportunities, pipeline value from those opportunities, signed |
| Does | BD officer submits a one-paragraph review note (SharePoint); the ED approves; Close the project |
| System does | Counts derived from Targets and `originProject`; nothing typed |
| Record changes | Work package, project |
| Notified | The ED |
| Can stall | As 5.8 |

---

## 10. Journey 8: Project delivery, kick-off to close

**Trigger:** an opportunity is Signed (RFQ, industry challenge, sometimes a licence with a development phase). **Case:** project, Type Delivery, owned by a developer. **Steps** (`project-templates.json`, marked "draft for ED review", backlog decision D3): Kick-off (Developer, ops coordinator, 5), Delivery plan (Developer, BD officer, 5), Execution (Developer, the ED, 20), Client acceptance (BD officer, the ED, 5), Close-out (ops coordinator, the ED, 3). **Milestones:** Kicked off, Plan approved, Work delivered, Client accepted, Closed out. **Health:** W10 sets Red on a missed milestone, Amber when an open milestone is due within 7 days. **Screens:** Project room, card, Team board, Portfolio, Exceptions.

### 10.1 Hand-off creates the project

| Lane | Detail |
| --- | --- |
| Who | Nobody; then the developer |
| Sees | Developer: offer "Kick-off" with the Context "Part of {project}, for {company}. From {opportunity}, signed on {date}." |
| Does | Accept |
| System does | On Signed, a Delivery project with company, opportunity, owner = the least-loaded active Developer, Type Delivery; W09 creates work packages and milestones **[new: B15]**. Today: the BD officer creates the project by hand in Delivery hand-off |
| Record changes | Project, 5 work packages, 5 milestones |
| Notified | Developer; the BD officer's Delivery hand-off step continues (4.8) |
| Can stall | No active Developer: the ops coordinator gets it (W09's rule), and it shows in their Team board column |

### 10.2 Kick-off

| Lane | Detail |
| --- | --- |
| Who | Developer (owner), ops coordinator (reviewer) |
| Sees | Card; Project room |
| Does | Holds the kick-off with the client (logged as an engagement against the project, S3 from the Project room); S1 loop |
| System does | Milestone Kicked off closes on approval **[new: B11]** |
| Record changes | Engagement, work package, milestone, `percentComplete` |
| Notified | Ops coordinator |
| Can stall | More than 5 working days after the PO: overdue ladder |

### 10.3 Delivery plan

| Lane | Detail |
| --- | --- |
| Who | Developer (owner), BD officer (reviewer) |
| Sees | Card; Submit asks "How many working days will the work take?" **[new: B12]** |
| Does | Plan on SharePoint; S1 loop |
| System does | The answer sets Execution's `dueOffsetBusinessDays` (the field exists) so its due date and the Work delivered milestone are right when released, and the project's `endDate` |
| Record changes | Work packages, project `endDate`, milestone |
| Notified | BD officer |
| Can stall | Plan says 60 days but the template says 20: without this question, the project goes Red on a date nobody believed |

### 10.4 Execution

| Lane | Detail |
| --- | --- |
| Who | Developer (owner), the ED (reviewer) |
| Sees | Project room health "Amber: Work delivered is due Thu 20 Nov"; the developer's Home |
| Does | The work; client contacts logged against the project; Request help or Blocked when stuck |
| System does | W10 daily health; an open milestone past its due date becomes Missed and the project Red, by the daily sweep **[new: B11]** (today a person must set Missed, so Red rarely happens) |
| Record changes | Milestone status, project health |
| Notified | The ED for blocks and +2 overdue; Portfolio shows Red |
| Can stall | Red stays Red: Health is written only by the app, so nobody can clear it today. The ED's **Agree recovery** on the Project room or Portfolio records the plan and sets Amber **[new: B11]** |

### 10.5 Client acceptance

| Lane | Detail |
| --- | --- |
| Who | BD officer (owner), the ED (reviewer) |
| Sees | Card; Submit asks "Did the client accept the work?" Yes / They asked for changes **[new: B12]** |
| Does | Gets written acceptance (link); S1 loop |
| System does | "They asked for changes" returns Execution to In progress with the note, and this step to Not started |
| Record changes | Work packages, milestone |
| Notified | Developer on changes; the ED on submit |
| Can stall | Client slow to sign off: overdue ladder on the BD officer, who owns the client relationship |

### 10.6 Close-out

| Lane | Detail |
| --- | --- |
| Who | Ops coordinator (owner), the ED (reviewer) |
| Sees | Card; Project room **Close the project** after the last milestone |
| Does | Invoicing trigger and lessons learned (outside Twenty, linked); S1 loop; closes the project |
| System does | Project Done; Portfolio moves it to "Done this quarter" |
| Record changes | Work package, milestone, project status |
| Notified | The ED |
| Can stall | As 5.8 |

---

## 11. Screens

### 11.1 The brief's four screens, by persona

The brief specifies Home, Intake, the Work package card and Exceptions for BD staff and the ED. Two personas are added here, and two behaviours change.

**Which variant a person gets** is decided by what they are, never by an id: the playbook role assignments (ED, Ops coordinator) and, for the Leadership viewer, the fact that a work package read is refused for their role. Everyone else (BD officers, engineers, department staff) gets the staff variant.

| Screen | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| **Home**, on arrival | Brief section 3, ED variant. **Change:** Declined items appear only when no new owner has been picked after 1 working day (the ops coordinator handles them first, as `runbooks/10-cadence-en.md` already tells the team) **[new: B2]** | Brief section 3 | **[new: B2]** Line under the subtitle "18 open work packages, 4 need attention. Open the Team board". Needs your decision: Declined (Give to {suggested}), waiting 2+ working days (Nudge, which re-sends the offer email; or Give to someone else), help requests addressed to them, reviews they owe, due-date requests **[new: B18]**. Your next actions: their own steps (Logistics, Close-out) | **[new: B2]** "Here's where things stand." Three numbers it can read: open pipeline value, signed this quarter, projects off track. Primary "Open the BD dashboard", secondary "Open Portfolio". Nothing else |
| Home, primary action | "What would you like to get done?" | Same | Same | "Open the BD dashboard" |
| Home, one click away | Exceptions, every decision card | Intake, every card | Team board, every card | Portfolio |
| Home, hidden | Other people's routine progress (only "{n} need a nudge") | Team-wide lists | Nothing team-wide is hidden; routine progress collapsed | Everything about work packages and people |
| **Intake** | Tile 7 Strategic partnership; "Who will own this case?" **[new: B4, B14]** | Six tiles | "Who will own this case?" | Not offered: the New request command needs Opportunity create, which the role lacks; the message "You don't have access to create cases" is shown if reached |
| **Work package card** | Brief section 5.4 ED column. **Change:** an ED-owned step with no reviewer shows Approve and Send back directly, without Accept first **[new: B1]** | Brief section 5.4 | Same as ED for Blocked and Declined items, plus Reassign (the Team board's control) | Not reachable: no read on work packages |
| **Exceptions** | Whole team | Own items | Whole team | Not reachable; the sidebar entry shows the no-access state with a link to the BD dashboard |

**Change to the Request help helper.** The shipped card sends help to the ops coordinator; the brief sends it to the reviewer, then the case owner, then the ED. The reviewer knows the work; B1 follows the brief and `runbooks/10-cadence-en.md` section 5 is updated with it.

### 11.2 Team board [new: B7]

**Surface:** standalone page "Team board", one tab, one FRONT_COMPONENT widget; sidebar item after Exceptions. **Purpose:** who has what, what is stuck, and moving work in one button. **Fallback link:** "Open as list", Work packages view "Everything (expert)".

```
+------------------------------------------------------------------------------------------+
| Team board                                                            Open as list       |
| 23 open work packages. 5 need attention.          [x] Only what needs attention          |
|                                                                                          |
| Needs someone 2   | Sara  BD officer   | Omar  Developer    | Layla  Data analyst | ...  |
| (no owner,        | 5 open . 1 late    | 7 open . 2 waiting | 2 open              |      |
|  or declined)     |                    |                    |                     |      |
| +---------------+ | +----------------+ | +----------------+ | +-----------------+ |      |
| | ! Declined    | | | ! Late since   | | | ! Waiting 3d   | | | Partner         | |      |
| | Scoping       | | |   Tue 14 Oct   | | | Scoping        | | |   shortlist     | |      |
| | ADNOC: corr.. | | | Bid or no-bid  | | | Masdar: batt.. | | | Licence: memb.. | |      |
| | "On leave     | | | EGA: dust ..   | | | Due Thursday   | | | Due 30 Oct      | |      |
| |  from 20 Oct" | | | In progress    | | | Waiting to be  | | | In progress     | |      |
| | [Give to Omar]| | | (Reassign)     | | |  accepted      | | | (Reassign)      | |      |
| | (Choose)      | | +----------------+ | | (Reassign)     | | +-----------------+ |      |
| +---------------+ | | Outreach       | | +----------------+ |  + 1 planned        |      |
|                   | | Due 30 Oct     | | ...                |                     |      |
|                   | | (Reassign)     | |                    |                     |      |
|                   | +----------------+ |                    |                     |      |
|                   |  + 3 planned       |  + 2 planned       |                     |      |
| Updated just now . Refresh                                                               |
+------------------------------------------------------------------------------------------+
```

- **Columns:** "Needs someone" first (work packages with no owner, and Declined ones); then every active member with a playbook role assignment, in a fixed order (playbook role order, then first name) so people learn positions. For a viewer who is not the ED or the ops coordinator, their own column comes right after "Needs someone". Column header: first name, playbook role, "{n} open . {m} late", and the header opens the Team member page in the side panel.
- **Cards:** Offered, Accepted, Submitted and Blocked work packages. Planned ones are a "+ {n} planned" line at the foot of the column that expands in place. Done and Cancelled are not shown. Within a column: Blocked, Declined, Late, Waiting 2+ working days, then by due date. Flags use the same rules as the escalations (`STATUSES_WITH_DUE_TIMER`, the business-day calendar), imported from the app. A Submitted card reads "with {reviewer} for review".
- **Reassign:** secondary button on every card, primary on "Needs someone" cards ("Give to {suggested first name}"). It expands a picker in the card: people of the step's playbook role first, each with their open count, the suggested one (fewest open in the role, not the current owner) preselected; then everyone else. Confirming opens the brief's modal "Give this to {name}?". Writes: `ownerId`; and `status` Offered unless the card was Planned, so W02 notifies the new owner and arms the acceptance timers. The previous owner is told "Given to {name}: {title}" **[new: B7]**. The card collapses from its column and appears at the top of the new one, highlighted for 2 s (the person moved it, so it may move while they look). A Submitted card has **Change reviewer** instead.
- **"Only what needs attention":** the one toggle, remembered per viewer in `localStorage`. On: columns show only flagged cards; empty columns collapse to their header.
- **States:** loading shows every column header (they load first) with skeleton cards; empty "Nothing open. Every work package is done or not started yet."; error per column as in the brief; no access (Leadership viewer) "This page needs access to work packages. Open the BD dashboard".

| | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Sees on arrival | All columns, toggle on (flagged only) | All columns, own column second, toggle off, no buttons | All columns, toggle off | No-access state |
| One primary action | Give to {suggested} on "Needs someone" | None (read-only: their role cannot write Owner) | Give to {suggested} on "Needs someone"; Reassign elsewhere | Open the BD dashboard |
| One click away | Work package card (side panel), Team member page | Card, Team member page | Card, Team member page, Exceptions | |
| Hidden | Done, Cancelled, Planned detail, dates and done criteria editing (Exceptions and the native record do that) | Same, plus Reassign | Same | Everything |

### 11.3 Project room [new: B13]

**Surface:** FRONT_COMPONENT widget at the top of the project record page (a new record page layout: room, then FIELDS, TASKS, NOTES, TIMELINE). **Purpose:** where a project stands and what happens next, in milestone order. **Fallback link:** "Show all fields".

```
+------------------------------------------------------------------------+
| PROJECT                                              Show all fields   |
| ADNOC corrosion testing: delivery                                      |
| (At risk) Delivery . Omar . for ADNOC . from ADNOC: corrosion testing  |
| Work delivered is due Thu 20 Nov.                    [=====-----] 40%  |
|                                                                        |
| [ Submit Execution ]                                                   |
|                                                                        |
| Milestones                                                             |
|  (v) Kicked off              done Mon 3 Nov                            |
|  (v) Plan approved           done Fri 7 Nov                            |
|  ( ) Work delivered          Due Thu 20 Nov       At risk              |
|        Execution . Omar . In progress . Due Thu 20 Nov                 |
|  ( ) Client accepted         Around 27 Nov                             |
|        Client acceptance . Sara . Not started                          |
|  ( ) Closed out              Around 2 Dec                              |
|                                                                        |
| Contacts with the client                                Log a contact  |
|  Meeting . Tue 11 Nov . Dr. Hamad: "Samples arrive Monday"             |
|  Next: call Dr. Hamad on Mon 17 Nov                                    |
+------------------------------------------------------------------------+
```

- **Header:** name, health badge in words (On track, At risk, Off track) with the reason (the milestone that made it so), type, owner, company, origin opportunity (link), percent complete as a bar.
- **One primary action**, the first that applies: Off track and viewer is the ED: **Agree recovery** (expands "What's the plan?" and a new date for the missed milestone; the route sets Health to At risk, stamps `recoveryAgreedAt`, writes a Note) **[new: B11]**; the viewer owns the current step: that step's card action (Accept, Submit); all milestones done and viewer owns the project: **Close the project**; workshop or campaign after its Run or Outreach step: **Turn interest into opportunities**. Otherwise no primary action.
- **Milestones in order,** each with its closing work package (owner, badge, due label). A work package row opens the card in the side panel.
- **Engagements** linked to the project **[new: B13]** (latest 3, next planned), with **Log a contact** (S3, project prefilled).
- **Type blocks:** Workshop: invitees funnel (invited, registered, attended, interested) and "Attendance not recorded yet". Campaign: targets funnel and the opportunities created with their value. Both from Targets **[new: B16]**; until B16 ships these blocks are absent.

| | ED | BD officer (owner or not) | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Sees on arrival | Header, primary action, milestones | Same; buttons only on their own steps | Same | Header and milestones only (no work packages, no engagements: their role cannot read them); "Some details are only visible to the BD team." |
| One primary action | Agree recovery when Off track, else as the rule above | Their step's action, or Close the project | As the rule above | None |
| One click away | Card, opportunity, company (Company 360) | Same | Same, plus Team board | Opportunity, company |
| Hidden | `playbookApplied`, `closeTaskCreatedAt`, playbook step keys, raw percentages | Same | Same | Same |

### 11.4 Company 360 [new: B6]

**Surface:** FRONT_COMPONENT widget at the top of the company record page (new record page layout: 360, FIELDS, then Twenty's tabs). **Purpose:** everything about one relationship and what happens next. **Fallback link:** "Show all fields".

```
+------------------------------------------------------------------------+
| COMPANY                                              Show all fields   |
| ADNOC Onshore   أدنوك البرية                                           |
| Oil and gas . Tier 1 (strategic) . Large enterprise . Offset obligor   |
| Account owner Sara . Last contact 12 days ago: site visit              |
|                                                                        |
| Next with ADNOC: Send revised quote, by Thu 23 Oct (Sara)              |
| [ Log a contact ]                                                      |
|                                                                        |
| People                                                  Add a person   |
|  Decision maker      * Dr. Hamad Al ...   VP Technology   High         |
|  Budget holder         (nobody recorded)                               |
|  Technical evaluator   Aisha ...          Lab manager     Medium       |
|  Not classified 3                                              v       |
|                                                                        |
| Open cases 3                                                           |
|  Corrosion testing . Propose . Sara . Next: send quote, Thu 23 Oct     |
|  Lab access for composites . Qualify . Omar . Late since Tue 14 Oct    |
|  From the visit on Mon 13 Oct: 2 more                          v       |
| Closed: 4 signed, 2 lost                                       v       |
|                                                                        |
| Contacts            Contracts                   Projects               |
|  Visit . 13 Oct      Service . Signed . to 2027  Delivery . At risk    |
|  Call . 2 Oct        NDA . Expiry not set                              |
+------------------------------------------------------------------------+
```

- **Next with {company}:** the earliest dated next step across the company's open opportunities and its engagements' next steps, with its owner. None: "No next step with {company}." in amber.
- **Primary action: Log a contact** (S3). It is also the way to plan a visit (a future date).
- **People** grouped by decision role, in the order Decision maker, Budget holder, Technical evaluator, Influencer, End user, Gatekeeper, then "Not classified" collapsed; within a role by influence (High, Medium, Low **[new: B6]**), champions starred. Roles the company has nobody for show "(nobody recorded)", which is the stakeholder gap. **Add a person** searches by email first and only then offers "Add {name} at {company}", which is the duplicate check `email-calendar-sync.md` asks people to do by hand.
- **Open cases** with stage label, owner, next step or late flag; grouped by origin visit or event when there is one **[new: B9]**; Introductions and Support given for portfolio companies **[new: B8]**; closed cases collapsed as counts.
- **Contacts** (latest 5 engagements, and a planned one), **Contracts** (Signed and In negotiation, expiry, "Expiry not set", "Expires in 60 days"), **Projects** with health.

| | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Sees on arrival | Header, next step, all blocks | Same | Same, plus a hygiene line when Sector, Size class or Account owner is missing | Header, open cases, contracts, projects. No people, no contacts (role cannot read them) |
| One primary action | Log a contact | Log a contact | Log a contact | None |
| One click away | Each person, case, contract, project; Debrief from a visit row | Same | Same, plus Merge (native, theirs alone) | Each case, contract, project |
| Hidden | `keywords`, `lastEngagementAt` and `engagementLapsesAt` as raw dates (shown as "12 days ago" and the lapse warning), import fields | Same | Same | Same |

### 11.5 Team member page and My week [new: B18]

**Surface:** one front component on two surfaces. For a colleague: the side panel (`ViewFrontComponent` with `recordId` = the workspace member and `objectNameSingular: 'workspaceMember'`), opened from a Team board column header, a name on Exceptions or the ED's Home. For oneself: standalone page "My week", linked from Home's footer ("Your week"). **Fallback link:** "Open My work" (self) or "Open as list" (Work packages view "Everything (expert)").

```
+------------------------------------------------------------+
| Omar                                       Open as list    |
| Developer . 7 open . 2 waiting to be accepted . 0 late     |
|                                                            |
|  Mon 20   Tue 21   Wed 22   Thu 23   Fri 24                |
|  -        Scoping  -        Quote    Visit                 |
|           Masdar            review   Aldar                 |
|                                                            |
| Waiting to be accepted 2                                   |
|  Scoping . Masdar: battery thermal . offered 3 days ago    |
|                                       (Reassign)           |
| In progress 4  ...                                         |
| Their cases 3                                              |
|  Lab access for composites . Qualify . Next: call, Thu 23  |
+------------------------------------------------------------+
```

- **Their week:** Monday to Friday of the current week in Asia/Dubai, holidays greyed with their name; each day lists due work packages, next actions, engagements they own and milestones they own.
- **Their work:** open work packages grouped by status, the same rows as the Team board.
- **Their opportunities:** open opportunities they own, with next step or "No next step", and stale flags.
- **Primary action:** the ED or the ops coordinator viewing someone: **Reassign** on a card (the Team board's control). Viewing oneself: **Ask for more time** on a card that is late or due within 2 working days: "New date" and "Why?", sent through the route `work-package-more-time`, which writes a Task for the ops coordinator and a Note; the request shows on the ops coordinator's Home and on Exceptions with "New due date" preset to the asked date **[new: B18]**. BD officers cannot write due dates (`13-roles.md`), so this is the only way to ask inside the CRM.

| | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Sees on arrival | The colleague's week, work, cases | Self: My week. Colleague: their week and work, read-only | Colleague's week, work, cases | Not reachable |
| One primary action | Reassign | Self: Ask for more time. Colleague: none | Reassign | |
| One click away | Card, opportunity | Card, opportunity | Card, opportunity, Team board | |
| Hidden | Personal data beyond name and role; anything about leave (not in Twenty) | Same | Same | |

### 11.6 Portfolio [new: B17]

**Surface:** standalone page "Portfolio", one tab, one FRONT_COMPONENT widget; sidebar item after BD Executive. Reads only Project, Milestone, Opportunity and Company, so it works for the Leadership viewer. **Fallback link:** "Open as list", view Projects "By health".

```
+------------------------------------------------------------------------+
| Portfolio                                            Open as list      |
| 12 active projects: 8 on track, 3 at risk, 1 off track.                |
|                                                                        |
| Off track 1                                                            |
|  ADNOC corrosion testing: delivery . Delivery . Omar           40%     |
|  Missed: Work delivered, due Thu 20 Nov                                |
|  [ Agree recovery ]                                                    |
|                                                                        |
| At risk 3                                                              |
|  Composites workshop . Workshop . Sara                         60%     |
|  Logistics confirmed is due Fri 28 Nov                                 |
|  ...                                                                   |
| On track 8                                                     v       |
| Ready to close 1 . On hold 1 . Done this quarter 4             v       |
| Updated just now . Refresh                                             |
+------------------------------------------------------------------------+
```

- Bands Off track, At risk, On track (Red, Amber, Green relabelled in words); within a band, the soonest milestone first. Each row: name, type, owner, company, percent complete, the reason line (the missed or due-soon milestone), and for campaigns and workshops the opportunities created so far.
- "Ready to close" for projects whose milestones are all done but whose status is still Active.

| | ED | BD officer | Ops coordinator | Leadership viewer |
| --- | --- | --- | --- | --- |
| Sees on arrival | All bands, Off track and At risk expanded | Same; own projects marked | Same | Same, without owner actions |
| One primary action | Agree recovery on an Off track row | None | Close on a "Ready to close" row | None (read-only); each row opens the project |
| One click away | Project room | Project room | Project room | Project record (the room shows what their role reads) |
| Hidden | Work packages (the room has them), engagements | Same | Same | Same |

---

## 12. Mobile

Twenty is a responsive web app with no native client and no push notifications of its own. On a phone, KUEC staff live in Outlook and Teams, so **the notification is the entry point and the deep link is the screen**. Every notification must be enough to decide from the lock screen, and its link must land on a screen whose first view holds the one button the notification asks for.

### 12.1 Channels

| Channel | Reaches | Used for | Limits |
| --- | --- | --- | --- |
| Email from the bd-ops mailbox | One person, as an Outlook push on their phone | Every personal action: offers, reviews, overdue, help requests, next step missing, Ask for more time answers | Plain text today (`send-email.ts`) |
| Teams channel post (incoming webhook) | The BD channel, not a person | Team-visible events: playbook started, reassigned to the ops coordinator, blocked, signed | An incoming webhook cannot message a person or mention someone reliably. Personal Teams messages need a bot registered in Entra, which is out of scope |
| Task in Twenty | The person, on Home | The durable record of what is owed; closes itself when the condition clears **[new: B5]** | Not a push |

### 12.2 The email **[new: B10]**

```
Subject:  Accept or decline: Scoping, ADNOC corrosion testing . due Thu 30 Oct
          (action verb first; under 70 characters; case name cut at a word)

Offered to you, please accept or decline: Scoping, ADNOC corrosion testing.
Define the technical work the client needs.
Due Thursday 30 Oct. Offered by Sara's case.

Open it:
https://crm.kuec.example/object/workPackage/3f1c...
```

- Line 1 is the existing 20-word message, unchanged, so Task, email and Teams still agree word for word. Up to three fact lines follow (objective or reason, due label, who it comes from). The link is alone on the last line so every mail app makes it one tap.
- Subject leads with the action: "Accept or decline:", "Review:", "Blocked, decide:", "Late:", "Set a next step:", "Help needed:".
- Language: the recipient's workspace locale; Arabic recipients get the Arabic strings from the brief's catalogs, with Western digits.
- Teams posts carry the same line plus an **Open** button (Adaptive Card `Action.OpenUrl`) to the same link.

### 12.3 Where each link lands

| Notification | Link | Lands on |
| --- | --- | --- |
| Offer, overdue, sent back, help answered | `/object/workPackage/{id}` | The work package record page; the card is the first widget, above FIELDS **[new: B1]** (today it sits after Fields, which pushes it below the fold on a phone) |
| Review, blocked, declined, tight deadline | `/object/workPackage/{id}` or `/object/opportunity/{id}` | The card (reviewer and ED buttons), or the opportunity |
| Set a next step | `/object/opportunity/{id}` | The opportunity; on a phone, the "Done, what's next?" form is quicker from Home, which the email names as the second option |
| Close the project, milestones | `/object/project/{id}` | Project room (read on a phone, act on a desk) |

If the session has expired, Twenty asks the person to sign in first; acceptance check M3 in `backlog.md` confirms that it then returns to the linked record and not to Home.

### 12.4 What must work on a phone

| Screen | Phone | What that means |
| --- | --- | --- |
| **Work package card** | Must | 360 to 430 px wide. The badge, due label and the one or two buttons are visible without scrolling at 390 x 844. Buttons 44 px high, full width, stacked. Inline forms (Decline, Request help, Submit) open in place with the keyboard up; the confirm button stays above the keyboard. Paste a SharePoint link from the Share sheet. "Original request" collapsed by default |
| **Home** | Must | One column (it already is). Field-shaped primary action stays, but Intake opens as a full-screen side panel. Decision items keep their primary button; "Read the brief" opens the card full screen |
| **Team board** | Must | Below 600 px the columns become a list of people (header row per person with counts and flags), each expanding to its cards. Reassign works the same way: the picker expands inside the card. "Only what needs attention" on by default on a phone |
| Company 360 | Should | Read before and after a visit; **Log a contact** works as a single-column form. The rest may be cramped |
| Intake and Debrief | May not | They work (full-screen side panel), but pasting long emails and confirming several cases is desk work |
| Exceptions | May not | The Thursday review runs on a screen in a room |
| Project room, Portfolio, Team member page | May not | Readable; not laid out for a phone. The native BD dashboard is Twenty's own and follows its responsive layout |
| Settings, sidebar editing | No | Twenty's "Edit navigation" is desktop only (`config/dashboards/sidebar.md`) |

---

## 13. Friction log

What Twenty's native UI makes hard for a first-year BD officer, and the fix. Ranked by how often it is hit across the team in a normal week. Hits and minutes are estimates from the volumes in `backlog.md` section 1, to be replaced by measured counts after four weeks of use (`backlog.md` section 5). "Minutes lost" includes rework when the native path leads to a mistake.

| # | What is hard in native Twenty | Who | Hits per week | Minutes lost per week | Mitigation | Until it ships |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | **Field-heavy work package record.** About 25 fields, 10 of them system stamps (`acceptReminderSentAt`, `overdueEdNotifiedAt`, ...), with objective, expected output and done criteria buried among them | Everyone who owns or reviews a step | 150 | 75 | Card as the first widget, FIELDS collapsed under it (B1) | Card exists on the Home tab after Fields; open it from the command "Open work package card" |
| F2 | **Finding what is mine.** About 70 views across eight objects; "my offers", "my reviews", "my late work", "my opportunities without a next step" are four different views | Everyone, several times a day | 135 | 135 | Home, by persona (B2) | Native Home page (three tables), My work |
| F3 | **Moving work forward means editing a raw Status select** whose values are system words (Offered, Accepted, Submitted) with no transition rules: nothing stops Done without review, or Accepted on someone else's step (T6) | Owners and reviewers | 90 | 225 | Card buttons in plain words; reviewers approve from Home (B1, B2) | Card covers Accept, Decline, Request help, Submit; reviewers still use Status |
| F4 | **Notification Tasks never close.** Every offer, reminder, block, review and 08:00 nag creates a Task that stays open after the condition clears; within weeks the Tasks list hides real to-dos | Everyone | 60 | 60 | Tasks close themselves when their condition clears; overdue in review goes to the reviewer (B5) | Ops coordinator closes stale ones on Monday |
| F5 | **Notifications are one English line and a bare URL**, and the link opens a dense record page on a phone | Everyone, mostly on a phone | 60 | 30 | Action-first subject, fact lines, card-first landing, recipient's language (B10, B1) | None |
| F6 | **Next action and date are two separate fields**, edited one at a time; finishing a step does not move them, so W04 nags owners of cases that are moving fine | Case owners | 40 | 75 | "Done, what's next?" on Home and Company 360; next action follows the playbook step (B2, B4, B6) | Inline edit on the opportunity |
| F7 | **Relations need the data model in your head**: an engagement must be linked to the company and the opportunity by hand, and the next step is copied only when the opportunity is linked | BD officers | 25 | 48 | Log a contact from Company 360 or the Project room fills the links from where you are (B6, B13) | Engagements "+ New" |
| F8 | **A company's context is spread** over Fields, People, Opportunities, the Engagements relation, Contracts, Projects, Emails and Timeline tabs; nothing says "what's next with them" | Before every call or meeting | 20 | 60 | Company 360 (B6) | Company record page |
| F9 | **Adding a person** means searching by email first, then creating the person, then linking the company; people are never created from mail by design | BD officers, data analyst | 15 | 30 | "Add a person" on Company 360 does the search and the link (B6) | Runbook steps in `email-calendar-sync.md` |
| F10 | **Acting on an exception takes several native edits**: reassigning is Owner plus Status, moving a date is Due plus a Note, asking someone is a Task by hand; the Thursday review edits cells live | The ED, the ops coordinator, the Thursday review | 15 | 90 | Exceptions with one button per decision (B3) | Native Exceptions page (three editable tables) |
| F11 | **Workload is invisible**: tables and kanbans group by Select fields only, so nothing groups by person | Ops coordinator, the ED | 10 | 50 | Team board (B7) | Work packages "Everything (expert)", sorted by owner |
| F12 | **Target lists live outside Twenty**: partner shortlists, campaign targets, workshop invitees and registrations have no structure, so the 10-working-day follow-up rules in the licence playbook cannot run | Data analyst, BD officers in outreach | 10 | 40 | Targets (B16) | Shortlist on SharePoint, linked from the work package |
| F13 | **Project state is manual**: milestones and work packages are two unordered relation lists; nothing closes a milestone when its work package is done or marks it missed when its date passes; Red can never be cleared (Health is app-only) | Project owners, the ED | 10 | 50 | Milestones follow their work package and Agree recovery (B11); Project room (B13) | Milestones view; ask an engineer to correct Health |
| F14 | **Facts the case needs are asked later, by a hygiene view**: Amount and Close date, the lost reason category, the number of unanswered follow-ups | BD officers, ops coordinator on Monday | 8 | 31 | Step questions on the card at the moment the person knows the answer (B12) | "Hygiene: missing key fields" on Monday |
| F15 | **Reassigning work**: Owner is locked for BD officers; the ops coordinator must change Owner and also set Status back to Offered, or the new owner is never told and no timer runs | Ops coordinator | 6 | 54 | Reassign and Give to on Team board, Home, Exceptions (B7, B2, B3) | Two-field edit, from the ops runbook |
| F16 | **Cases without a playbook** (industry challenge, startup, partnership, campaign) run on next action alone: no steps, no step owners, no escalation; the BD officer has to invent the plan | BD officers | 6 | 60 | New playbooks and templates (B8, B14) | Model the steps as Tasks |
| F17 | **Kanban drag that a field lock refuses** lands in the new column, shows an error, and snaps back only after a reload | BD officers on work package boards | 5 | 10 | Team board with buttons, never drag (B7) | Onboarding note: change status on the card, not on the board |
| F18 | **Health without a reason**: "Amber" or "Red" on a project says nothing about why; reading it means opening the project and its milestones | The ED, leadership | 5 | 30 | Portfolio and Project room reason lines (B17, B13); accurate health (B11) | Projects "By health" |
| F19 | **Creating a case**: "+ New" saves an opportunity with a name only; the person must know that Type starts the playbook and that Company, Source and Client deadline matter; a Type set at creation by API does not start it | BD officers | 4 | 88 | Intake (B4) | `10-onboarding.md` checklist |
| F20 | **BD officers cannot change a due date or done criteria** (field locks) and have no way to ask in the CRM | BD officers | 4 | 20 | Ask for more time (B18); "No done criteria yet. Ask {name}" (B1); New due date on Exceptions (B3) | Ask the ops coordinator in Teams |
| F21 | **Blocking takes two edits** (Status, then Blocked reason) on the full record, and an empty reason is accepted (T5); new staff do not know "blocked" from "need help" | Owners | 3 | 69 | Request help, "No, I'm stuck" (B1) | Cadence runbook section 5 |
| F22 | **No drafts**: a record exists from the first keystroke, so an abandoned half-filled opportunity sits in the pipeline and triggers the 08:00 nag | BD officers, ops coordinator | 2 | 10 | Intake keeps the draft in the browser and writes nothing until Confirm (B4); the card keeps unsent text (exists) | Ops coordinator deletes them |
| F23 | **One visit, several needs**: an engagement links one opportunity, so the other needs end up in the outcome text and are lost | Whoever visits | 1 | 50 | Debrief (B9) | Create each opportunity by hand after the visit |
| F24 | **The delivery project is created by hand** after Signed, with name, Type, company, opportunity and owner, before W09 can start | BD officer | 0.75 | 11 | Created on Signed (B15) | Delivery hand-off step's done criteria |
